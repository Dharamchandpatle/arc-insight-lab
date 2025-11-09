# Quick Network Setup Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Find Your IP Address
Run this in PowerShell:
```powershell
Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -notlike "127.*"} | Select-Object IPAddress, InterfaceAlias
```

**Your IPs:**
- Wi-Fi: `192.168.0.125` ← **Use this if both laptops are on Wi-Fi**
- Ethernet: `172.16.49.18` ← **Use this if both laptops are on Ethernet**

### Step 2: Run Setup Script (Easiest)
```powershell
cd arc-insight-lab
.\setup-network.ps1
```

The script will:
- ✅ Show available IPs
- ✅ Create `.env` file
- ✅ Update `vite.config.ts`

### Step 3: Manual Setup (Alternative)

**A. Create `.env` file in `arc-insight-lab/`:**
```env
VITE_API_BASE_URL=http://192.168.0.125:5000/api
VITE_WS_URL=ws://192.168.0.125:5000/ws/audio
```
*(Replace `192.168.0.125` with your IP)*

**B. Update `ai-nexus/backend/.env`:**
```env
FRONTEND_URL=http://192.168.0.125:8080
LIVEKIT_URL=ws://192.168.0.125:7880
```
*(Replace `192.168.0.125` with your IP)*

### Step 4: Configure Firewall (Run PowerShell as Administrator)
```powershell
New-NetFirewallRule -DisplayName "Interview App Backend" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Interview App Frontend" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "LiveKit WebSocket" -Direction Inbound -LocalPort 7880 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "LiveKit TCP" -Direction Inbound -LocalPort 7881 -Protocol TCP -Action Allow
```

### Step 5: Start Servers

**Terminal 1 - Backend:**
```bash
cd ai-nexus/backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd arc-insight-lab
npm start
```

### Step 6: Access from Candidate Laptop
Open browser on candidate laptop:
```
http://192.168.0.125:8080
```
*(Replace with your IP)*

---

## 📋 Checklist

- [ ] Found IP address (Wi-Fi or Ethernet)
- [ ] Created `.env` in `arc-insight-lab/`
- [ ] Updated `backend/.env` with FRONTEND_URL and LIVEKIT_URL
- [ ] Configured Windows Firewall (ports 5000, 8080, 7880, 7881)
- [ ] Started backend server
- [ ] Started frontend server
- [ ] Tested from candidate laptop

---

## 🔧 Troubleshooting

**Can't connect?**
1. ✅ Both laptops on same Wi-Fi network?
2. ✅ Firewall rules added?
3. ✅ Servers running?
4. ✅ IP address correct?

**CORS errors?**
- Backend already allows all origins for development
- Check `FRONTEND_URL` in backend `.env`

**LiveKit not working?**
- Check `LIVEKIT_URL` in backend `.env` uses your IP
- Ensure LiveKit server is accessible

---

## 📝 Files Changed

1. `arc-insight-lab/.env` - API URLs
2. `arc-insight-lab/vite.config.ts` - Proxy target
3. `ai-nexus/backend/.env` - Frontend and LiveKit URLs
4. Windows Firewall - Port rules

---

**Need more details?** See `NETWORK_SETUP.md` for comprehensive guide.

