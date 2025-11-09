# ✅ Integration Summary: Live Interview

## What's Done ✅

1. **Dependencies Installed** ✅
   - `livekit-client`
   - `@livekit/components-react`
   - `@livekit/components-styles`

2. **API Service Updated** ✅
   - Added `getWebSocketUrl()` helper
   - WebSocket URL from environment variables

3. **Documentation Created** ✅
   - `INTEGRATION_PLAN.md` - Detailed plan
   - `INTEGRATION_GUIDE.md` - Quick start guide

## What Needs to Be Done ⚠️

### 1. Copy Live Interview Component

**Source:** `ai-nexus/frontend/app/spike/live-interview/page.tsx`  
**Destination:** `arc-insight-lab/src/pages/LiveInterview.tsx`

**Key Changes Needed:**
- Remove `'use client'` directive (not needed in Vite)
- Replace `process.env.NEXT_PUBLIC_*` with `import.meta.env.VITE_*`
- Replace direct `fetch()` calls with `api.ts` service:
  - `interviewsAPI.getSpikeToken()` for spike mode
  - `interviewsAPI.getToken()` for authenticated mode
  - `ollamaAPI.generateIdealAnswer()` for AI answers
  - `ollamaAPI.scoreAnswer()` for scoring
  - `getWebSocketUrl()` for WebSocket connection
- Remove Next.js-specific imports (if any)
- Keep all LiveKit, transcription, and AI logic intact

### 2. Add Routes to App.tsx

Add these routes to `arc-insight-lab/src/App.tsx`:

```tsx
// Import the component
import LiveInterview from "./pages/LiveInterview";

// Add routes inside <Routes>
<Route path="/live-interview" element={<LiveInterview />} />
<Route path="/hr/live-interview/:interviewId?" element={<LiveInterview />} />
<Route path="/candidate/live-interview/:interviewId?" element={<LiveInterview />} />
```

### 3. Update Component to Use React Router

In `LiveInterview.tsx`, replace Next.js router with React Router:

```tsx
// Replace Next.js imports
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

// Get route params
const { interviewId } = useParams<{ interviewId?: string }>();
const [searchParams] = useSearchParams();
const roleParam = searchParams.get('role') as 'hr' | 'candidate' | null;

// Navigation
const navigate = useNavigate();
// Use navigate('/path') instead of router.push()
```

### 4. Environment Variables

Create/update `arc-insight-lab/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000/ws/audio
```

## Quick Integration Steps

1. **Copy the component:**
   ```bash
   # Copy from ai-nexus to arc-insight-lab
   cp ai-nexus/frontend/app/spike/live-interview/page.tsx arc-insight-lab/src/pages/LiveInterview.tsx
   ```

2. **Make the changes:**
   - Update imports (remove Next.js, add React Router)
   - Replace environment variables
   - Replace API calls with `api.ts` service
   - Update router usage

3. **Add routes:**
   - Update `App.tsx` with new routes

4. **Test:**
   ```bash
   # Terminal 1: Backend
   cd ai-nexus/backend && npm start
   
   # Terminal 2: Frontend
   cd arc-insight-lab && npm run dev
   
   # Navigate to: http://localhost:8080/live-interview
   ```

## File Structure After Integration

```
arc-insight-lab/
├── src/
│   ├── pages/
│   │   └── LiveInterview.tsx  (NEW - from ai-nexus)
│   ├── lib/
│   │   └── api.ts  (UPDATED - WebSocket helper added)
│   └── App.tsx  (UPDATE - add routes)
├── .env  (CREATE/UPDATE - add VITE_WS_URL)
└── package.json  (UPDATED - LiveKit deps added)
```

## Testing Checklist

- [ ] Component loads without errors
- [ ] Spike mode works (`/live-interview`)
- [ ] HR route works (`/hr/live-interview`)
- [ ] Candidate route works (`/candidate/live-interview`)
- [ ] Video conferencing works
- [ ] Transcription works
- [ ] AI answers generate
- [ ] Scoring works
- [ ] WebSocket connection works
- [ ] No console errors

## Next Steps

1. **Copy and adapt the component** (see steps above)
2. **Add routes** to `App.tsx`
3. **Test thoroughly** with two browsers
4. **Update navigation** in HR/Candidate dashboards to link to live interview

## Support

If you encounter issues:
1. Check `INTEGRATION_GUIDE.md` for troubleshooting
2. Verify backend is running: `http://localhost:5000/api/health`
3. Check browser console for errors
4. Verify environment variables are set correctly

