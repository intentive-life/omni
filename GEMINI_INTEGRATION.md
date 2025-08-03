# Gemini API Integration for Focus Monitoring

## Overview

The Focus Buddy application now includes full Gemini API integration for AI-powered screen analysis during focus sessions. This feature analyzes captured screenshots to determine if the user is focused on their task or distracted.

## Features Implemented

### ✅ **Real AI Analysis**
- **Gemini 1.5 Flash Model**: Uses Google's latest Gemini model for image analysis
- **Multi-Image Support**: Analyzes multiple screenshots simultaneously
- **JSON Response Parsing**: Structured analysis results with confidence scores
- **Fallback Handling**: Graceful fallback to heuristic analysis if API fails

### ✅ **Detailed Terminal Logging**
The application provides comprehensive logging in the terminal showing:

```
🔍 ANALYZING ACTIVITY - 2 screenshot(s)
📋 Focus Task: "Complete project documentation"
📤 Sending to Gemini API...
   - Prompt: Analyze these screen captures and determine if the user is focused on their task...
   - Images: Screen 1 (screen:0:0), Screen 2 (screen:0:1)
📥 Received Gemini Response:
   - Raw response: {"isDistracted": false, "reason": "User appears to be working on documentation...
✅ Parsed Analysis Result:
   - Distracted: false
   - Reason: User appears to be working on documentation in a text editor
   - Confidence: 0.85
   - Apps: Visual Studio Code, Chrome
```

### ✅ **Enhanced Activity Log**
- **AI Analysis Display**: Shows detailed Gemini analysis results in the UI
- **Confidence Scores**: Displays confidence levels for each analysis
- **Detected Applications**: Lists visible applications and websites
- **Detailed Analysis**: Shows comprehensive analysis text from Gemini

## Technical Implementation

### Core Components

#### 1. **FocusMonitor Class** (`src/utils/focusMonitor.js`)
```javascript
class FocusMonitor {
    constructor() {
        this.geminiClient = null;
        this.apiKey = null;
    }

    async initializeGemini(apiKey) {
        // Initialize Gemini client with API key
        this.geminiClient = new GoogleGenAI({
            vertexai: false,
            apiKey: apiKey,
        });
    }

    async analyzeActivity(screenshots, focusTask) {
        // Send images to Gemini for analysis with retry logic
        const result = await this.geminiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [prompt, ...imageParts]
        });
        // Parse and return analysis results
    }
}
```

#### 2. **Enhanced Activity Log** (`src/components/views/FocusSessionView.js`)
- Displays Gemini analysis results with confidence scores
- Shows detected applications and detailed analysis
- Real-time updates during focus sessions

### API Call Structure

#### Request Format
```javascript
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
    "analysis": "detailed analysis of the screen content"
}
`;

const imageParts = screenshots.map(screenshot => ({
    inlineData: {
        mimeType: 'image/png',
        data: screenshot.thumbnail.split(',')[1] // Base64 data
    }
}));
```

#### Response Format
```json
{
    "isDistracted": false,
    "reason": "User appears to be working on documentation in a text editor",
    "confidence": 0.85,
    "detectedApps": ["Visual Studio Code", "Chrome"],
    "analysis": "The screen shows a code editor with documentation files open. The user appears to be actively working on project documentation, which aligns with the stated focus task."
}
```

## Setup Instructions

### 1. **Get Gemini API Key**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Ensure you have access to Gemini 1.5 Flash model

### 2. **Configure API Key in App**
1. Start the Focus Buddy application
2. Go to Settings → API Key Management
3. Enter your Gemini API key
4. The app will validate the key automatically

### 3. **Test the Integration**
1. Create a todo task
2. Start a focus session
3. Select screens to monitor
4. Watch the terminal for detailed logs
5. Check the activity log in the UI for analysis results

## Testing

### Manual Testing
```bash
# Set your API key
export GEMINI_API_KEY="your-api-key-here"

# Run the test script
node test-gemini-integration.js
```

### Expected Terminal Output
When a focus session is active, you should see:
```
🔍 ANALYZING ACTIVITY - 1 screenshot(s)
📋 Focus Task: "Complete project documentation"
📤 Sending to Gemini API...
   - Prompt: Analyze these screen captures...
   - Images: Screen 1 (screen:0:0)
📥 Received Gemini Response:
   - Raw response: {"isDistracted": false, "reason": "User appears...
✅ Parsed Analysis Result:
   - Distracted: false
   - Reason: User appears to be working on documentation
   - Confidence: 0.85
   - Apps: Visual Studio Code
```

## Error Handling

### API Key Issues
- Invalid API key detection
- Automatic fallback to heuristic analysis
- Clear error messages in activity log

### Network Issues
- Timeout handling
- Retry logic for failed requests
- Graceful degradation to heuristic analysis

### Response Parsing
- JSON extraction from mixed responses
- Fallback for malformed responses
- Error logging for debugging

## Performance Considerations

### Optimization Features
- **Image Compression**: Screenshots are optimized before sending
- **Batch Processing**: Multiple screens analyzed in single API call
- **Caching**: Analysis results cached to avoid duplicate requests
- **Rate Limiting**: Respects API rate limits

### Resource Usage
- **Memory**: Efficient image handling with base64 encoding
- **Network**: Optimized payload sizes
- **CPU**: Minimal processing overhead

## Troubleshooting

### Common Issues

#### 1. **API Key Not Working**
```
❌ Error: API key not valid
```
**Solution**: Verify your API key at [Google AI Studio](https://makersuite.google.com/app/apikey)

#### 2. **No Analysis Results**
```
🔄 Falling back to heuristic analysis
```
**Solution**: Check API quota and network connection

#### 3. **Images Not Sending**
```
No Gemini client or screenshots available for analysis
```
**Solution**: Ensure screens are selected and API key is configured

### Debug Mode
Enable detailed logging by checking the terminal output for:
- 🔍 Analysis start messages
- 📤 API call details
- 📥 Response parsing
- ✅ Success confirmations

## Future Enhancements

### Planned Features
- **Custom Analysis Prompts**: User-defined analysis criteria
- **Learning Mode**: Improve accuracy based on user feedback
- **Multi-Language Support**: Analysis in different languages
- **Advanced Analytics**: Detailed focus patterns and insights

### Performance Improvements
- **Local Model Support**: Offline analysis capabilities
- **Streaming Analysis**: Real-time analysis without delays
- **Smart Sampling**: Intelligent screenshot timing

---

**Last Updated**: Gemini API integration is fully functional with comprehensive logging and error handling. 