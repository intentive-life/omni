import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';

export class AppHeader extends LitElement {
    static styles = css`
        * {
            font-family: 'Inter', sans-serif;
            cursor: default;
            user-select: none;
        }

        .header {
            -webkit-app-region: drag;
            display: flex;
            align-items: center;
            padding: var(--header-padding);
            border: 1px solid var(--border-color);
            background: var(--header-background);
            border-radius: var(--border-radius);
        }

        .header-title {
            flex: 1;
            font-size: var(--header-font-size);
            font-weight: 600;
            -webkit-app-region: drag;
        }

        .header-actions {
            display: flex;
            gap: var(--header-gap);
            align-items: center;
            -webkit-app-region: no-drag;
        }

        .header-actions span {
            font-size: var(--header-font-size-small);
            color: var(--header-actions-color);
        }

        .button {
            background: var(--button-background);
            color: var(--text-color);
            border: 1px solid var(--button-border);
            padding: var(--header-button-padding);
            border-radius: 8px;
            font-size: var(--header-font-size-small);
            font-weight: 500;
        }

        .icon-button {
            background: none;
            color: var(--icon-button-color);
            border: none;
            padding: var(--header-icon-padding);
            border-radius: 8px;
            font-size: var(--header-font-size-small);
            font-weight: 500;
            display: flex;
            opacity: 0.6;
            transition: opacity 0.2s ease;
        }

        .icon-button svg {
            width: var(--icon-size);
            height: var(--icon-size);
        }

        .icon-button:hover {
            background: var(--hover-background);
            opacity: 1;
        }

        .button:hover {
            background: var(--hover-background);
        }

        :host([isclickthrough]) .button:hover,
        :host([isclickthrough]) .icon-button:hover {
            background: transparent;
        }

        .key {
            background: var(--key-background);
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 12px;
            margin: 0px;
        }
    `;

    static properties = {
        currentView: { type: String },
        onTodoClick: { type: Function },
        onSettingsClick: { type: Function },
        onCloseClick: { type: Function },
        onBackClick: { type: Function },
        isClickThrough: { type: Boolean, reflect: true },
    };

    constructor() {
        super();
        this.currentView = 'main';
        this.onCloseClick = () => {};
        this.onBackClick = () => {};
        this.isClickThrough = false;
    }

    connectedCallback() {
        super.connectedCallback();
        this._startTimer();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._stopTimer();
    }

    updated(changedProperties) {
        super.updated(changedProperties);

        // Start/stop timer based on view change
        if (changedProperties.has('currentView')) {
            if (this.currentView === 'assistant' && this.startTime) {
                this._startTimer();
            } else {
                this._stopTimer();
            }
        }

        // Start timer when startTime is set
        if (changedProperties.has('startTime')) {
            if (this.startTime && this.currentView === 'assistant') {
                this._startTimer();
            } else if (!this.startTime) {
                this._stopTimer();
            }
        }
    }

    _startTimer() {
        // Clear any existing timer
        this._stopTimer();

        // Only start timer if we're in assistant view and have a start time
        if (this.currentView === 'assistant' && this.startTime) {
            this._timerInterval = setInterval(() => {
                // Trigger a re-render by requesting an update
                this.requestUpdate();
            }, 1000); // Update every second
        }
    }

    _stopTimer() {
        if (this._timerInterval) {
            clearInterval(this._timerInterval);
            this._timerInterval = null;
        }
    }

    getViewTitle() {
        const titles = {
            onboarding: 'Welcome to Focus Buddy',
            main: 'Focus Buddy',
            customize: 'Customize',
            help: 'Help & Shortcuts',
            history: 'Conversation History',
            advanced: 'Advanced Tools',
            todo: 'Focus Buddy - Todo',
            'focus-session': 'Focus Session',
            'api-key': 'API Key Setup',
            assistant: 'Focus Buddy',
        };
        return titles[this.currentView] || 'Focus Buddy';
    }

    getElapsedTime() {
        if (this.currentView === 'assistant' && this.startTime) {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            return `${elapsed}s`;
        }
        return '';
    }

    isNavigationView() {
        const navigationViews = ['customize', 'help', 'history', 'advanced', 'todo', 'focus-session'];
        return navigationViews.includes(this.currentView);
    }

    render() {
        return html`
            <div class="header">
                <div class="header-title">${this.getViewTitle()}</div>
                <div class="header-actions">
                    ${this.currentView === 'main' ? html`
                        <button class="icon-button" @click=${this.onTodoClick} title="Focus Buddy">
                            <?xml version="1.0" encoding="UTF-8"?><svg
                                width="24px"
                                height="24px"
                                stroke-width="1.7"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                color="currentColor"
                            >
                                <path
                                    d="M9 12L11 14L15 10"
                                    stroke="currentColor"
                                    stroke-width="1.7"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                ></path>
                                <path
                                    d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                    stroke="currentColor"
                                    stroke-width="1.7"
                                ></path>
                            </svg>
                        </button>
                    ` : ''}
                    
                    ${this.currentView === 'todo' ? html`
                        <button class="icon-button" @click=${this.onSettingsClick} title="Settings">
                            <?xml version="1.0" encoding="UTF-8"?><svg
                                width="24px"
                                height="24px"
                                stroke-width="1.7"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                color="currentColor"
                            >
                                <path
                                    d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                                    stroke="currentColor"
                                    stroke-width="1.7"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                ></path>
                                <path
                                    d="M19.6224 10.3954L18.5247 7.7448L20 6L18 4L16.2647 5.48295L13.5578 4.36974L12.9353 2H10.981L10.3491 4.40113L7.70441 5.51596L6 4L4 6L5.45337 7.78885L4.3725 10.4463L2 11V13L4.40111 13.6555L5.51575 16.2997L4 18L6 20L7.79116 18.5403L10.397 19.6123L11 22H13L13.6045 19.6132L16.2551 18.5155C16.6969 18.8313 18 20 18 20L20 18L18.5159 16.2494L19.6139 13.598L21.9999 12.9772L22 11L19.6224 10.3954Z"
                                    stroke="currentColor"
                                    stroke-width="1.7"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                ></path>
                            </svg>
                        </button>
                    ` : ''}

                    <button @click=${this.isNavigationView() ? this.onBackClick : this.onCloseClick} class="icon-button window-close">
                        <?xml version="1.0" encoding="UTF-8"?><svg
                            width="24px"
                            height="24px"
                            stroke-width="1.7"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            color="currentColor"
                        >
                            <path
                                d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426"
                                stroke="currentColor"
                                stroke-width="1.7"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            ></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('app-header', AppHeader);
