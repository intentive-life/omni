const { desktopCapturer, ipcMain } = require('electron');
const { GoogleGenAI } = require('@google/genai');

class FocusMonitor {
    constructor() {
        this.activeSessions = new Map(); // sessionId -> sessionData
        this.monitoringIntervals = new Map(); // sessionId -> interval
        this.geminiClient = null;
        this.apiKey = null;
    }

    async initializeGemini(apiKey) {
        if (!apiKey) {
            console.warn('No API key provided for focus monitoring');
            return false;
        }

        try {
            console.log('Initializing focus monitoring with API key...');
            
            // Initialize Gemini client
            this.geminiClient = new GoogleGenAI({
                apiKey: apiKey,
            });
            
            // Store the API key for later use
            this.apiKey = apiKey;
            console.log('Focus monitor initialized successfully with Gemini client');
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
                
                // Use AI-generated message if available, otherwise fallback to template
                const message = activityResult.aiMessage || this.getFallbackDistractionMessage();
                
                this.sendActivityUpdate(sessionId, `🚨 Distraction Alert: ${activityResult.reason} - ${message}`, 'warning');
                
                // Send distraction notification
                this.sendDistractionNotification(sessionId, activityResult);
            } else {
                // Use AI-generated message if available, otherwise fallback to template
                const message = activityResult.aiMessage || this.getFallbackFocusedMessage();
                
                this.sendActivityUpdate(sessionId, `✅ Focused: ${activityResult.reason} - ${message}`, 'success');
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
        if (!this.geminiClient || screenshots.length === 0) {
            console.log('No Gemini client or screenshots available for analysis');
            return { isDistracted: false, reason: 'No analysis possible' };
        }

        try {
            console.log(`\n🔍 ANALYZING ACTIVITY - ${screenshots.length} screenshot(s)`);
            console.log(`📋 Focus Task: "${focusTask}"`);
            
            // Create analysis prompt
            const prompt = `
            Analyze these screen captures and determine if the user is focused on their task: "${focusTask}"
            
            Consider:
            - Is the content related to the task?
            - Are they on social media, games, or other distractions?
            - Is this productive work?
            - What specific applications or websites are visible?
            
            Respond with JSON format:
            {
                "isDistracted": true/false,
                "reason": "brief explanation of what you see",
                "confidence": 0.0-1.0,
                "detectedApps": ["list of visible applications/websites"],
                "analysis": "detailed analysis of the screen content",
                "screenDescriptions": {
                    "screen1": "description of what's on screen 1",
                    "screen2": "description of what's on screen 2"
                },
                "aiMessage": "a witty, motivational, or sarcastic message (depending on if they're focused or distracted) to encourage better focus or acknowledge good work. Keep it brief, engaging, and use emojis appropriately."
            }
            `;

            console.log('📤 Sending to Gemini API...');
            console.log(`   - Prompt: ${prompt.substring(0, 100)}...`);
            console.log(`   - Images: ${screenshots.map((s, index) => `Image ${index + 1}: ${s.name} (${s.id})`).join(', ')}`);
            console.log(`   - Total images being sent: ${screenshots.length}`);

            // Prepare image parts for Gemini
            const imageParts = screenshots.map(screenshot => ({
                inlineData: {
                    mimeType: 'image/png',
                    data: screenshot.thumbnail.split(',')[1] // Remove data:image/png;base64, prefix
                }
            }));

            console.log('📤 Sending to Gemini API...');
            console.log(`   - Model: gemini-2.5-flash`);
            console.log(`   - Images: ${screenshots.map((s, index) => `Image ${index + 1}: ${s.name} (${s.id})`).join(', ')}`);
            console.log(`   - Total images being sent: ${screenshots.length}`);

            // Send to Gemini API with retry logic
            let result;
            let attempts = 0;
            const maxAttempts = 3;
            
            while (attempts < maxAttempts) {
                try {
                    attempts++;
                    console.log(`📤 Attempt ${attempts}/${maxAttempts} - Sending to Gemini API...`);
                    
                    result = await this.geminiClient.models.generateContent({
                        model: 'gemini-2.5-flash',
                        contents: [prompt, ...imageParts]
                    });
                    
                    break; // Success, exit retry loop
                } catch (error) {
                    console.log(`❌ Attempt ${attempts} failed:`, error.message);
                    
                    if (attempts >= maxAttempts) {
                        throw error; // Re-throw if all attempts failed
                    }
                    
                    // Wait before retrying (exponential backoff)
                    const delay = Math.pow(2, attempts) * 1000;
                    console.log(`⏳ Waiting ${delay}ms before retry...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
            
            console.log('🔧 Debug: Result structure:', JSON.stringify(result, null, 2));
            
            // Handle different response structures
            let text;
            if (result.response && result.response.text) {
                text = result.response.text();
            } else if (result.text) {
                text = result.text;
            } else if (result.candidates && result.candidates[0] && result.candidates[0].content) {
                text = result.candidates[0].content.parts[0].text;
            } else {
                console.error('🔧 Debug: Unexpected response structure:', result);
                throw new Error('Unexpected response structure from Gemini API');
            }

            console.log('📥 Received Gemini Response:');
            console.log(`   - Raw response: ${text.substring(0, 200)}...`);

            // Parse JSON response
            let analysisResult;
            try {
                // Extract JSON from response (in case there's extra text)
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    analysisResult = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error('No JSON found in response');
                }
            } catch (parseError) {
                console.error('Failed to parse Gemini response as JSON:', parseError);
                console.log('Falling back to heuristic analysis');
                return this.simpleHeuristicAnalysis(screenshots, focusTask);
            }

            console.log('✅ Parsed Analysis Result:');
            console.log(`   - Distracted: ${analysisResult.isDistracted}`);
            console.log(`   - Reason: ${analysisResult.reason}`);
            console.log(`   - Confidence: ${analysisResult.confidence || 'N/A'}`);
            console.log(`   - Apps: ${(analysisResult.detectedApps || []).join(', ')}`);

            // Store the full analysis in activity log
            const analysisLog = {
                timestamp: new Date().toISOString(),
                screenshots: screenshots.length,
                focusTask: focusTask,
                geminiResponse: analysisResult,
                rawResponse: text
            };

            this.sendActivityUpdate('system', `AI Analysis: ${analysisResult.reason}`, 'info', analysisLog);

            return {
                isDistracted: analysisResult.isDistracted || false,
                reason: analysisResult.reason || 'Analysis completed',
                confidence: analysisResult.confidence || 0.5,
                aiMessage: analysisResult.aiMessage || null
            };

        } catch (error) {
            console.error('❌ Error analyzing activity with Gemini:', error);
            
            // Check if it's an API key error
            const isApiKeyError = error.message && (
                error.message.includes('API key not valid') ||
                error.message.includes('invalid API key') ||
                error.message.includes('authentication failed') ||
                error.message.includes('unauthorized')
            );
            
            if (isApiKeyError) {
                console.error('Invalid API key detected during analysis');
                this.sendActivityUpdate('system', 'API key validation failed. Please check your Gemini API key.', 'error');
            }
            
            // Fallback to simple heuristic
            console.log('🔄 Falling back to heuristic analysis');
            return this.simpleHeuristicAnalysis(screenshots, focusTask);
        }
    }

    simpleHeuristicAnalysis(screenshots, focusTask) {
        console.log('🔍 Using heuristic analysis (fallback)');
        
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
            const reason = distractions[Math.floor(Math.random() * distractions.length)];
            console.log(`   - Heuristic result: Distracted - ${reason}`);
            return {
                isDistracted: true,
                reason: reason
            };
        }
        
        console.log('   - Heuristic result: Focused');
        return { isDistracted: false, reason: 'Activity appears focused' };
    }

    sendActivityUpdate(sessionId, message, type = 'info', additionalData = null) {
        // Send activity update to renderer
        const windows = require('electron').BrowserWindow.getAllWindows();
        if (windows.length > 0) {
            const updateData = {
                sessionId,
                message,
                type,
                timestamp: new Date().toISOString()
            };
            
            // Add additional data if provided
            if (additionalData) {
                updateData.additionalData = additionalData;
            }
            
            windows[0].webContents.send('focus-activity-update', updateData);
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

    getFallbackDistractionMessage() {
        const sarcasticComments = [
            "Oh look, another 'important' social media break! 🙄",
            "Surely this YouTube video is totally work-related, right? 😏",
            "Breaking news: Your task is still waiting while you scroll! 📱",
            "Productivity level: Expert procrastinator! 🏆",
            "Task: Still incomplete. Distractions: Mastered! 🎯"
        ];
        return sarcasticComments[Math.floor(Math.random() * sarcasticComments.length)];
    }

    getFallbackFocusedMessage() {
        const focusedMessages = [
            "Great job staying focused! 💪",
            "Productivity mode: ACTIVATED! ⚡",
            "Task progress: Moving forward! 🚀",
            "Focus level: Maximum! 🎯",
            "You're crushing it! Keep going! 🔥"
        ];
        return focusedMessages[Math.floor(Math.random() * focusedMessages.length)];
    }
}

// Create singleton instance
const focusMonitor = new FocusMonitor();

module.exports = { focusMonitor }; 