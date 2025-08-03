import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';

export class ApiKeyView extends LitElement {
    static styles = css`
        :host {
            display: block;
            height: 100%;
            color: var(--text-color);
        }

        .api-key-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            padding: 40px;
            text-align: center;
        }

        .api-key-form {
            background: var(--input-background);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 30px;
            max-width: 500px;
            width: 100%;
        }

        .title {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 10px;
            color: var(--text-color);
        }

        .subtitle {
            font-size: 16px;
            color: var(--description-color);
            margin-bottom: 30px;
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
            text-align: left;
        }

        .form-group input {
            width: 100%;
            padding: 12px;
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            background: var(--input-background);
            color: var(--text-color);
            font-size: 14px;
            font-family: monospace;
        }

        .form-group input:focus {
            outline: none;
            border-color: var(--focus-border-color);
            box-shadow: 0 0 0 2px var(--focus-box-shadow);
        }

        .form-group input.error {
            border-color: #dc3545;
            box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
        }

        .error-message {
            color: #dc3545;
            font-size: 14px;
            margin-top: 8px;
            text-align: left;
        }

        .success-message {
            color: #28a745;
            font-size: 14px;
            margin-top: 8px;
            text-align: left;
        }

        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: var(--border-radius);
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
            transition: all 0.2s ease;
            width: 100%;
        }

        .btn-primary {
            background: var(--text-input-button-background);
            color: white;
        }

        .btn-primary:hover {
            background: var(--text-input-button-hover);
        }

        .btn-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .btn-secondary {
            background: var(--button-background);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            margin-top: 10px;
        }

        .btn-secondary:hover {
            background: var(--hover-background);
        }

        .help-text {
            margin-top: 20px;
            padding: 15px;
            background: var(--button-background);
            border-radius: var(--border-radius);
            font-size: 14px;
            color: var(--description-color);
            text-align: left;
        }

        .help-text h4 {
            margin: 0 0 10px 0;
            color: var(--text-color);
        }

        .help-text ul {
            margin: 0;
            padding-left: 20px;
        }

        .help-text li {
            margin-bottom: 5px;
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
        apiKey: { type: String },
        isValidating: { type: Boolean },
        errorMessage: { type: String },
        successMessage: { type: String }
    };

    constructor() {
        super();
        this.apiKey = localStorage.getItem('apiKey') || '';
        this.isValidating = false;
        this.errorMessage = '';
        this.successMessage = '';
    }

    handleInput(e) {
        this.apiKey = e.target.value;
        localStorage.setItem('apiKey', this.apiKey);
        
        // Clear messages when user starts typing
        if (this.errorMessage || this.successMessage) {
            this.errorMessage = '';
            this.successMessage = '';
        }
    }

    async handleValidate() {
        if (!this.apiKey.trim()) {
            this.errorMessage = 'Please enter your Gemini API key';
            return;
        }

        this.isValidating = true;
        this.errorMessage = '';
        this.successMessage = '';

        try {
            const { ipcRenderer } = window.require('electron');
            const result = await ipcRenderer.invoke('validate-api-key', this.apiKey);
            
            if (result.success) {
                this.successMessage = 'API key validated successfully!';
                // Navigate to todo view after successful validation
                setTimeout(() => {
                    this.dispatchEvent(new CustomEvent('api-key-validated', {
                        bubbles: true,
                        composed: true
                    }));
                }, 1000);
            } else {
                this.errorMessage = result.error || 'Invalid API key. Please check and try again.';
            }
        } catch (error) {
            console.error('Error validating API key:', error);
            this.errorMessage = 'Error validating API key. Please try again.';
        } finally {
            this.isValidating = false;
        }
    }

    handleGetApiKey() {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.invoke('open-external', 'https://aistudio.google.com/app/apikey');
        }
    }



    render() {
        return html`
            <div class="api-key-container">
                <div class="api-key-form">
                    <div class="title">Welcome to Focus Buddy</div>
                    <div class="subtitle">
                        To enable AI-powered distraction detection, please provide your Gemini API key.
                    </div>

                    <div class="form-group">
                        <label for="api-key">Gemini API Key</label>
                        <input 
                            id="api-key"
                            type="password" 
                            .value=${this.apiKey}
                            @input=${this.handleInput}
                            placeholder="Enter your Gemini API key"
                            class="${this.errorMessage ? 'error' : ''}"
                            ?disabled=${this.isValidating}
                        >
                        ${this.errorMessage ? html`
                            <div class="error-message">${this.errorMessage}</div>
                        ` : ''}
                        ${this.successMessage ? html`
                            <div class="success-message">${this.successMessage}</div>
                        ` : ''}
                    </div>

                    <button 
                        @click=${this.handleValidate} 
                        class="btn btn-primary"
                        ?disabled=${this.isValidating || !this.apiKey.trim()}
                    >
                        ${this.isValidating ? 'Validating...' : 'Validate & Continue'}
                    </button>

                    <div class="help-text">
                        <h4>How to get your Gemini API key:</h4>
                        <ul>
                            <li>Go to <span class="link" @click=${this.handleGetApiKey}>Google AI Studio</span></li>
                            <li>Sign in with your Google account</li>
                            <li>Click "Get API key" in the top right</li>
                            <li>Create a new API key or use an existing one</li>
                            <li>Copy the key and paste it above</li>
                        </ul>
                        <p><strong>Note:</strong> Your API key is stored locally and never shared.</p>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('api-key-view', ApiKeyView); 