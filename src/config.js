const fs = require('fs');
const path = require('path');
const os = require('os');

// Default configuration
const DEFAULT_CONFIG = {
    onboarded: false,
    stealthLevel: "balanced",
    layout: "normal",
    // Focus Buddy specific configurations
    userProfile: {
        background: "",
        preferences: {
            reminderFrequency: 30, // minutes
            screenCaptureInterval: 30, // seconds
            enablePomodoro: false,
            pomodoroWorkTime: 25, // minutes
            pomodoroBreakTime: 5, // minutes
            enableWebcam: false
        }
    },
    todoList: {
        tasks: []
    },
    focusSessions: {
        history: [],
        currentSession: null
    }
};

// Get the config directory path based on OS
function getConfigDir() {
    const platform = os.platform();
    let configDir;
    
    if (platform === 'win32') {
        // Windows: %APPDATA%\cheating-daddy-config
        configDir = path.join(os.homedir(), 'AppData', 'Roaming', 'cheating-daddy-config');
    } else if (platform === 'darwin') {
        // macOS: ~/Library/Application Support/cheating-daddy-config
        configDir = path.join(os.homedir(), 'Library', 'Application Support', 'cheating-daddy-config');
    } else {
        // Linux and others: ~/.config/cheating-daddy-config
        configDir = path.join(os.homedir(), '.config', 'cheating-daddy-config');
    }
    
    return configDir;
}

function getConfigFilePath() {
    return path.join(getConfigDir(), 'config.json');
}

// Ensure the config directory exists
function ensureConfigDir() {
    const configDir = getConfigDir();
    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
    }
}

// Read existing config or return empty object
function readExistingConfig() {
    const configFilePath = getConfigFilePath();
    
    try {
        if (fs.existsSync(configFilePath)) {
            const configData = fs.readFileSync(configFilePath, 'utf8');
            return JSON.parse(configData);
        }
    } catch (error) {
        console.warn('Error reading config file:', error.message);
    }
    
    return {};
}

// Write config to file
function writeConfig(config) {
    ensureConfigDir();
    const configFilePath = getConfigFilePath();
    
    try {
        fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing config file:', error.message);
        throw error;
    }
}

// Merge default config with existing config
function mergeWithDefaults(existingConfig) {
    const mergedConfig = { ...DEFAULT_CONFIG };
    
    // Add any existing values that match default keys
    for (const key in DEFAULT_CONFIG) {
        if (existingConfig.hasOwnProperty(key)) {
            mergedConfig[key] = existingConfig[key];
        }
    }
    
    return mergedConfig;
}

// Main function to get local config
function getLocalConfig() {
    try {
        // Ensure config directory exists
        ensureConfigDir();
        
        // Read existing config
        const existingConfig = readExistingConfig();
        
        // Merge with defaults
        const finalConfig = mergeWithDefaults(existingConfig);
        
        // Check if we need to update the config file
        const needsUpdate = JSON.stringify(existingConfig) !== JSON.stringify(finalConfig);
        
        if (needsUpdate) {
            writeConfig(finalConfig);
            console.log('Config updated with missing fields');
        }
        
        return finalConfig;
    } catch (error) {
        console.error('Error in getLocalConfig:', error.message);
        // Return default config if anything fails
        return { ...DEFAULT_CONFIG };
    }
}

// Focus Buddy specific functions
function getUserProfile() {
    const config = getLocalConfig();
    return config.userProfile || DEFAULT_CONFIG.userProfile;
}

function updateUserProfile(profile) {
    const config = getLocalConfig();
    config.userProfile = { ...config.userProfile, ...profile };
    writeConfig(config);
    return config.userProfile;
}

function getTodoList() {
    const config = getLocalConfig();
    return config.todoList || DEFAULT_CONFIG.todoList;
}

function addTodoTask(task) {
    const config = getLocalConfig();
    if (!config.todoList) {
        config.todoList = DEFAULT_CONFIG.todoList;
    }
    
    const newTask = {
        id: Date.now(),
        title: task.title,
        description: task.description || "",
        status: "TODO",
        createdAt: new Date().toISOString(),
        completedAt: null
    };
    
    config.todoList.tasks.push(newTask);
    writeConfig(config);
    return newTask;
}

function updateTodoTask(taskId, updates) {
    const config = getLocalConfig();
    if (!config.todoList) {
        config.todoList = DEFAULT_CONFIG.todoList;
    }
    
    const taskIndex = config.todoList.tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        config.todoList.tasks[taskIndex] = { 
            ...config.todoList.tasks[taskIndex], 
            ...updates 
        };
        
        // If marking as done, set completedAt
        if (updates.status === "DONE" && !config.todoList.tasks[taskIndex].completedAt) {
            config.todoList.tasks[taskIndex].completedAt = new Date().toISOString();
        }
        
        writeConfig(config);
        return config.todoList.tasks[taskIndex];
    }
    return null;
}

function deleteTodoTask(taskId) {
    const config = getLocalConfig();
    if (!config.todoList) {
        config.todoList = DEFAULT_CONFIG.todoList;
    }
    
    config.todoList.tasks = config.todoList.tasks.filter(task => task.id !== taskId);
    writeConfig(config);
    return true;
}

function getFocusSessions() {
    const config = getLocalConfig();
    return config.focusSessions || DEFAULT_CONFIG.focusSessions;
}

function startFocusSession(sessionData) {
    const config = getLocalConfig();
    if (!config.focusSessions) {
        config.focusSessions = DEFAULT_CONFIG.focusSessions;
    }
    
    const newSession = {
        id: Date.now(),
        taskId: sessionData.taskId,
        taskTitle: sessionData.taskTitle,
        startTime: new Date().toISOString(),
        endTime: null,
        status: "active",
        screens: sessionData.screens || [],
        reminderFrequency: sessionData.reminderFrequency || 30,
        screenCaptureInterval: sessionData.screenCaptureInterval || 30,
        pomodoroSettings: sessionData.pomodoroSettings || null,
        activityHistory: []
    };
    
    config.focusSessions.currentSession = newSession;
    writeConfig(config);
    return newSession;
}

function endFocusSession(sessionId) {
    const config = getLocalConfig();
    if (!config.focusSessions) {
        config.focusSessions = DEFAULT_CONFIG.focusSessions;
    }
    
    if (config.focusSessions.currentSession && config.focusSessions.currentSession.id === sessionId) {
        config.focusSessions.currentSession.endTime = new Date().toISOString();
        config.focusSessions.currentSession.status = "completed";
        
        // Move to history
        config.focusSessions.history.push(config.focusSessions.currentSession);
        config.focusSessions.currentSession = null;
        
        writeConfig(config);
        return true;
    }
    return false;
}

function updateFocusSessionActivity(sessionId, activityData) {
    const config = getLocalConfig();
    if (!config.focusSessions) {
        config.focusSessions = DEFAULT_CONFIG.focusSessions;
    }
    
    if (config.focusSessions.currentSession && config.focusSessions.currentSession.id === sessionId) {
        config.focusSessions.currentSession.activityHistory.push({
            timestamp: new Date().toISOString(),
            ...activityData
        });
        writeConfig(config);
        return true;
    }
    return false;
}

// Export only the necessary functions
module.exports = {
    getLocalConfig,
    writeConfig,
    // Focus Buddy specific exports
    getUserProfile,
    updateUserProfile,
    getTodoList,
    addTodoTask,
    updateTodoTask,
    deleteTodoTask,
    getFocusSessions,
    startFocusSession,
    endFocusSession,
    updateFocusSessionActivity
}; 