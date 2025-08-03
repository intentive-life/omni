import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';

export class FocusSessionView extends LitElement {
    static styles = css`
        :host {
            display: block;
            height: 100%;
            color: var(--text-color);
        }

        .focus-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            gap: 20px;
        }

        .scrollable-content {
            flex: 1;
            overflow-y: auto;
            padding-right: 10px;
        }

        .scrollable-content::-webkit-scrollbar {
            width: 8px;
        }

        .scrollable-content::-webkit-scrollbar-track {
            background: var(--input-background);
            border-radius: 4px;
        }

        .scrollable-content::-webkit-scrollbar-thumb {
            background: var(--border-color);
            border-radius: 4px;
        }

        .scrollable-content::-webkit-scrollbar-thumb:hover {
            background: var(--description-color);
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 0;
            border-bottom: 1px solid var(--border-color);
            position: sticky;
            top: 0;
            background: var(--background-color);
            z-index: 10;
        }

        .header h2 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }

        .header-info {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .shortcut-hint {
            font-size: 12px;
            color: var(--description-color);
            background: var(--input-background);
            padding: 4px 8px;
            border-radius: var(--border-radius);
            border: 1px solid var(--border-color);
        }

        .session-info {
            background: var(--input-background);
            padding: 20px;
            border-radius: var(--border-radius);
            border: 1px solid var(--border-color);
            margin-bottom: 20px;
        }

        .task-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 10px;
            color: var(--text-color);
        }

        .task-description {
            color: var(--description-color);
            font-size: 14px;
            margin-bottom: 15px;
            line-height: 1.4;
        }

        .session-stats {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
        }

        .stat-item {
            text-align: center;
        }

        .stat-value {
            font-size: 24px;
            font-weight: 600;
            color: var(--text-color);
        }

        .stat-label {
            font-size: 12px;
            color: var(--description-color);
            text-transform: uppercase;
        }

        .session-controls {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }

        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: var(--border-radius);
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .btn-primary {
            background: var(--text-input-button-background);
            color: white;
        }

        .btn-primary:hover {
            background: var(--text-input-button-hover);
        }

        .btn-secondary {
            background: var(--button-background);
            color: var(--text-color);
            border: 1px solid var(--border-color);
        }

        .btn-secondary:hover {
            background: var(--hover-background);
        }

        .btn-danger {
            background: #dc3545;
            color: white;
        }

        .btn-danger:hover {
            background: #c82333;
        }

        .settings-section {
            background: var(--input-background);
            padding: 20px;
            border-radius: var(--border-radius);
            border: 1px solid var(--border-color);
            margin-bottom: 20px;
        }

        .settings-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 15px;
            color: var(--text-color);
        }

        .form-group {
            margin-bottom: 15px;
        }

        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
            color: var(--option-label-color);
        }

        .form-group input,
        .form-group select {
            width: 100%;
            padding: 10px;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            background: var(--input-background);
            color: var(--text-color);
            font-size: 14px;
        }

        .form-group input:focus,
        .form-group select:focus {
            outline: none;
            border-color: var(--focus-border-color);
            box-shadow: 0 0 0 2px var(--focus-box-shadow);
        }

        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
        }

        .checkbox-group input[type="checkbox"] {
            width: auto;
            margin: 0;
        }

        .checkbox-group label {
            margin: 0;
            cursor: pointer;
        }

        .screen-selection {
            background: var(--input-background);
            padding: 15px;
            border-radius: var(--border-radius);
            border: 1px solid var(--border-color);
            margin-bottom: 20px;
        }

        .screen-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            border-radius: var(--border-radius);
            margin-bottom: 8px;
            cursor: pointer;
            transition: background 0.2s ease;
        }

        .screen-item:hover {
            background: var(--hover-background);
        }

        .screen-item.selected {
            background: var(--screen-option-selected-background);
            border: 1px solid var(--focus-border-color);
        }

        .screen-item input[type="checkbox"] {
            width: auto;
            margin: 0;
        }

        .screen-name {
            flex: 1;
            font-size: 14px;
        }

        .screen-number {
            font-size: 12px;
            color: var(--description-color);
            background: var(--border-color);
            padding: 2px 6px;
            border-radius: 3px;
            margin-left: 8px;
        }

        .screen-hint {
            font-size: 12px;
            color: var(--description-color);
            margin-bottom: 10px;
            font-style: italic;
        }

        .activity-log {
            background: var(--input-background);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 20px;
            overflow-y: auto;
            max-height: 400px;
            margin-bottom: 30px;
        }

        .activity-item {
            padding: 10px 0;
            border-bottom: 1px solid var(--border-color);
            font-size: 13px;
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }

        .activity-item:last-child {
            border-bottom: none;
        }

        .activity-time {
            color: var(--description-color);
            font-size: 11px;
            min-width: 60px;
            font-family: monospace;
        }

        .activity-message {
            color: var(--text-color);
            flex: 1;
            line-height: 1.4;
        }

        .activity-type-info {
            color: #17a2b8;
        }

        .activity-type-warning {
            color: #ffc107;
        }

        .activity-type-error {
            color: #dc3545;
        }

        .activity-type-success {
            color: #28a745;
        }

        .gemini-analysis {
            margin-top: 8px;
            padding: 8px;
            background: var(--input-background);
            border-radius: var(--border-radius);
            border-left: 3px solid #3b82f6;
        }

        .analysis-details {
            font-size: 12px;
            color: var(--description-color);
        }

        .analysis-item {
            margin-bottom: 4px;
        }

        .analysis-item:last-child {
            margin-bottom: 0;
        }

        .analysis-item strong {
            color: var(--text-color);
        }

        .screen-description {
            margin-left: 10px;
            margin-top: 4px;
            font-size: 11px;
            color: var(--description-color);
        }

        .status-indicator {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 8px;
        }

        .status-active {
            background: #28a745;
        }

        .status-paused {
            background: #ffc107;
        }

        .status-stopped {
            background: #dc3545;
        }

        .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: var(--description-color);
        }

        .empty-state h3 {
            margin-bottom: 10px;
            font-size: 18px;
        }

        .empty-state p {
            margin-bottom: 20px;
            font-size: 14px;
        }
    `;

    static properties = {
        task: { type: Object },
        sessionActive: { type: Boolean },
        sessionStartTime: { type: Number },
        elapsedTime: { type: String },
        screenCaptureInterval: { type: Number },
        reminderFrequency: { type: Number },
        selectedScreens: { type: Array },
        availableScreens: { type: Array },
        activityLog: { type: Array },
        sessionId: { type: String }
    };

    constructor() {
        super();
        this.task = null;
        this.sessionActive = false;
        this.sessionStartTime = null;
        this.elapsedTime = '00:00';
        this.screenCaptureInterval = 30; // seconds
        this.reminderFrequency = 30; // minutes
        this.selectedScreens = [];
        this.availableScreens = [];
        this.activityLog = [];
        this.sessionId = null;
        this.timer = null;
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadAvailableScreens();
        this.setupActivityListeners();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.removeActivityListeners();
    }

    async loadAvailableScreens() {
        try {
            const { ipcRenderer } = window.require('electron');
            const result = await ipcRenderer.invoke('get-available-screens');
            if (result.success) {
                this.availableScreens = result.screens;
                // Auto-select all screens by default
                this.selectedScreens = this.availableScreens.map(screen => screen.id);
            }
        } catch (error) {
            console.error('Error loading screens:', error);
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

    async startSession() {
        if (!this.task || this.selectedScreens.length === 0) {
            return;
        }

        try {
            const { ipcRenderer } = window.require('electron');
            const sessionData = {
                taskId: this.task.id,
                taskTitle: this.task.title,
                screens: this.selectedScreens,
                reminderFrequency: this.reminderFrequency,
                screenCaptureInterval: this.screenCaptureInterval
            };

            const result = await ipcRenderer.invoke('start-focus-session', sessionData);
            if (result.success) {
                this.sessionId = result.session.id;
                this.sessionActive = true;
                this.sessionStartTime = Date.now();
                this.startTimer();
                this.addActivityLog('Session started', 'info');
            }
        } catch (error) {
            console.error('Error starting session:', error);
        }
    }

    async stopSession() {
        if (!this.sessionId) {
            return;
        }

        try {
            const { ipcRenderer } = window.require('electron');
            const result = await ipcRenderer.invoke('end-focus-session', this.sessionId);
            if (result.success) {
                this.sessionActive = false;
                this.stopTimer();
                this.addActivityLog('Session ended', 'info');
                this.sessionId = null;
            }
        } catch (error) {
            console.error('Error stopping session:', error);
        }
    }

    addActivityLog(message, type = 'info', additionalData = null) {
        const now = new Date();
        const timestamp = now.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        this.activityLog = [...this.activityLog, { timestamp, message, type, additionalData }];
        // Keep only last 50 entries
        if (this.activityLog.length > 50) {
            this.activityLog = this.activityLog.slice(-50);
        }
    }

    handleScreenToggle(screenId) {
        if (this.selectedScreens.includes(screenId)) {
            this.selectedScreens = this.selectedScreens.filter(id => id !== screenId);
        } else {
            this.selectedScreens = [...this.selectedScreens, screenId];
        }
    }

    handleIntervalChange(e) {
        this.screenCaptureInterval = parseInt(e.target.value);
    }

    handleReminderChange(e) {
        this.reminderFrequency = parseInt(e.target.value);
    }

    setupActivityListeners() {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            
            this.activityUpdateHandler = (event, data) => {
                if (data.sessionId === this.sessionId) {
                    this.addActivityLog(data.message, data.type, data.additionalData);
                }
            };

            this.distractionAlertHandler = (event, data) => {
                if (data.sessionId === this.sessionId) {
                    this.addActivityLog(`🚨 Distraction Alert: ${data.reason}`, 'warning');
                    this.showDistractionAlert(data.reason);
                }
            };

            this.reminderHandler = (event, data) => {
                if (data.sessionId === this.sessionId) {
                    this.addActivityLog(`⏰ Reminder: Stay focused on "${data.task}"`, 'info');
                    this.showReminderAlert(data.task);
                }
            };

            ipcRenderer.on('focus-activity-update', this.activityUpdateHandler);
            ipcRenderer.on('focus-distraction-alert', this.distractionAlertHandler);
            ipcRenderer.on('focus-reminder', this.reminderHandler);
        }
    }

    removeActivityListeners() {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            if (this.activityUpdateHandler) {
                ipcRenderer.removeListener('focus-activity-update', this.activityUpdateHandler);
            }
            if (this.distractionAlertHandler) {
                ipcRenderer.removeListener('focus-distraction-alert', this.distractionAlertHandler);
            }
            if (this.reminderHandler) {
                ipcRenderer.removeListener('focus-reminder', this.reminderHandler);
            }
        }
    }

    showDistractionAlert(reason) {
        // Show a distraction alert - for now just log to console
        console.log(`🚨 Distraction detected: ${reason}`);
        // TODO: Show a proper notification popup
    }

    showReminderAlert(task) {
        // Show a reminder alert - for now just log to console
        console.log(`⏰ Reminder: Stay focused on "${task}"`);
        // TODO: Show a proper notification popup
    }

    showScreenNumber(screenNumber) {
        // Send IPC message to main process to show screen number popup
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.send('show-screen-number', screenNumber);
        }
    }

    hideScreenNumber() {
        // Remove any existing popups
        const popups = document.querySelectorAll('.screen-number-popup');
        popups.forEach(popup => popup.remove());
    }

    renderSessionInfo() {
        if (!this.task) {
            return html`
                <div class="empty-state">
                    <h3>No task selected</h3>
                    <p>Please select a task to start a focus session.</p>
                </div>
            `;
        }

        return html`
            <div class="session-info">
                <div class="task-title">${this.task.title}</div>
                ${this.task.description ? html`
                    <div class="task-description">${this.task.description}</div>
                ` : ''}
                
                ${this.sessionActive ? html`
                    <div class="session-stats">
                        <div class="stat-item">
                            <div class="stat-value">${this.elapsedTime}</div>
                            <div class="stat-label">Elapsed</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${this.selectedScreens.length}</div>
                            <div class="stat-label">Screens</div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderSessionControls() {
        return html`
            <div class="session-controls">
                ${!this.sessionActive ? html`
                    <button class="btn btn-primary" @click=${this.startSession} ?disabled=${!this.task || this.selectedScreens.length === 0}>
                        Start Focus Session
                    </button>
                ` : html`
                    <button class="btn btn-danger" @click=${this.stopSession}>
                        Stop Session
                    </button>
                `}
                <button class="btn btn-secondary" @click=${() => this.dispatchEvent(new CustomEvent('back-to-todo', { bubbles: true, composed: true }))}>
                    Back to Todo
                </button>
            </div>
        `;
    }

    renderSettings() {
        return html`
            <div class="settings-section">
                <div class="settings-title">Session Settings</div>
                
                <div class="form-group">
                    <label for="capture-interval">Screen Capture Interval (seconds)</label>
                    <select id="capture-interval" .value=${this.screenCaptureInterval} @change=${this.handleIntervalChange}>
                        <option value="15">15 seconds</option>
                        <option value="30">30 seconds</option>
                        <option value="60">1 minute</option>
                        <option value="120">2 minutes</option>
                        <option value="300">5 minutes</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="reminder-frequency">Reminder Frequency (minutes)</label>
                    <select id="reminder-frequency" .value=${this.reminderFrequency} @change=${this.handleReminderChange}>
                        <option value="5">5 minutes</option>
                        <option value="10">10 minutes</option>
                        <option value="15">15 minutes</option>
                        <option value="20">20 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                    </select>
                </div>
            </div>
        `;
    }

    renderScreenSelection() {
        return html`
            <div class="screen-selection">
                <div class="settings-title">Screen Selection</div>
                <div class="screen-hint">Hover over screens to see their numbers</div>
                ${this.availableScreens.length === 0 ? html`
                    <div class="empty-state">
                        <p>Loading available screens...</p>
                    </div>
                ` : this.availableScreens.map((screen, index) => html`
                    <div class="screen-item ${this.selectedScreens.includes(screen.id) ? 'selected' : ''}" 
                         @click=${() => this.handleScreenToggle(screen.id)}
                         @mouseenter=${() => this.showScreenNumber(index + 1)}
                         @mouseleave=${() => this.hideScreenNumber()}>
                        <input type="checkbox" .checked=${this.selectedScreens.includes(screen.id)} @change=${() => this.handleScreenToggle(screen.id)}>
                        <div class="screen-name">${screen.name}</div>
                        <div class="screen-number">${index + 1}</div>
                    </div>
                `)}
            </div>
        `;
    }

    renderActivityLog() {
        return html`
            <div class="activity-log">
                <div class="settings-title">Activity Log</div>
                ${this.activityLog.length === 0 ? html`
                    <div class="empty-state">
                        <p>No activity recorded yet. Start the session to see activity updates.</p>
                    </div>
                ` : this.activityLog.map(activity => html`
                    <div class="activity-item">
                        <div class="activity-time">${activity.timestamp}</div>
                        <div class="activity-message activity-type-${activity.type}">
                            ${activity.message}
                            ${activity.additionalData ? this.renderAdditionalData(activity.additionalData) : ''}
                        </div>
                    </div>
                `)}
            </div>
        `;
    }

    renderAdditionalData(data) {
        if (data.geminiResponse) {
            return html`
                <div class="gemini-analysis">
                    <div class="analysis-details">
                        <div class="analysis-item">
                            <strong>Confidence:</strong> ${(data.geminiResponse.confidence * 100).toFixed(1)}%
                        </div>
                        ${data.geminiResponse.detectedApps && data.geminiResponse.detectedApps.length > 0 ? html`
                            <div class="analysis-item">
                                <strong>Detected Apps:</strong> ${data.geminiResponse.detectedApps.join(', ')}
                            </div>
                        ` : ''}
                        ${data.geminiResponse.screenDescriptions ? html`
                            <div class="analysis-item">
                                <strong>Screen Details:</strong>
                                ${Object.entries(data.geminiResponse.screenDescriptions).map(([screen, description]) => html`
                                    <div class="screen-description">
                                        <strong>${screen}:</strong> ${description}
                                    </div>
                                `)}
                            </div>
                        ` : ''}
                        ${data.geminiResponse.analysis ? html`
                            <div class="analysis-item">
                                <strong>Analysis:</strong> ${data.geminiResponse.analysis}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }
        return '';
    }

    render() {
        return html`
            <div class="focus-container">
                <div class="header">
                    <h2>Focus Session</h2>
                    <div class="header-info">
                        <span class="shortcut-hint">Press Cmd + \\ to show/hide UI</span>
                        ${this.sessionActive ? html`
                            <span class="status-indicator status-active"></span>
                            <span>Active</span>
                        ` : ''}
                    </div>
                </div>

                <div class="scrollable-content">
                    ${this.renderActivityLog()}
                    ${this.renderSessionInfo()}
                    ${this.renderSessionControls()}
                    ${this.renderSettings()}
                    ${this.renderScreenSelection()}
                </div>
            </div>
        `;
    }
}

customElements.define('focus-session-view', FocusSessionView); 