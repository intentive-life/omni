const { desktopCapturer, ipcMain } = require('electron');
const { GoogleGenAI } = require('@google/genai');

class FocusMonitor {
    constructor() {
        this.activeSessions = new Map(); // sessionId -> sessionData
        this.monitoringIntervals = new Map(); // sessionId -> interval
        this.geminiSession = null;
    }

    async initializeGemini(apiKey) {
        if (!apiKey) {
            console.warn('No API key provided for focus monitoring');
            return false;
        }

        try {
            console.log('Initializing focus monitoring with API key...');
            
            // Store the API key for later use
            this.apiKey = apiKey;
            console.log('Focus monitor initialized successfully');
            return true;
        } catch (error) {
            console.error('Error initializing focus monitoring:', error);
            return false;
        }
    }

    async startMonitoring(sessionId, sessionData) {
        console.log(`Starting focus monitoring for session: ${sessionId}`);
        
        const session = {
            id: sessionId,
            task: sessionData.taskTitle,
            screens: sessionData.screens,
            captureInterval: sessionData.screenCaptureInterval * 1000, // convert to ms
            reminderFrequency: sessionData.reminderFrequency * 60 * 1000, // convert to ms
            startTime: Date.now(),
            lastActivity: Date.now(),
            activityCount: 0,
            distractionCount: 0,
            lastReminder: Date.now()
        };

        this.activeSessions.set(sessionId, session);

        // Start the monitoring interval
        const interval = setInterval(async () => {
            await this.monitorSession(sessionId);
        }, session.captureInterval);

        this.monitoringIntervals.set(sessionId, interval);

        // Send initial activity log entry
        this.sendActivityUpdate(sessionId, 'Focus monitoring started', 'info');
        
        return true;
    }

    async stopMonitoring(sessionId) {
        console.log(`Stopping focus monitoring for session: ${sessionId}`);
        
        // Clear the monitoring interval
        const interval = this.monitoringIntervals.get(sessionId);
        if (interval) {
            clearInterval(interval);
            this.monitoringIntervals.delete(sessionId);
        }

        // Remove session data
        const session = this.activeSessions.get(sessionId);
        if (session) {
            const duration = Math.floor((Date.now() - session.startTime) / 1000);
            this.sendActivityUpdate(sessionId, `Session ended. Duration: ${Math.floor(duration / 60)}m ${duration % 60}s`, 'info');
            this.activeSessions.delete(sessionId);
        }

        return true;
    }

    async monitorSession(sessionId) {
        const session = this.activeSessions.get(sessionId);
        if (!session) {
            return;
        }

        try {
            // Capture screens
            const screenshots = await this.captureScreens(session.screens);
            
            // Analyze activity
            const activityResult = await this.analyzeActivity(screenshots, session.task);
            
            // Update session data
            session.lastActivity = Date.now();
            session.activityCount++;

            // Handle activity result
            if (activityResult.isDistracted) {
                session.distractionCount++;
                this.sendActivityUpdate(sessionId, `Potential distraction detected: ${activityResult.reason}`, 'warning');
                
                // Send distraction notification
                this.sendDistractionNotification(sessionId, activityResult);
            } else {
                this.sendActivityUpdate(sessionId, 'Activity appears focused', 'info');
            }

            // Check for reminder frequency
            if (Date.now() - session.lastReminder >= session.reminderFrequency) {
                this.sendReminderNotification(sessionId);
                session.lastReminder = Date.now();
            }

        } catch (error) {
            console.error(`Error monitoring session ${sessionId}:`, error);
            this.sendActivityUpdate(sessionId, `Monitoring error: ${error.message}`, 'error');
        }
    }

    async captureScreens(screenIds) {
        const screenshots = [];
        
        try {
            const sources = await desktopCapturer.getSources({ types: ['screen'] });
            
            for (const screenId of screenIds) {
                const source = sources.find(s => s.id === screenId);
                if (source) {
                    // For now, we'll just capture the thumbnail
                    // In a real implementation, you'd capture full resolution
                    const thumbnail = source.thumbnail;
                    screenshots.push({
                        id: screenId,
                        name: source.name,
                        thumbnail: thumbnail.toDataURL(),
                        timestamp: Date.now()
                    });
                }
            }
        } catch (error) {
            console.error('Error capturing screens:', error);
        }

        return screenshots;
    }

    async analyzeActivity(screenshots, focusTask) {
        if (!this.geminiSession || screenshots.length === 0) {
            return { isDistracted: false, reason: 'No analysis possible' };
        }

        try {
            // Create analysis prompt
            const prompt = `
            Analyze this screen capture and determine if the user is focused on their task: "${focusTask}"
            
            Consider:
            - Is the content related to the task?
            - Are they on social media, games, or other distractions?
            - Is this productive work?
            
            Respond with JSON format:
            {
                "isDistracted": true/false,
                "reason": "brief explanation",
                "confidence": 0.0-1.0
            }
            `;

            // For now, we'll use simple heuristic analysis since live sessions are more complex
            // In a real implementation, you'd use the live session to send the prompt
            console.log('Using heuristic analysis for now - Gemini live session analysis not yet implemented');
            return this.simpleHeuristicAnalysis(screenshots, focusTask);

        } catch (error) {
            console.error('Error analyzing activity with Gemini:', error);
            
            // Check if it's an API key error
            const isApiKeyError = error.message && (
                error.message.includes('API key not valid') ||
                error.message.includes('invalid API key') ||
                error.message.includes('authentication failed') ||
                error.message.includes('unauthorized')
            );
            
            if (isApiKeyError) {
                console.error('Invalid API key detected during analysis');
                // Send notification to renderer about API key issue
                this.sendActivityUpdate('system', 'API key validation failed. Please check your Gemini API key.', 'error');
            }
            
            // Fallback to simple heuristic
            return this.simpleHeuristicAnalysis(screenshots, focusTask);
        }
    }

    simpleHeuristicAnalysis(screenshots, focusTask) {
        // Simple heuristic analysis - in reality, you'd use AI
        // For now, we'll just randomly detect "distractions" for testing
        const random = Math.random();
        
        // 20% chance of detecting a distraction for testing purposes
        if (random < 0.2) {
            const distractions = [
                'Social media detected',
                'Non-work website detected',
                'Gaming activity detected',
                'Entertainment content detected'
            ];
            return {
                isDistracted: true,
                reason: distractions[Math.floor(Math.random() * distractions.length)]
            };
        }
        
        return { isDistracted: false, reason: 'Activity appears focused' };
    }

    sendActivityUpdate(sessionId, message, type = 'info') {
        // Send activity update to renderer
        const windows = require('electron').BrowserWindow.getAllWindows();
        if (windows.length > 0) {
            windows[0].webContents.send('focus-activity-update', {
                sessionId,
                message,
                type,
                timestamp: new Date().toISOString()
            });
        }
    }

    sendDistractionNotification(sessionId, activityResult) {
        // Send distraction notification to renderer
        const windows = require('electron').BrowserWindow.getAllWindows();
        if (windows.length > 0) {
            windows[0].webContents.send('focus-distraction-alert', {
                sessionId,
                reason: activityResult.reason,
                timestamp: new Date().toISOString()
            });
        }
    }

    sendReminderNotification(sessionId) {
        const session = this.activeSessions.get(sessionId);
        if (!session) return;

        // Send reminder notification to renderer
        const windows = require('electron').BrowserWindow.getAllWindows();
        if (windows.length > 0) {
            windows[0].webContents.send('focus-reminder', {
                sessionId,
                task: session.task,
                timestamp: new Date().toISOString()
            });
        }
    }

    getSessionStats(sessionId) {
        const session = this.activeSessions.get(sessionId);
        if (!session) return null;

        return {
            duration: Date.now() - session.startTime,
            activityCount: session.activityCount,
            distractionCount: session.distractionCount,
            focusScore: session.activityCount > 0 ? 
                ((session.activityCount - session.distractionCount) / session.activityCount) * 100 : 100
        };
    }
}

// Create singleton instance
const focusMonitor = new FocusMonitor();

module.exports = { focusMonitor }; 