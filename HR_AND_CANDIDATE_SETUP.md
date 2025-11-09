# 🎯 Setup Guide - HR and Candidate Connection

## 📋 Setup Checklist

### HR Laptop (Your PC)

1. **Find IP Address:**
   ```powershell
   ipconfig
   ```
   Note: **IPv4 Address** (e.g., `192.168.0.125`)

2. **Start Backend:**
   ```bash
   cd ai-nexus/backend
   npm start
   ```
   ✅ Should see: `🚀 AI-NEXUS Backend running on port 5000`

3. **Start Frontend:**
   ```bash
   cd arc-insight-lab
   npm start
   ```
   ✅ Should see: `Local: http://localhost:8080/`

4. **Open Browser:**
   - Go to: `http://localhost:8080`
   - Navigate to: **HR Dashboard → Video Call**
   - Role: **HR**
   - Room: `demo-2024` (or any room name)
   - Click: **Start Interview**

---

### Candidate Laptop

1. **Make sure you have the code:**
   - Either clone the repository, or
   - Copy the `arc-insight-lab` folder to candidate laptop

2. **Create `.env.local` file:**
   ```bash
   cd arc-insight-lab
   # Create file: .env.local
   ```
   
   Add this (replace `192.168.0.125` with HR laptop IP):
   ```env
   VITE_API_BASE_URL=http://192.168.0.125:5000/api
   VITE_WS_URL=ws://192.168.0.125:5000/ws/audio
   ```

3. **Install dependencies (if not done):**
   ```bash
   cd arc-insight-lab
   npm install
   ```

4. **Start Frontend:**
   ```bash
   cd arc-insight-lab
   npm start
   ```
   ✅ Should see: `Local: http://localhost:8080/`

5. **Open Browser:**
   - Go to: `http://localhost:8080`
   - Navigate to: **Candidate Dashboard → Video Call** (or directly to interview)
   - Role: **Candidate**
   - Room: `demo-2024` (**SAME as HR!**)
   - Click: **Start Interview**

---

## ✅ Verify It Works

1. **HR laptop:** Should see candidate's video
2. **Candidate laptop:** Should see HR's video
3. **HR asks question:** Ideal answer appears on HR laptop
4. **Candidate answers:** Transcript appears on HR laptop
5. **After candidate finishes:** Score appears on HR laptop

---

## 🐛 Quick Fixes

**"Connection refused":**
- ✅ Check both laptops on same WiFi
- ✅ Check HR laptop IP is correct
- ✅ Test: `http://HR_IP:5000/api/health` from candidate browser
- ✅ Check Windows Firewall allows port 5000 (HR laptop)

**"No transcription":**
- ✅ Check WebSocket status (should be "Open")
- ✅ Check browser console (F12) for errors
- ✅ Verify microphone permissions

**"No AI answer":**
- ✅ Check backend console for Ollama API calls
- ✅ Verify OLLAMA_API_KEY in backend/.env

**"CORS errors":**
- ✅ Backend CORS is already configured to allow IP-based origins
- ✅ Check `FRONTEND_URL` in backend/.env

**"Environment variable not working":**
- ✅ Make sure file is named `.env.local` (not `.env.local.txt`)
- ✅ Restart the frontend server after creating `.env.local`
- ✅ Check browser console for actual API URL being used

---

## 📞 Emergency Contacts

**Backend not starting?**
```bash
# Kill port 5000
cd ai-nexus/backend
npm run kill-port  # or use kill-port.ps1
npm start
```

**Frontend not connecting?**
- Check `.env.local` has correct IP (candidate laptop)
- Check `.env` has correct IP (HR laptop) 
- Restart frontend: `Ctrl+C` then `npm start`
- Clear browser cache: `Ctrl+Shift+Delete`

**Still stuck?**
- Check browser console (F12) for errors
- Verify both laptops on same network
- Test ping: `ping HR_IP` from candidate laptop
- Test backend: Open `http://HR_IP:5000/api/health` in candidate browser

---

## 🎬 Demo Flow

1. **HR:** "What is time complexity of merge sort?"
   - ✅ Ideal answer appears immediately

2. **Candidate:** Answers the question
   - ✅ Transcript appears on HR laptop

3. **After interview ends:**
   - ✅ AI report generated automatically
   - ✅ Scores and feedback visible on both dashboards

---

## 🔧 Windows Firewall (HR Laptop Only)

Run PowerShell as Administrator:
```powershell
New-NetFirewallRule -DisplayName "Interview App Backend" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "LiveKit WebSocket" -Direction Inbound -LocalPort 7880 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "LiveKit TCP" -Direction Inbound -LocalPort 7881 -Protocol TCP -Action Allow
```

---

## 📝 Important Notes

1. **Same Room Name:** Both HR and Candidate must use the **SAME room name** (e.g., `demo-2024`)

2. **IP Address:** If HR laptop IP changes (reconnects WiFi), update candidate's `.env.local` file

3. **Network:** Both laptops must be on the **same WiFi network**

4. **Ports:**
   - HR laptop: Backend (5000), Frontend (8080), LiveKit (7880)
   - Candidate laptop: Only Frontend (8080) - connects to HR's backend

5. **Environment Files:**
   - HR laptop: Uses `.env` (already configured)
   - Candidate laptop: Uses `.env.local` (overrides default localhost)

---

## 🔍 Verify Configuration

**On Candidate Laptop, check browser console (F12):**
- Look for: `Current API URL: http://HR_IP:5000/api`
- If you see `localhost:5000`, the `.env.local` file is not being read

**Fix:**
1. Make sure file is named exactly `.env.local` (no extension)
2. Restart the frontend server
3. Clear browser cache

---

**Good luck! 🎉**

