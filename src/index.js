if (require('electron-squirrel-startup')) {
    process.exit(0);
}

const { app, BrowserWindow, shell, ipcMain, screen } = require('electron');
const { createWindow, updateGlobalShortcuts } = require('./utils/window');
const { setupGeminiIpcHandlers, stopMacOSAudioCapture, sendToRenderer } = require('./utils/gemini');
const { getLocalConfig, writeConfig } = require('./config');
const { focusMonitor } = require('./utils/focusMonitor');

const geminiSessionRef = { current: null };
let mainWindow = null;

function createMainWindow() {
    mainWindow = createWindow(sendToRenderer, geminiSessionRef);
    return mainWindow;
}

app.whenReady().then(async () => {
    createMainWindow();
    setupGeminiIpcHandlers(geminiSessionRef);
    setupGeneralIpcHandlers();
});

app.on('window-all-closed', () => {
    stopMacOSAudioCapture();
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    stopMacOSAudioCapture();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

function setupGeneralIpcHandlers() {
    // Config-related IPC handlers
    ipcMain.handle('set-onboarded', async (event) => {
        try {
            const config = getLocalConfig();
            config.onboarded = true;
            writeConfig(config);
            return { success: true, config };
        } catch (error) {
            console.error('Error setting onboarded:', error);
            return { success: false, error: error.message };
        }
    });



    ipcMain.handle('set-layout', async (event, layout) => {
        try {
            const validLayouts = ['normal', 'compact'];
            if (!validLayouts.includes(layout)) {
                throw new Error(`Invalid layout: ${layout}. Must be one of: ${validLayouts.join(', ')}`);
            }
            
            const config = getLocalConfig();
            config.layout = layout;
            writeConfig(config);
            return { success: true, config };
        } catch (error) {
            console.error('Error setting layout:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('set-stealth-mode', async (event, stealthMode) => {
        try {
            const validModes = ['stealth', 'visible'];
            if (!validModes.includes(stealthMode)) {
                throw new Error(`Invalid stealth mode: ${stealthMode}. Must be one of: ${validModes.join(', ')}`);
            }
            
            const config = getLocalConfig();
            config.stealthMode = stealthMode;
            writeConfig(config);
            return { success: true, config };
        } catch (error) {
            console.error('Error setting stealth mode:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('get-config', async (event) => {
        try {
            const config = getLocalConfig();
            return { success: true, config };
        } catch (error) {
            console.error('Error getting config:', error);
            return { success: false, error: error.message };
        }
    });

    // Focus Buddy - Todo IPC handlers
    ipcMain.handle('get-todo-list', async (event) => {
        try {
            const { getTodoList } = require('./config');
            const todoList = getTodoList();
            return { success: true, todoList };
        } catch (error) {
            console.error('Error getting todo list:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('add-todo-task', async (event, task) => {
        try {
            const { addTodoTask } = require('./config');
            const newTask = addTodoTask(task);
            return { success: true, task: newTask };
        } catch (error) {
            console.error('Error adding todo task:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('update-todo-task', async (event, taskId, updates) => {
        try {
            const { updateTodoTask } = require('./config');
            const updatedTask = updateTodoTask(taskId, updates);
            return { success: true, task: updatedTask };
        } catch (error) {
            console.error('Error updating todo task:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('delete-todo-task', async (event, taskId) => {
        try {
            const { deleteTodoTask } = require('./config');
            const success = deleteTodoTask(taskId);
            return { success: true, deleted: success };
        } catch (error) {
            console.error('Error deleting todo task:', error);
            return { success: false, error: error.message };
        }
    });

    // Focus Session IPC handlers
    ipcMain.handle('get-available-screens', async (event) => {
        try {
            const { desktopCapturer } = require('electron');
            const sources = await desktopCapturer.getSources({ types: ['screen'] });
            const screens = sources.map((source, index) => ({
                id: source.id,
                name: source.name || `Screen ${index + 1}`,
                thumbnail: source.thumbnail.toDataURL()
            }));
            return { success: true, screens };
        } catch (error) {
            console.error('Error getting available screens:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('start-focus-session', async (event, sessionData) => {
        try {
            const { startFocusSession } = require('./config');
            const session = startFocusSession(sessionData);
            
            // Get API key from the renderer process
            let apiKey = null;
            try {
                apiKey = await event.sender.executeJavaScript('localStorage.getItem("apiKey")');
            } catch (err) {
                console.warn('Could not get API key from renderer:', err);
            }
            
            // Initialize Gemini for focus monitoring
            await focusMonitor.initializeGemini(apiKey);
            
            // Start screen monitoring for this session
            await focusMonitor.startMonitoring(session.id, sessionData);
            
            return { success: true, session };
        } catch (error) {
            console.error('Error starting focus session:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('end-focus-session', async (event, sessionId) => {
        try {
            const { endFocusSession } = require('./config');
            const success = endFocusSession(sessionId);
            
            // Stop screen monitoring for this session
            await focusMonitor.stopMonitoring(sessionId);
            
            return { success: true, ended: success };
        } catch (error) {
            console.error('Error ending focus session:', error);
            return { success: false, error: error.message };
        }
    });

    // Screen number popup handler
    ipcMain.on('show-screen-number', (event, screenNumber) => {
        try {
            const displays = screen.getAllDisplays();
            
            if (displays[screenNumber - 1]) {
                const display = displays[screenNumber - 1];
                const { x, y, width, height } = display.bounds;
                
                // Create a popup window on the actual screen
                const popup = new BrowserWindow({
                    width: 200,
                    height: 100,
                    x: x + Math.floor(width / 2) - 100,
                    y: y + Math.floor(height / 2) - 50,
                    frame: false,
                    alwaysOnTop: true,
                    skipTaskbar: true,
                    resizable: false,
                    webPreferences: {
                        nodeIntegration: false,
                        contextIsolation: true
                    }
                });
                
                popup.loadURL(`data:text/html,
                    <html>
                        <body style="
                            margin: 0;
                            padding: 20px;
                            background: rgba(0, 0, 0, 0.8);
                            color: white;
                            font-family: Arial, sans-serif;
                            font-size: 24px;
                            font-weight: bold;
                            text-align: center;
                            border-radius: 10px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            user-select: none;
                        ">
                            Screen ${screenNumber}
                        </body>
                    </html>
                `);
                
                // Close popup after 2 seconds
                setTimeout(() => {
                    if (!popup.isDestroyed()) {
                        popup.close();
                    }
                }, 2000);
            }
        } catch (error) {
            console.error('Error showing screen number popup:', error);
        }
    });

    // API Key validation
    ipcMain.handle('validate-api-key', async (event, apiKey) => {
        try {
            console.log('Validating API key...');
            
            // Simple HTTP request to test the API key
            const https = require('https');
            
            const testRequest = () => {
                return new Promise((resolve, reject) => {
                    const options = {
                        hostname: 'generativelanguage.googleapis.com',
                        port: 443,
                        path: '/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey,
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    };

                    const postData = JSON.stringify({
                        contents: [{
                            parts: [{
                                text: "Hello"
                            }]
                        }]
                    });

                    const req = https.request(options, (res) => {
                        let data = '';
                        res.on('data', (chunk) => {
                            data += chunk;
                        });
                        res.on('end', () => {
                            if (res.statusCode === 200) {
                                console.log('API key validation successful');
                                resolve({ success: true });
                            } else {
                                console.log('API key validation failed with status:', res.statusCode);
                                resolve({ success: false, error: 'Invalid API key' });
                            }
                        });
                    });

                    req.on('error', (error) => {
                        console.error('Request error:', error);
                        reject(error);
                    });

                    req.write(postData);
                    req.end();
                });
            };

            const result = await testRequest();
            return result;
            
        } catch (error) {
            console.error('Error validating API key:', error);
            return { success: false, error: `Validation failed: ${error.message}` };
        }
    });

    ipcMain.handle('quit-application', async event => {
        try {
            stopMacOSAudioCapture();
            app.quit();
            return { success: true };
        } catch (error) {
            console.error('Error quitting application:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('open-external', async (event, url) => {
        try {
            await shell.openExternal(url);
            return { success: true };
        } catch (error) {
            console.error('Error opening external URL:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.on('update-keybinds', (event, newKeybinds) => {
        if (mainWindow) {
            updateGlobalShortcuts(newKeybinds, mainWindow, sendToRenderer, geminiSessionRef);
        }
    });




}
