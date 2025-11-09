# Backend Integration Guide

This document explains how the frontend (arc-insight-lab) is integrated with the AI-NEXUS backend.

## Overview

The frontend is now fully integrated with the backend API located at `ai-nexus/backend`. All API calls are handled through a centralized API service.

## Configuration

### Environment Variables

Create a `.env` file in the `arc-insight-lab` directory with the following:

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# WebSocket Configuration (for audio streaming)
VITE_WS_URL=ws://localhost:5000/ws/audio
```

**Note:** If you don't create a `.env` file, the default values will be used (localhost:5000).

### Vite Proxy

The `vite.config.ts` includes a proxy configuration that forwards all `/api` requests to the backend:

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
    secure: false,
  },
}
```

This means you can use relative URLs like `/api/auth/login` in your code, and Vite will automatically proxy them to `http://localhost:5000/api/auth/login`.

## API Service

All backend communication is handled through `src/lib/api.ts`. This file exports:

- `authAPI` - Authentication endpoints (login, register, logout)
- `interviewsAPI` - Interview management endpoints
- `reportsAPI` - Report fetching endpoints
- `ollamaAPI` - AI/LLM endpoints for generating answers and scoring

### Authentication

The API service automatically:
- Stores JWT tokens in `localStorage` as `auth_token`
- Includes the token in the `Authorization` header for authenticated requests
- Clears the token on 401 errors

## Updated Components

### AuthContext (`src/contexts/AuthContext.tsx`)

- Now uses real backend API for login/register
- Maps backend roles (`HR_Recruiter`, `Student_Candidate`) to frontend roles (`HR`, `Candidate`)
- Stores user data in `localStorage` for persistence
- Includes `register` function for new user registration

### HRContext (`src/contexts/HRContext.tsx`)

- Fetches interviews from backend when HR user logs in
- `addNewInterview` now schedules interviews via backend API
- Falls back to mock data if backend is unavailable

### HRLogin (`src/pages/HRLogin.tsx`)

- Updated to use `AuthContext` for real authentication
- Shows loading states and error messages
- Navigates based on user role after login

### AI Mock (`src/lib/aiMock.ts`)

- `fetchAiResponse` now calls the Ollama API through the backend
- Falls back to mock responses if API fails

## Backend Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Interviews
- `GET /api/interviews` - Get all interviews for logged-in user
- `POST /api/interviews/schedule` - Schedule a new interview
- `POST /api/interviews/:interviewId/token` - Get LiveKit token for interview
- `POST /api/interviews/:interviewId/start` - Start an interview
- `POST /api/interviews/spike/token` - Get token for spike testing (no auth)

### Reports
- `GET /api/reports` - Get all reports for logged-in user
- `GET /api/reports/:interviewId` - Get report for specific interview

### Ollama (AI)
- `POST /api/ollama/generate-ideal-answer` - Generate ideal answer for a question
- `POST /api/ollama/score-answer` - Score a candidate's answer

### Health Check
- `GET /api/health` - Check if backend is running

## Running the Application

1. **Start the Backend:**
   ```bash
   cd ai-nexus/backend
   npm install
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

2. **Start the Frontend:**
   ```bash
   cd arc-insight-lab
   npm install
   npm run dev
   ```
   Frontend will run on `http://localhost:8080`

3. **Access the Application:**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:5000/api
   - Health Check: http://localhost:5000/api/health

## Testing the Integration

1. **Test Authentication:**
   - Navigate to the login page
   - Register a new user or login with existing credentials
   - Verify token is stored in localStorage

2. **Test Interview Scheduling:**
   - Login as HR
   - Schedule a new interview
   - Verify it appears in the interviews list

3. **Test AI Features:**
   - Start an interview
   - Verify AI responses are generated through the backend

## Troubleshooting

### CORS Errors
- Ensure the backend CORS configuration includes `http://localhost:8080`
- Check that the backend is running on port 5000

### Authentication Errors
- Verify the JWT token is being stored in localStorage
- Check that the token is included in request headers
- Ensure the backend JWT_SECRET matches

### API Connection Errors
- Verify the backend is running: `curl http://localhost:5000/api/health`
- Check the `VITE_API_BASE_URL` in `.env` file
- Ensure no firewall is blocking port 5000

### Proxy Issues
- If using the Vite proxy, ensure requests use relative URLs (`/api/...`)
- If not using proxy, use full URLs with `VITE_API_BASE_URL`

## Next Steps

- [ ] Add error boundaries for better error handling
- [ ] Implement token refresh mechanism
- [ ] Add request retry logic
- [ ] Implement WebSocket connection for real-time features
- [ ] Add loading states for all API calls
- [ ] Implement proper error messages for users

