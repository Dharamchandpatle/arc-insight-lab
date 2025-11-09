# 🔗 Integration Guide: Live Interview

## Quick Start

### 1. Install Dependencies ✅
```bash
cd arc-insight-lab
npm install livekit-client @livekit/components-react @livekit/components-styles
```

### 2. Environment Variables

Create/update `arc-insight-lab/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000/ws/audio
```

### 3. Routes Added

The following routes are now available:
- `/live-interview` - Spike/demo mode (no auth)
- `/hr/live-interview/:interviewId?` - HR interview (authenticated)
- `/candidate/live-interview/:interviewId?` - Candidate interview (authenticated)

### 4. How It Works

**For Spike/Demo Mode:**
- Navigate to `/live-interview`
- Select role (HR or Candidate)
- Enter room name
- Start interview

**For Authenticated Interviews:**
- HR: Navigate to `/hr/live-interview/:interviewId`
- Candidate: Navigate to `/candidate/live-interview/:interviewId`
- Uses JWT token from localStorage
- Automatically gets LiveKit token from backend

## Architecture

```
arc-insight-lab (Frontend)
    ↓ API calls
ai-nexus/backend (Backend API)
    ↓ WebSocket
LiveKit Server (Video/Audio)
    ↓
Deepgram (Transcription - optional)
    ↓
Ollama (AI Answers/Scoring)
```

## API Integration

All API calls use the existing `src/lib/api.ts` service:

- `interviewsAPI.getSpikeToken()` - For spike/demo mode
- `interviewsAPI.getToken(interviewId)` - For authenticated interviews
- `ollamaAPI.generateIdealAnswer()` - Generate ideal answers
- `ollamaAPI.scoreAnswer()` - Score candidate answers
- `getWebSocketUrl()` - Get WebSocket URL for audio streaming

## Features

✅ Video conferencing (LiveKit)
✅ Real-time transcription (Browser Speech Recognition + Deepgram)
✅ AI-generated ideal answers (Ollama)
✅ Real-time answer scoring (Ollama)
✅ Cross-participant transcript sharing
✅ Echo cancellation (no feedback)
✅ Microphone mute detection

## Next Steps

1. **Test the integration:**
   ```bash
   # Terminal 1: Start backend
   cd ai-nexus/backend
   npm start
   
   # Terminal 2: Start frontend
   cd arc-insight-lab
   npm run dev
   ```

2. **Navigate to:**
   - `http://localhost:8080/live-interview` (spike mode)
   - Or use authenticated routes from HR/Candidate dashboards

3. **Test with two browsers:**
   - One as HR, one as Candidate
   - Both join same room
   - Verify video, audio, transcription, and AI features work

## Troubleshooting

**"Cannot connect to backend":**
- Check backend is running: `http://localhost:5000/api/health`
- Verify `.env` has correct `VITE_API_BASE_URL`

**"WebSocket connection failed":**
- Check backend WebSocket server is running
- Verify `.env` has correct `VITE_WS_URL`
- Check firewall allows WebSocket connections

**"LiveKit connection failed":**
- Verify LiveKit credentials in `ai-nexus/backend/.env`
- Check `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`

**"No transcription":**
- Check browser permissions (microphone)
- Verify WebSocket is connected (check status bar)
- Check browser console for errors

## Migration Notes

The live interview component has been adapted from Next.js to Vite/React Router:

- ✅ `process.env.NEXT_PUBLIC_*` → `import.meta.env.VITE_*`
- ✅ Next.js API routes → `api.ts` service
- ✅ Next.js `useRouter` → React Router `useNavigate`/`useParams`
- ✅ File-based routing → Routes in `App.tsx`

