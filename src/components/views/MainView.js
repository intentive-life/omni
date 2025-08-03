import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { resizeLayout } from '../../utils/windowResize.js';

export class MainView extends LitElement {
    static styles = css`
        * {
            font-family: 'Inter', sans-serif;
            cursor: default;
            user-select: none;
        }

        .welcome {
            font-size: 24px;
            margin-bottom: 8px;
            font-weight: 600;
            margin-top: auto;
        }

        .subtitle {
            font-size: 16px;
            color: var(--description-color);
            margin-bottom: 30px;
            line-height: 1.5;
        }

        .feature-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }

        .feature-card {
            background: var(--input-background);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius);
            padding: 20px;
            text-align: center;
            transition: all 0.2s ease;
        }

        .feature-card:hover {
            border-color: var(--focus-border-color);
            transform: translateY(-2px);
        }

        .feature-icon {
            font-size: 32px;
            margin-bottom: 10px;
        }

        .feature-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
            color: var(--text-color);
        }

        .feature-description {
            font-size: 14px;
            color: var(--description-color);
            line-height: 1.4;
        }

        .get-started-btn {
            background: var(--text-input-button-background);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: var(--border-radius);
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s ease;
            width: 100%;
        }

        .get-started-btn:hover {
            background: var(--text-input-button-hover);
        }

        .stats {
            display: flex;
            justify-content: space-around;
            margin-top: 30px;
            padding: 20px;
            background: var(--input-background);
            border-radius: var(--border-radius);
            border: 1px solid var(--border-color);
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
            margin-top: 4px;
        }
    `;

    static properties = {
        onGetStarted: { type: Function }
    };

    constructor() {
        super();
        this.loadLayoutMode();
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadLayoutMode();
    }

    loadLayoutMode() {
        const savedLayoutMode = localStorage.getItem('layoutMode');
        if (savedLayoutMode && savedLayoutMode !== 'normal') {
            // Notify parent component to apply the saved layout mode
            this.onLayoutModeChange(savedLayoutMode);
        }
    }

    handleGetStarted() {
        if (this.onGetStarted) {
            this.onGetStarted();
        }
    }

    render() {
        return html`
            <div class="welcome">Focus Buddy</div>
            <div class="subtitle">
                Your personal productivity companion that helps you stay focused and get more done.
            </div>

            <div class="feature-grid">
                <div class="feature-card">
                    <div class="feature-icon">📝</div>
                    <div class="feature-title">Task Management</div>
                    <div class="feature-description">
                        Organize your tasks with a simple todo list. Track what needs to be done and what's completed.
                    </div>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">🎯</div>
                    <div class="feature-title">Focus Sessions</div>
                    <div class="feature-description">
                        Start focused work sessions with screen monitoring and distraction detection.
                    </div>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">📊</div>
                    <div class="feature-title">Activity Tracking</div>
                    <div class="feature-description">
                        Monitor your digital activity and get insights into your productivity patterns.
                    </div>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">🔔</div>
                    <div class="feature-title">Smart Reminders</div>
                    <div class="feature-description">
                        Get gentle nudges when you get distracted and reminders to stay on track.
                    </div>
                </div>
            </div>

            <button @click=${this.handleGetStarted} class="get-started-btn">
                Get Started with Focus Buddy
            </button>

            <div class="stats">
                <div class="stat-item">
                    <div class="stat-value">0</div>
                    <div class="stat-label">Tasks</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">0</div>
                    <div class="stat-label">Focus Sessions</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">0h</div>
                    <div class="stat-label">Time Focused</div>
                </div>
            </div>
        `;
    }
}

customElements.define('main-view', MainView);
