# Network Configuration Summary

## What Needs to Change for Network Access

### 1. Frontend Configuration (`arc-insight-lab/`)

**Create `.env` file:**
```env
VITE_API_BASE_URL=http://YOUR_IP:5000/api
VITE_WS_URL=ws://YOUR_IP:5000/ws/audio
```

**Example:**
```env
VITE_API_BASE_URL=http://192.168.0.125:5000/api
VITE_WS_URL=ws://192.168.0.125:5000/ws/audio
```

**Note:** The `vite.config.ts` proxy is only used when accessing via `localhost:8080`. When using IP address, the `.env` file takes precedence.

### 2. Backend Configuration (`ai-nexus/backend/`)

**Update `.env` file:**
```env
FRONTEND_URL=http://YOUR_IP:8080
LIVEKIT_URL=ws://YOUR_IP:7880
```

**Example:**
```env
FRONTEND_URL=http://192.168.0.125:8080
LIVEKIT_URL=ws://192.168.0.125:7880
```

### 3. Windows Firewall

Allow these ports:
- **5000** - Backend API
- **8080** - Frontend
- **7880** - LiveKit WebSocket
- **7881** - LiveKit TCP

### 4. Your IP Addresses

- **Wi-Fi:** `192.168.0.125` (use if both laptops on Wi-Fi)
- **Ethernet:** `172.16.49.18` (use if both laptops on Ethernet)

### 5. Candidate Laptop Access

Open browser and go to:
```
http://YOUR_IP:8080
```

Example: `http://192.168.0.125:8080`

---

## Quick Setup

Run the PowerShell script:
```powershell
cd arc-insight-lab
.\setup-network.ps1
```

Or follow `QUICK_NETWORK_SETUP.md` for step-by-step instructions.

