import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';

export class MainFocusView extends LitElement {
    static styles = css`
        :host {
            display: block;
            height: 100%;
            color: var(--text-color);
        }

        .main-focus-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            padding: 40px;
            gap: 30px;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .welcome-title {
            font-size: 32px;
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--text-color);
        }

        .welcome-subtitle {
            font-size: 16px;
            color: var(--description-color);
            margin-bottom: 30px;
        }

        .task-input-section {
            background: var(--input-background);
            padding: 40px;
            border-radius: var(--border-radius);
            border: 1px solid var(--border-color);
            text-align: center;
        }

        .task-input-label {
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 16px;
            color: var(--text-color);
        }

        .task-input {
            width: 100%;
            padding: 16px 20px;
            border: 2px solid var(--border-color);
            border-radius: 12px;
            background: var(--background-color);
            color: var(--text-color);
            font-size: 16px;
            font-family: inherit;
            transition: all 0.2s ease;
            margin-bottom: 20px;
        }

        .task-input::placeholder {
            color: var(--description-color);
        }

        .task-input:focus {
            outline: none;
            border-color: var(--focus-border-color);
            box-shadow: 0 0 0 3px var(--focus-box-shadow);
        }

        .start-button {
            background: var(--text-input-button-background);
            color: white;
            border: none;
            padding: 16px 40px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            min-width: 200px;
        }

        .start-button:hover {
            background: var(--text-input-button-hover);
            transform: translateY(-1px);
        }

        .start-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .advanced-settings {
            background: var(--input-background);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .advanced-header {
            padding: 20px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--border-color);
            transition: background 0.2s ease;
        }

        .advanced-header:hover {
            background: var(--hover-background);
        }

        .advanced-title {
            font-size: 16px;
            font-weight: 500;
            color: var(--text-color);
        }

        .advanced-toggle {
            font-size: 14px;
            color: var(--description-color);
            transition: transform 0.3s ease;
        }

        .advanced-toggle.expanded {
            transform: rotate(180deg);
        }

        .advanced-content {
            padding: 0;
            max-height: 0;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .advanced-content.expanded {
            padding: 20px;
            max-height: 400px;
        }

        .settings-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
        }

        .setting-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .setting-label {
            font-size: 14px;
            font-weight: 500;
            color: var(--option-label-color);
        }

        .setting-input {
            padding: 10px;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            background: var(--background-color);
            color: var(--text-color);
            font-size: 14px;
        }

        .setting-input:focus {
            outline: none;
            border-color: var(--focus-border-color);
            box-shadow: 0 0 0 2px var(--focus-box-shadow);
        }

        .screen-selection {
            margin-top: 20px;
        }

        .screen-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 8px;
            border-radius: var(--border-radius);
            margin-bottom: 5px;
            cursor: pointer;
            transition: background 0.2s ease;
        }

        .screen-item:hover {
            background: var(--hover-background);
        }

        .screen-item.selected {
            background: var(--screen-option-selected-background);
        }

        .screen-checkbox {
            width: auto;
            margin: 0;
        }

        .screen-name {
            flex: 1;
            font-size: 14px;
        }

        .session-status {
            background: var(--input-background);
            padding: 20px;
            border-radius: var(--border-radius);
            border: 1px solid var(--border-color);
            text-align: center;
        }

        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }

        .status-active {
            background: #28a745;
        }

        .session-info {
            margin-top: 10px;
            font-size: 14px;
            color: var(--description-color);
        }

        .stop-button {
            background: #dc3545;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: var(--border-radius);
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-top: 15px;
        }

        .stop-button:hover {
            background: #c82333;
        }

        .notification-area {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            max-width: 300px;
        }

        .notification {
            background: var(--input-background);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 16px;
            margin-bottom: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            animation: slideIn 0.3s ease;
        }

        .notification.distraction {
            border-left: 4px solid #dc3545;
        }

        .notification.focus {
            border-left: 4px solid #28a745;
        }

        .notification.reminder {
            border-left: 4px solid #ffc107;
        }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .notification-content {
            font-size: 14px;
            line-height: 1.4;
        }

        .notification-time {
            font-size: 12px;
            color: var(--description-color);
            margin-top: 8px;
        }
    `;

    static properties = {
        currentTask: { type: String },
        sessionActive: { type: Boolean },
        sessionStartTime: { type: Number },
        elapsedTime: { type: String },
        advancedExpanded: { type: Boolean },
        
        // Settings
        sessionDuration: { type: Number }, // minutes
        pomodoroInterval: { type: Number }, // minutes
        captureInterval: { type: Number }, // seconds
        selectedScreens: { type: Array },
        availableScreens: { type: Array },
        
        // Session data
        sessionId: { type: String },
        notifications: { type: Array }
    };

    constructor() {
        super();
        this.currentTask = '';
        this.sessionActive = false;
        this.sessionStartTime = null;
        this.elapsedTime = '00:00';
        this.advancedExpanded = false;
        
        // Default settings
        this.sessionDuration = 50; // 50 minute focus session
        this.pomodoroInterval = 25; // 25 minute pomodoro intervals
        this.captureInterval = 30; // 30 second captures
        this.selectedScreens = [];
        this.availableScreens = [];
        
        this.sessionId = null;
        this.notifications = [];
        this.timer = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadAvailableScreens();
        this.setupNotificationListeners();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.removeNotificationListeners();
    }

    async loadAvailableScreens() {
        try {
            const { ipcRenderer } = window.require('electron');
            const result = await ipcRenderer.invoke('get-available-screens');
            if (result.success) {
                this.availableScreens = result.screens;
                // Auto-select primary screen by default
                this.selectedScreens = this.availableScreens.length > 0 ? [this.availableScreens[0].id] : [];
            }
        } catch (error) {
            console.error('Error loading screens:', error);
        }
    }

    handleTaskInput(e) {
        this.currentTask = e.target.value;
    }

    handleTaskKeyPress(e) {
        if (e.key === 'Enter' && this.currentTask.trim()) {
            this.startFocusSession();
        }
    }

    toggleAdvancedSettings() {
        this.advancedExpanded = !this.advancedExpanded;
    }

    handleScreenToggle(screenId) {
        if (this.selectedScreens.includes(screenId)) {
            this.selectedScreens = this.selectedScreens.filter(id => id !== screenId);
        } else {
            this.selectedScreens = [...this.selectedScreens, screenId];
        }
    }

    async startFocusSession() {
        if (!this.currentTask.trim() || this.selectedScreens.length === 0) {
            return;
        }

        try {
            const { ipcRenderer } = window.require('electron');
            
            // Get personal context from onboarding for AI personalization
            const personalContext = localStorage.getItem('customPrompt') || '';
            
            const sessionData = {
                taskTitle: this.currentTask.trim(),
                personalContext: personalContext.trim(),
                screens: this.selectedScreens,
                sessionDuration: this.sessionDuration,
                pomodoroInterval: this.pomodoroInterval,
                screenCaptureInterval: this.captureInterval
            };

            const result = await ipcRenderer.invoke('start-focus-session', sessionData);
            if (result.success) {
                this.sessionId = result.session.id;
                this.sessionActive = true;
                this.sessionStartTime = Date.now();
                this.startTimer();
                this.addNotification('🚀 Focus session started! Stay focused!', 'focus');
            }
        } catch (error) {
            console.error('Error starting session:', error);
        }
    }

    async stopFocusSession() {
        if (!this.sessionId) {
            return;
        }

        try {
            const { ipcRenderer } = window.require('electron');
            const result = await ipcRenderer.invoke('end-focus-session', this.sessionId);
            if (result.success) {
                this.sessionActive = false;
                this.stopTimer();
                this.sessionId = null;
                this.addNotification('✅ Focus session completed!', 'focus');
            }
        } catch (error) {
            console.error('Error stopping session:', error);
        }
    }

    startTimer() {
        this.timer = setInterval(() => {
            if (this.sessionStartTime) {
                const elapsed = Math.floor((Date.now() - this.sessionStartTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                this.elapsedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    setupNotificationListeners() {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            
            this.distractionHandler = (event, data) => {
                if (data.sessionId === this.sessionId) {
                    // Use AI-generated message for personalized distraction alerts
                    const message = data.aiMessage || `🚨 ${data.reason}`;
                    this.addNotification(message, 'distraction');
                }
            };

            this.reminderHandler = (event, data) => {
                if (data.sessionId === this.sessionId) {
                    this.addNotification(`⏰ Stay focused on "${data.task}"`, 'reminder');
                }
            };

            this.focusConfirmationHandler = (event, data) => {
                if (data.sessionId === this.sessionId) {
                    // Use AI-generated message for personalized focus confirmations
                    const message = data.aiMessage || `✅ Great work! Stay focused!`;
                    this.addNotification(message, 'focus');
                }
            };

            ipcRenderer.on('focus-distraction-alert', this.distractionHandler);
            ipcRenderer.on('focus-confirmation', this.focusConfirmationHandler);
            ipcRenderer.on('focus-reminder', this.reminderHandler);
        }
    }

    removeNotificationListeners() {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            if (this.distractionHandler) {
                ipcRenderer.removeListener('focus-distraction-alert', this.distractionHandler);
            }
            if (this.focusConfirmationHandler) {
                ipcRenderer.removeListener('focus-confirmation', this.focusConfirmationHandler);
            }
            if (this.reminderHandler) {
                ipcRenderer.removeListener('focus-reminder', this.reminderHandler);
            }
        }
    }

    addNotification(message, type = 'info') {
        const notification = {
            id: Date.now(),
            message,
            type,
            timestamp: new Date().toLocaleTimeString()
        };
        
        this.notifications = [...this.notifications, notification];
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            this.removeNotification(notification.id);
        }, 5000);
    }

    removeNotification(id) {
        this.notifications = this.notifications.filter(n => n.id !== id);
    }

    render() {
        return html`
            <div class="main-focus-container">
                <div class="header">
                    <div class="welcome-title">What do you want to focus on?</div>
                    <div class="welcome-subtitle">Enter your task and start a focused work session</div>
                </div>

                ${!this.sessionActive ? html`
                    <div class="task-input-section">
                        <div class="task-input-label">Focus Task</div>
                        <input 
                            type="text" 
                            class="task-input"
                            .value=${this.currentTask}
                            @input=${this.handleTaskInput}
                            @keypress=${this.handleTaskKeyPress}
                            placeholder="e.g., Complete project proposal, Study for exam, Write blog post..."
                        />
                        <button 
                            class="start-button" 
                            @click=${this.startFocusSession}
                            ?disabled=${!this.currentTask.trim() || this.selectedScreens.length === 0}
                        >
                            🚀 Start Focus Session
                        </button>
                    </div>

                    <div class="advanced-settings">
                        <div class="advanced-header" @click=${this.toggleAdvancedSettings}>
                            <div class="advanced-title">Advanced Settings</div>
                            <div class="advanced-toggle ${this.advancedExpanded ? 'expanded' : ''}">▼</div>
                        </div>
                        <div class="advanced-content ${this.advancedExpanded ? 'expanded' : ''}">
                            <div class="settings-grid">
                                <div class="setting-group">
                                    <div class="setting-label">Session Duration (minutes)</div>
                                    <input 
                                        type="number" 
                                        class="setting-input"
                                        .value=${this.sessionDuration}
                                        @input=${(e) => this.sessionDuration = parseInt(e.target.value)}
                                        min="15" max="180"
                                    />
                                </div>
                                <div class="setting-group">
                                    <div class="setting-label">Pomodoro Interval (minutes)</div>
                                    <input 
                                        type="number" 
                                        class="setting-input"
                                        .value=${this.pomodoroInterval}
                                        @input=${(e) => this.pomodoroInterval = parseInt(e.target.value)}
                                        min="15" max="60"
                                    />
                                </div>
                                <div class="setting-group">
                                    <div class="setting-label">Capture Interval (seconds)</div>
                                    <select 
                                        class="setting-input"
                                        .value=${this.captureInterval}
                                        @change=${(e) => this.captureInterval = parseInt(e.target.value)}
                                    >
                                        <option value="15">15 seconds</option>
                                        <option value="30">30 seconds</option>
                                        <option value="60">1 minute</option>
                                        <option value="120">2 minutes</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="screen-selection">
                                <div class="setting-label">Monitor Selection</div>
                                ${this.availableScreens.map((screen, index) => html`
                                    <div 
                                        class="screen-item ${this.selectedScreens.includes(screen.id) ? 'selected' : ''}"
                                        @click=${() => this.handleScreenToggle(screen.id)}
                                    >
                                        <input 
                                            type="checkbox" 
                                            class="screen-checkbox"
                                            .checked=${this.selectedScreens.includes(screen.id)}
                                            @change=${() => this.handleScreenToggle(screen.id)}
                                        />
                                        <div class="screen-name">${screen.name} (Monitor ${index + 1})</div>
                                    </div>
                                `)}
                            </div>
                        </div>
                    </div>
                ` : html`
                    <div class="session-status">
                        <div>
                            <span class="status-indicator status-active"></span>
                            <strong>Focus session active</strong>
                        </div>
                        <div class="session-info">
                            Task: ${this.currentTask}<br>
                            Time: ${this.elapsedTime}
                        </div>
                        <button class="stop-button" @click=${this.stopFocusSession}>
                            Stop Session
                        </button>
                    </div>
                `}
            </div>

            <!-- Notification Area -->
            <div class="notification-area">
                ${this.notifications.map(notification => html`
                    <div class="notification ${notification.type}" @click=${() => this.removeNotification(notification.id)}>
                        <div class="notification-content">${notification.message}</div>
                        <div class="notification-time">${notification.timestamp}</div>
                    </div>
                `)}
            </div>
        `;
    }
}

customElements.define('main-focus-view', MainFocusView);