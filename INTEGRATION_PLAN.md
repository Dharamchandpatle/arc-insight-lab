# 🔗 Integration Plan: Live Interview from ai-nexus to arc-insight-lab

## Overview

Integrate the live interview functionality from `ai-nexus/frontend/app/spike/live-interview` into `arc-insight-lab` so that:
- `arc-insight-lab` becomes the main frontend application
- `ai-nexus/backend` provides all backend APIs
- Live interview routes redirect to the integrated component

## Steps

### 1. Install Dependencies ✅

Add LiveKit packages to `arc-insight-lab/package.json`:

```bash
cd arc-insight-lab
npm install livekit-client @livekit/components-react @livekit/components-styles
```

### 2. Copy Live Interview Component

- Copy `ai-nexus/frontend/app/spike/live-interview/page.tsx` 
- Adapt it to `arc-insight-lab/src/pages/LiveInterview.tsx`
- Update imports to use Vite/React instead of Next.js
- Use existing `api.ts` service instead of direct fetch calls

### 3. Add Routes

Update `arc-insight-lab/src/App.tsx`:
- Add route: `/hr/live-interview/:interviewId?` (for HR)
- Add route: `/candidate/live-interview/:interviewId?` (for Candidate)
- Add route: `/live-interview` (spike/demo mode)

### 4. Update API Integration

- Use `interviewsAPI.getSpikeToken()` for spike mode
- Use `interviewsAPI.getToken()` for authenticated interviews
- Use `ollamaAPI.generateIdealAnswer()` and `ollamaAPI.scoreAnswer()`
- Add WebSocket URL to environment variables

### 5. Environment Variables

Update `arc-insight-lab/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000/ws/audio
```

### 6. Update Vite Config

Ensure WebSocket proxy is configured in `vite.config.ts` (already done ✅)

## File Structure

```
arc-insight-lab/
├── src/
│   ├── pages/
│   │   └── LiveInterview.tsx  (NEW - adapted from ai-nexus)
│   ├── lib/
│   │   └── api.ts  (UPDATE - add WebSocket helper)
│   └── App.tsx  (UPDATE - add routes)
└── package.json  (UPDATE - add LiveKit deps)
```

## Testing

1. Start backend: `cd ai-nexus/backend && npm start`
2. Start frontend: `cd arc-insight-lab && npm run dev`
3. Test routes:
   - `/live-interview` (spike mode)
   - `/hr/live-interview` (HR mode)
   - `/candidate/live-interview` (Candidate mode)

## Migration Notes

- Next.js `useRouter` → React Router `useNavigate`/`useParams`
- Next.js `process.env.NEXT_PUBLIC_*` → Vite `import.meta.env.VITE_*`
- Next.js API routes → Use `api.ts` service
- Next.js file-based routing → React Router routes in `App.tsx`

