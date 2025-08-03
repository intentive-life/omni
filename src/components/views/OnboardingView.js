import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';

export class OnboardingView extends LitElement {
    static styles = css`
        * {
            font-family:
                'Inter',
                -apple-system,
                BlinkMacSystemFont,
                'Segoe UI',
                Roboto,
                sans-serif;
            cursor: default;
            user-select: none;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :host {
            display: block;
            height: 100%;
            width: 100%;
            position: fixed;
            top: 0;
            left: 0;
            overflow: hidden;
        }

        .onboarding-container {
            position: relative;
            width: 100%;
            height: 100%;
            background: #0a0a0a;
            overflow: hidden;
        }

        .gradient-canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 0;
        }

        .content-wrapper {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 60px;
            z-index: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 32px 48px;
            max-width: 500px;
            color: #e5e5e5;
            overflow: hidden;
        }



        .slide-icon {
            width: 48px;
            height: 48px;
            margin-bottom: 16px;
            opacity: 0.9;
            display: block;
        }

        .slide-title {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 12px;
            color: #ffffff;
            line-height: 1.3;
        }

        .slide-content {
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 24px;
            color: #b8b8b8;
            font-weight: 400;
        }

        .context-textarea {
            width: 100%;
            height: 100px;
            padding: 16px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.05);
            color: #e5e5e5;
            font-size: 14px;
            font-family: inherit;
            resize: vertical;
            transition: all 0.2s ease;
            margin-bottom: 24px;
        }

        .context-textarea::placeholder {
            color: rgba(255, 255, 255, 0.4);
            font-size: 14px;
        }

        .context-textarea:focus {
            outline: none;
            border-color: rgba(255, 255, 255, 0.2);
            background: rgba(255, 255, 255, 0.08);
        }

        .feature-list {
            max-width: 100%;
        }

        .feature-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            font-size: 15px;
            color: #b8b8b8;
        }

        .feature-icon {
            font-size: 16px;
            margin-right: 12px;
            opacity: 0.8;
        }

        .navigation {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 2;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 24px;
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            height: 60px;
            box-sizing: border-box;
        }

        .nav-button {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #e5e5e5;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 36px;
            min-height: 36px;
        }

        .nav-button:hover {
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(255, 255, 255, 0.2);
        }

        .nav-button:active {
            transform: scale(0.98);
        }

        .nav-button:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }

        .nav-button:disabled:hover {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.1);
            transform: none;
        }

        .progress-dots {
            display: flex;
            gap: 12px;
            align-items: center;
        }

        .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            transition: all 0.2s ease;
            cursor: pointer;
        }

        .dot:hover {
            background: rgba(255, 255, 255, 0.4);
        }

        .dot.active {
            background: rgba(255, 255, 255, 0.8);
            transform: scale(1.2);
        }

        .api-key-form {
            margin-bottom: 24px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.8);
            text-align: left;
        }

        .form-group input {
            width: 100%;
            padding: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.05);
            color: #e5e5e5;
            font-size: 14px;
            font-family: monospace;
            transition: all 0.2s ease;
        }

        .form-group input::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }

        .form-group input:focus {
            outline: none;
            border-color: rgba(255, 255, 255, 0.2);
            background: rgba(255, 255, 255, 0.08);
        }

        .form-group input.error {
            border-color: #dc3545;
            box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
        }

        .error-message {
            color: #dc3545;
            font-size: 12px;
            margin-top: 8px;
            text-align: left;
        }

        .success-message {
            color: #28a745;
            font-size: 12px;
            margin-top: 8px;
            text-align: left;
        }

        .help-text {
            margin-top: 16px;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
            text-align: left;
        }

        .link {
            color: rgba(255, 255, 255, 0.8);
            text-decoration: underline;
            cursor: pointer;
        }

        .link:hover {
            color: #ffffff;
        }
    `;

    static properties = {
        currentSlide: { type: Number },
        contextText: { type: String },
        apiKey: { type: String },
        isValidatingApiKey: { type: Boolean },
        apiKeyError: { type: String },
        apiKeySuccess: { type: String },
        onComplete: { type: Function },
        onClose: { type: Function },
    };

    constructor() {
        super();
        this.currentSlide = 0;
        this.contextText = '';
        this.apiKey = localStorage.getItem('apiKey') || '';
        this.isValidatingApiKey = false;
        this.apiKeyError = '';
        this.apiKeySuccess = '';
        this.onComplete = () => {};
        this.onClose = () => {};
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;

        // Transition properties
        this.isTransitioning = false;
        this.transitionStartTime = 0;
        this.transitionDuration = 800; // 800ms fade duration
        this.previousColorScheme = null;

        // Subtle dark color schemes for each slide
        this.colorSchemes = [
            // Slide 1 - Welcome (Very dark purple/gray)
            [
                [25, 25, 35], // Dark gray-purple
                [20, 20, 30], // Darker gray
                [30, 25, 40], // Slightly purple
                [15, 15, 25], // Very dark
                [35, 30, 45], // Muted purple
                [10, 10, 20], // Almost black
            ],
            // Slide 2 - API Key (Dark blue-gray)
            [
                [20, 25, 35], // Dark blue-gray
                [15, 20, 30], // Darker blue-gray
                [25, 30, 40], // Slightly blue
                [10, 15, 25], // Very dark blue
                [30, 35, 45], // Muted blue
                [5, 10, 20], // Almost black
            ],
            // Slide 3 - Context (Dark neutral)
            [
                [25, 25, 25], // Neutral dark
                [20, 20, 20], // Darker neutral
                [30, 30, 30], // Light dark
                [15, 15, 15], // Very dark
                [35, 35, 35], // Lighter dark
                [10, 10, 10], // Almost black
            ],
            // Slide 4 - Complete (Dark warm gray)
            [
                [30, 25, 20], // Dark warm gray
                [25, 20, 15], // Darker warm
                [35, 30, 25], // Slightly warm
                [20, 15, 10], // Very dark warm
                [40, 35, 30], // Muted warm
                [15, 10, 5], // Almost black
            ],
        ];
    }

    firstUpdated() {
        this.canvas = this.shadowRoot.querySelector('.gradient-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        this.startGradientAnimation();

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        window.removeEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        if (!this.canvas) return;

        const rect = this.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }

    startGradientAnimation() {
        if (!this.ctx) return;

        const animate = timestamp => {
            this.drawGradient(timestamp);
            this.animationId = requestAnimationFrame(animate);
        };

        animate(0);
    }

    drawGradient(timestamp) {
        if (!this.ctx || !this.canvas) return;

        const { width, height } = this.canvas;
        let colors = this.colorSchemes[this.currentSlide];

        // Handle color scheme transitions
        if (this.isTransitioning && this.previousColorScheme) {
            const elapsed = timestamp - this.transitionStartTime;
            const progress = Math.min(elapsed / this.transitionDuration, 1);

            // Use easing function for smoother transition
            const easedProgress = this.easeInOutCubic(progress);

            colors = this.interpolateColorSchemes(this.previousColorScheme, this.colorSchemes[this.currentSlide], easedProgress);

            // End transition when complete
            if (progress >= 1) {
                this.isTransitioning = false;
                this.previousColorScheme = null;
            }
        }

        const time = timestamp * 0.0005; // Much slower animation

        // Create moving gradient with subtle flow
        const flowX = Math.sin(time * 0.7) * width * 0.3;
        const flowY = Math.cos(time * 0.5) * height * 0.2;

        const gradient = this.ctx.createLinearGradient(flowX, flowY, width + flowX * 0.5, height + flowY * 0.5);

        // Very subtle color variations with movement
        colors.forEach((color, index) => {
            const offset = index / (colors.length - 1);
            const wave = Math.sin(time + index * 0.3) * 0.05; // Very subtle wave

            const r = Math.max(0, Math.min(255, color[0] + wave * 5));
            const g = Math.max(0, Math.min(255, color[1] + wave * 5));
            const b = Math.max(0, Math.min(255, color[2] + wave * 5));

            gradient.addColorStop(offset, `rgb(${r}, ${g}, ${b})`);
        });

        // Fill with moving gradient
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, height);

        // Add a second layer with radial gradient for more depth
        const centerX = width * 0.5 + Math.sin(time * 0.3) * width * 0.15;
        const centerY = height * 0.5 + Math.cos(time * 0.4) * height * 0.1;
        const radius = Math.max(width, height) * 0.8;

        const radialGradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);

        // Very subtle radial overlay
        radialGradient.addColorStop(0, `rgba(${colors[0][0] + 10}, ${colors[0][1] + 10}, ${colors[0][2] + 10}, 0.1)`);
        radialGradient.addColorStop(0.5, `rgba(${colors[2][0]}, ${colors[2][1]}, ${colors[2][2]}, 0.05)`);
        radialGradient.addColorStop(
            1,
            `rgba(${colors[colors.length - 1][0]}, ${colors[colors.length - 1][1]}, ${colors[colors.length - 1][2]}, 0.03)`
        );

        this.ctx.globalCompositeOperation = 'overlay';
        this.ctx.fillStyle = radialGradient;
        this.ctx.fillRect(0, 0, width, height);
        this.ctx.globalCompositeOperation = 'source-over';
    }

    async nextSlide() {
        // If we're on the API key slide (slide 1), validate before proceeding
        if (this.currentSlide === 1) {
            const isValid = await this.handleApiKeyValidation();
            if (!isValid) {
                return; // Don't proceed if API key is invalid
            }
        }
        
        if (this.currentSlide < 3) {
            this.startColorTransition(this.currentSlide + 1);
        } else {
            this.completeOnboarding();
        }
    }

    prevSlide() {
        if (this.currentSlide > 0) {
            this.startColorTransition(this.currentSlide - 1);
        }
    }

    startColorTransition(newSlide) {
        this.previousColorScheme = [...this.colorSchemes[this.currentSlide]];
        this.currentSlide = newSlide;
        this.isTransitioning = true;
        this.transitionStartTime = performance.now();
    }

    // Interpolate between two color schemes
    interpolateColorSchemes(scheme1, scheme2, progress) {
        return scheme1.map((color1, index) => {
            const color2 = scheme2[index];
            return [
                color1[0] + (color2[0] - color1[0]) * progress,
                color1[1] + (color2[1] - color1[1]) * progress,
                color1[2] + (color2[2] - color1[2]) * progress,
            ];
        });
    }

    // Easing function for smooth transitions
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    handleContextInput(e) {
        this.contextText = e.target.value;
    }

    handleApiKeyInput(e) {
        this.apiKey = e.target.value;
        localStorage.setItem('apiKey', this.apiKey);
        
        // Clear messages when user starts typing
        if (this.apiKeyError || this.apiKeySuccess) {
            this.apiKeyError = '';
            this.apiKeySuccess = '';
        }
    }

    async handleApiKeyValidation() {
        if (!this.apiKey.trim()) {
            this.apiKeyError = 'Please enter your Gemini API key';
            return false;
        }

        this.isValidatingApiKey = true;
        this.apiKeyError = '';
        this.apiKeySuccess = '';

        try {
            const { ipcRenderer } = window.require('electron');
            const result = await ipcRenderer.invoke('validate-api-key', this.apiKey);
            
            if (result.success) {
                this.apiKeySuccess = 'API key validated successfully!';
                localStorage.setItem('apiKeyValidated', 'true');
                return true;
            } else {
                this.apiKeyError = result.error || 'Invalid API key. Please check and try again.';
                return false;
            }
        } catch (error) {
            console.error('Error validating API key:', error);
            this.apiKeyError = 'Error validating API key. Please try again.';
            return false;
        } finally {
            this.isValidatingApiKey = false;
        }
    }

    handleGetApiKey() {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.invoke('open-external', 'https://aistudio.google.com/app/apikey');
        }
    }

    completeOnboarding() {
        if (this.contextText.trim()) {
            localStorage.setItem('customPrompt', this.contextText.trim());
        }
        localStorage.setItem('onboardingCompleted', 'true');
        // Ensure API key validation is marked as complete
        localStorage.setItem('apiKeyValidated', 'true');
        this.onComplete();
    }

    getSlideContent() {
        const slides = [
            {
                icon: 'assets/onboarding/welcome.svg',
                title: 'Welcome to Focus Buddy',
                content:
                    'Your AI assistant that helps you stay focused by monitoring your screen activity and providing personalized motivation.',
            },
            {
                icon: 'assets/onboarding/security.svg',
                title: 'Setup Your AI Assistant',
                content: 'To enable AI-powered focus monitoring, please provide your Gemini API key.',
                showApiKey: true,
            },
            {
                icon: 'assets/onboarding/context.svg',
                title: 'Tell Us About Yourself',
                content: 'Share relevant information to help the AI provide better, more personalized assistance.',
                showTextarea: true,
            },
            {
                icon: 'assets/onboarding/ready.svg',
                title: 'Ready to Focus!',
                content: 'Your AI-powered focus assistant is now configured and ready to help you stay productive.',
            },
        ];

        return slides[this.currentSlide];
    }



    render() {
        const slide = this.getSlideContent();

        return html`
            <div class="onboarding-container">
                <canvas class="gradient-canvas"></canvas>
                


                <div class="content-wrapper">
                    <img class="slide-icon" src="${slide.icon}" alt="${slide.title} icon" />
                    <div class="slide-title">${slide.title}</div>
                    <div class="slide-content">${slide.content}</div>

                    ${slide.showApiKey
                        ? html`
                              <div class="api-key-form">
                                  <div class="form-group">
                                      <label for="api-key">Gemini API Key</label>
                                      <input 
                                          id="api-key"
                                          type="password" 
                                          .value=${this.apiKey}
                                          @input=${this.handleApiKeyInput}
                                          placeholder="Enter your Gemini API key"
                                          class="${this.apiKeyError ? 'error' : ''}"
                                          ?disabled=${this.isValidatingApiKey}
                                      >
                                      ${this.apiKeyError ? html`
                                          <div class="error-message">${this.apiKeyError}</div>
                                      ` : ''}
                                      ${this.apiKeySuccess ? html`
                                          <div class="success-message">${this.apiKeySuccess}</div>
                                      ` : ''}
                                  </div>
                                  <div class="help-text">
                                      <strong>How to get your API key:</strong><br>
                                      1. Go to <span class="link" @click=${this.handleGetApiKey}>Google AI Studio</span><br>
                                      2. Sign in with your Google account<br>
                                      3. Click "Get API key" and create a new key<br>
                                      4. Copy and paste it above
                                  </div>
                              </div>
                          `
                        : ''}
                    ${slide.showTextarea
                        ? html`
                              <textarea
                                  class="context-textarea"
                                  placeholder="Tell us about yourself, your work, goals, or anything that would help the AI provide better focus assistance..."
                                  .value=${this.contextText}
                                  @input=${this.handleContextInput}
                              ></textarea>
                          `
                        : ''}
                    ${slide.showFeatures
                        ? html`
                              <div class="feature-list">
                                  <div class="feature-item">
                                      <span class="feature-icon">🎨</span>
                                      Customize AI behavior and responses
                                  </div>
                                  <div class="feature-item">
                                      <span class="feature-icon">📚</span>
                                      Review conversation history
                                  </div>
                                  <div class="feature-item">
                                      <span class="feature-icon">🔧</span>
                                      Adjust capture settings and intervals
                                  </div>
                              </div>
                          `
                        : ''}
                </div>

                <div class="navigation">
                    <button class="nav-button" @click=${this.prevSlide} ?disabled=${this.currentSlide === 0}>
                        <svg width="16px" height="16px" stroke-width="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 6L9 12L15 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </button>

                    <div class="progress-dots">
                        ${[0, 1, 2, 3].map(
                            index => html`
                                <div
                                    class="dot ${index === this.currentSlide ? 'active' : ''}"
                                    @click=${() => {
                                        if (index !== this.currentSlide) {
                                            this.startColorTransition(index);
                                        }
                                    }}
                                ></div>
                            `
                        )}
                    </div>

                    <button class="nav-button" @click=${this.nextSlide} ?disabled=${this.isValidatingApiKey}>
                        ${this.currentSlide === 3
                            ? 'Get Started'
                            : this.currentSlide === 1 && this.isValidatingApiKey
                            ? 'Validating...'
                            : this.currentSlide === 1
                            ? 'Validate & Continue'
                            : html`
                                  <svg width="16px" height="16px" stroke-width="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                                  </svg>
                              `}
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('onboarding-view', OnboardingView);
