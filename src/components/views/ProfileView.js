import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';

export class ProfileView extends LitElement {
    static styles = css`
        :host {
            display: block;
            height: 100%;
            color: var(--text-color);
        }

        .profile-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            padding: 40px;
            gap: 30px;
            max-width: 600px;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .title {
            font-size: 32px;
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--text-color);
        }

        .subtitle {
            font-size: 16px;
            color: var(--description-color);
            margin-bottom: 30px;
        }

        .section {
            background: var(--input-background);
            padding: 30px;
            border-radius: var(--border-radius);
            border: 1px solid var(--border-color);
        }

        .section-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
            color: var(--text-color);
        }

        .section-description {
            font-size: 14px;
            color: var(--description-color);
            margin-bottom: 20px;
            line-height: 1.5;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            color: var(--option-label-color);
            font-weight: 500;
        }

        .form-group input {
            width: 100%;
            padding: 12px;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            background: var(--background-color);
            color: var(--text-color);
            font-size: 14px;
            font-family: monospace;
            transition: all 0.2s ease;
        }

        .form-group textarea {
            width: 100%;
            min-height: 120px;
            padding: 12px;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            background: var(--background-color);
            color: var(--text-color);
            font-size: 14px;
            font-family: inherit;
            resize: vertical;
            transition: all 0.2s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--focus-border-color);
            box-shadow: 0 0 0 2px var(--focus-box-shadow);
        }

        .form-group input.error {
            border-color: #dc3545;
            box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
            color: var(--description-color);
        }

        .button-group {
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 20px;
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

        .btn-primary:hover:not(:disabled) {
            background: var(--text-input-button-hover);
        }

        .btn-secondary {
            background: var(--button-background);
            color: var(--text-color);
            border: 1px solid var(--border-color);
        }

        .btn-secondary:hover:not(:disabled) {
            background: var(--hover-background);
        }

        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .btn.hidden {
            display: none;
        }

        .status-message {
            margin-top: 10px;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            text-align: center;
        }

        .status-message.error {
            background: rgba(220, 53, 69, 0.1);
            color: #dc3545;
            border: 1px solid rgba(220, 53, 69, 0.2);
        }

        .status-message.success {
            background: rgba(40, 167, 69, 0.1);
            color: #28a745;
            border: 1px solid rgba(40, 167, 69, 0.2);
        }

        .back-button {
            align-self: flex-start;
            background: transparent;
            border: none;
            color: var(--text-color);
            padding: 8px 16px;
            border-radius: var(--border-radius);
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            margin-bottom: 20px;
        }

        .back-button:hover {
            background: var(--hover-background);
        }

        .help-text {
            margin-top: 15px;
            padding: 15px;
            background: var(--button-background);
            border-radius: var(--border-radius);
            font-size: 12px;
            color: var(--description-color);
            line-height: 1.4;
        }

        .help-text strong {
            color: var(--text-color);
        }

        .link {
            color: var(--link-color);
            text-decoration: underline;
            cursor: pointer;
        }

        .link:hover {
            color: var(--text-input-button-hover);
        }
    `;

    static properties = {
        contextText: { type: String },
        apiKey: { type: String },
        originalContextText: { type: String },
        originalApiKey: { type: String },
        isValidatingApiKey: { type: Boolean },
        isSavingContext: { type: Boolean },
        apiKeyError: { type: String },
        apiKeySuccess: { type: String },
        contextSuccess: { type: String },
        onBackToFocus: { type: Function }
    };

    constructor() {
        super();
        this.contextText = localStorage.getItem('customPrompt') || '';
        this.apiKey = localStorage.getItem('apiKey') || '';
        this.originalContextText = this.contextText;
        this.originalApiKey = this.apiKey;
        this.isValidatingApiKey = false;
        this.isSavingContext = false;
        this.apiKeyError = '';
        this.apiKeySuccess = '';
        this.contextSuccess = '';
        this.onBackToFocus = () => {};
    }

    connectedCallback() {
        super.connectedCallback();
        // Load current values from localStorage
        this.contextText = localStorage.getItem('customPrompt') || '';
        this.apiKey = localStorage.getItem('apiKey') || '';
        this.originalContextText = this.contextText;
        this.originalApiKey = this.apiKey;
        this.requestUpdate();
    }

    handleContextInput(e) {
        this.contextText = e.target.value;
        // Clear any previous success messages when user starts editing
        if (this.contextSuccess) {
            this.contextSuccess = '';
        }
    }

    handleApiKeyInput(e) {
        this.apiKey = e.target.value;
        // Clear any previous messages when user starts editing
        if (this.apiKeyError || this.apiKeySuccess) {
            this.apiKeyError = '';
            this.apiKeySuccess = '';
        }
    }

    async handleSaveContext() {
        this.isSavingContext = true;
        this.contextSuccess = '';
        
        try {
            // Save to localStorage
            localStorage.setItem('customPrompt', this.contextText.trim());
            this.originalContextText = this.contextText.trim();
            
            // Re-initialize Gemini with new context if API key exists
            if (window.require && this.apiKey) {
                const { ipcRenderer } = window.require('electron');
                try {
                    await ipcRenderer.invoke('initialize-gemini', this.apiKey, this.contextText.trim(), 'interview', 'en-US');
                } catch (error) {
                    console.warn('Failed to re-initialize Gemini with new context:', error);
                }
            }
            
            this.contextSuccess = 'Context saved successfully!';
            
            // Clear success message after 3 seconds
            setTimeout(() => {
                this.contextSuccess = '';
                this.requestUpdate();
            }, 3000);
            
        } catch (error) {
            console.error('Error saving context:', error);
            this.contextSuccess = ''; // This would be an error if we had context error handling
        } finally {
            this.isSavingContext = false;
            this.requestUpdate();
        }
    }

    async handleValidateApiKey() {
        if (!this.apiKey.trim()) {
            this.apiKeyError = 'Please enter an API key';
            return;
        }

        this.isValidatingApiKey = true;
        this.apiKeyError = '';
        this.apiKeySuccess = '';

        try {
            if (window.require) {
                const { ipcRenderer } = window.require('electron');
                const isValid = await ipcRenderer.invoke('validate-api-key', this.apiKey.trim());
                
                if (isValid) {
                    // Save to localStorage
                    localStorage.setItem('apiKey', this.apiKey.trim());
                    localStorage.setItem('apiKeyValidated', 'true');
                    this.originalApiKey = this.apiKey.trim();
                    this.apiKeySuccess = 'API key validated successfully!';
                    
                    // Re-initialize Gemini with new API key
                    try {
                        await ipcRenderer.invoke('initialize-gemini', this.apiKey.trim(), this.contextText, 'interview', 'en-US');
                    } catch (error) {
                        console.warn('Failed to re-initialize Gemini:', error);
                    }
                    
                    // Clear success message after 3 seconds
                    setTimeout(() => {
                        this.apiKeySuccess = '';
                        this.requestUpdate();
                    }, 3000);
                } else {
                    this.apiKeyError = 'Invalid API key. Please check your key and try again.';
                }
            } else {
                this.apiKeyError = 'Validation unavailable in this environment';
            }
        } catch (error) {
            console.error('Error validating API key:', error);
            this.apiKeyError = 'Error validating API key. Please try again.';
        } finally {
            this.isValidatingApiKey = false;
            this.requestUpdate();
        }
    }

    handleGetApiKey() {
        if (window.require) {
            const { shell } = window.require('electron');
            shell.openExternal('https://aistudio.google.com/app/apikey');
        }
    }

    handleBackClick() {
        this.onBackToFocus();
    }

    get hasContextChanged() {
        return this.contextText.trim() !== this.originalContextText;
    }

    get hasApiKeyChanged() {
        return this.apiKey.trim() !== this.originalApiKey;
    }

    render() {
        return html`
            <div class="profile-container">
                <button class="back-button" @click=${this.handleBackClick}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Back to Focus Session
                </button>

                <div class="header">
                    <div class="title">Profile Settings</div>
                    <div class="subtitle">View and edit your AI assistant configuration</div>
                </div>

                <!-- Context Section -->
                <div class="section">
                    <div class="section-title">Personal Context</div>
                    <div class="section-description">
                        Tell the AI about yourself to get more personalized assistance. This information helps the AI understand your role, goals, and preferences.
                    </div>
                    
                    <div class="form-group">
                        <label for="context">About You</label>
                        <textarea
                            id="context"
                            .value=${this.contextText}
                            @input=${this.handleContextInput}
                            placeholder="e.g., I'm a software developer working on web applications. I tend to get distracted by social media and need help staying focused on coding tasks..."
                        ></textarea>
                    </div>

                    <div class="button-group">
                        <button 
                            class="btn btn-primary ${this.hasContextChanged ? '' : 'hidden'}"
                            @click=${this.handleSaveContext}
                            ?disabled=${this.isSavingContext}
                        >
                            ${this.isSavingContext ? 'Saving...' : 'Save Context'}
                        </button>
                    </div>

                    ${this.contextSuccess ? html`
                        <div class="status-message success">${this.contextSuccess}</div>
                    ` : ''}
                </div>

                <!-- API Key Section -->
                <div class="section">
                    <div class="section-title">Gemini API Key</div>
                    <div class="section-description">
                        Your API key enables AI-powered focus monitoring and personalized assistance.
                    </div>
                    
                    <div class="form-group">
                        <label for="api-key">API Key</label>
                        <input
                            id="api-key"
                            type="password"
                            .value=${this.apiKey}
                            @input=${this.handleApiKeyInput}
                            placeholder="Enter your Gemini API key"
                            class="${this.apiKeyError ? 'error' : ''}"
                            ?disabled=${this.isValidatingApiKey}
                        >
                    </div>

                    <div class="button-group">
                        <button 
                            class="btn btn-primary ${this.hasApiKeyChanged ? '' : 'hidden'}"
                            @click=${this.handleValidateApiKey}
                            ?disabled=${this.isValidatingApiKey || !this.apiKey.trim()}
                        >
                            ${this.isValidatingApiKey ? 'Validating...' : 'Validate API Key'}
                        </button>
                    </div>

                    ${this.apiKeyError ? html`
                        <div class="status-message error">${this.apiKeyError}</div>
                    ` : ''}

                    ${this.apiKeySuccess ? html`
                        <div class="status-message success">${this.apiKeySuccess}</div>
                    ` : ''}

                    <div class="help-text">
                        <strong>How to get your API key:</strong><br>
                        1. Go to <span class="link" @click=${this.handleGetApiKey}>Google AI Studio</span><br>
                        2. Sign in with your Google account<br>
                        3. Click "Get API key" and create a new key<br>
                        4. Copy and paste it above
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('profile-view', ProfileView);