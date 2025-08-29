# Feedback Kiosk Application

An interactive video feedback kiosk that collects voice feedback from users through a simple touch interface.

## Features

- **Video Loop System**: Three-stage video playback (Welcome → Questions → Thank You)
- **Audio Recording**: Records user feedback using device microphone
- **Dual Mode Interface**: Switch between customer-facing kiosk and admin audio file management
- **Session-Based Storage**: Audio files stored per session
- **Mobile & Desktop Ready**: Works on Mac, iPhone, iPad, and other devices

## Architecture

### Frontend (React + TypeScript)
- **VideoPlayer**: Manages video playback and transitions
- **AudioRecorder**: Handles microphone recording using Web Audio API
- **CustomerKiosk**: Main customer-facing interface
- **AudioFilesView**: Admin interface for managing recordings

### Backend (Node.js + Express)
- **SessionManager**: Manages session-based file storage
- **AudioService**: Handles audio file operations
- **API Routes**: RESTful endpoints for audio management

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Place your video files in the `videos/` directory:
   - `1.mp4` - Welcome/invitation video
   - `2.mp4` - Questions video
   - `3.mp4` - Thank you video

3. Run development server:
```bash
npm run dev
```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Usage

### Customer Mode
1. Customer sees welcome video (loops)
2. Tap/click to start feedback session
3. Questions video plays while recording audio
4. Tap/click to finish recording
5. Thank you video plays once
6. Returns to welcome video

### Admin Mode
- Press 'S' key or click "Audio Files" button
- View all recorded audio files
- Play back recordings
- Delete unwanted files

## Deployment on Render

### Option 1: Using render.yaml
1. Push code to GitHub
2. Connect repository to Render
3. Render will auto-detect `render.yaml` configuration

### Option 2: Manual Setup
1. Create new Web Service on Render
2. Connect GitHub repository
3. Configure:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment Variables:
     - `PORT`: 10000
     - `NODE_ENV`: production

### Option 3: Docker Deployment
1. Render will auto-detect Dockerfile
2. Builds and deploys containerized application

## Environment Variables

- `PORT`: Server port (default: 5000, Render uses 10000)
- `NODE_ENV`: Environment mode (development/production)

## Browser Requirements

- Modern browser with WebRTC support
- Microphone access permission
- JavaScript enabled

## Security Notes

- Audio files are session-based and stored temporarily
- Microphone permissions required for recording
- HTTPS required for production deployment (handled by Render)

## Modular Design

The application is built with modularity in mind:

- **Services**: Isolated business logic (VideoPreloader, AudioRecorder, ApiClient)
- **Components**: Reusable UI components
- **Routes**: Organized API endpoints
- **Middleware**: Pluggable request processing

This design allows for easy expansion:
- Add new video states
- Implement different storage backends
- Add authentication/authorization
- Integrate with external services
- Customize UI themes