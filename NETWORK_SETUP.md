# Network Setup Guide for Multi-Device Access

This guide will help you configure the application so that a candidate on another laptop can connect to your development server.

## Step 1: Find Your Local IP Address

### On Windows:
```powershell
ipconfig
```
Look for your active network adapter (usually "Wi-Fi" or "Ethernet") and note the **IPv4 Address**.

### On Mac/Linux:
```bash
ifconfig
# or
ip addr show
```

**Your IP addresses found:**
- Ethernet: `172.16.49.18`
- Wi-Fi: `192.168.0.125`
- Local Area Connection* 10: `192.168.137.1`

**Choose the IP address of the network interface that both laptops are connected to:**
- If both are on Wi-Fi → Use `192.168.0.125`
- If both are on Ethernet → Use `172.16.49.18`
- If using mobile hotspot → Use the hotspot adapter IP

## Step 2: Configure Frontend (arc-insight-lab)

1. **Create `.env` file** in `arc-insight-lab/` directory:
   ```env
   VITE_API_BASE_URL=http://YOUR_IP:5000/api
   VITE_WS_URL=ws://YOUR_IP:5000/ws/audio
   ```

   **Example (if using Wi-Fi IP):**
   ```env
   VITE_API_BASE_URL=http://192.168.0.125:5000/api
   VITE_WS_URL=ws://192.168.0.125:5000/ws/audio
   ```

2. **Update `vite.config.ts`** - Change the proxy target:
   ```typescript
   proxy: {
     '/api': {
       target: 'http://YOUR_IP:5000',  // Change localhost to your IP
       changeOrigin: true,
       secure: false,
     },
   },
   ```

## Step 3: Configure Backend (ai-nexus/backend)

1. **Update `backend/.env`** file:
   ```env
   # Add or update these:
   FRONTEND_URL=http://YOUR_IP:8080
   LIVEKIT_URL=ws://YOUR_IP:7880
   ```

   **Example:**
   ```env
   FRONTEND_URL=http://192.168.0.125:8080
   LIVEKIT_URL=ws://192.168.0.125:7880
   ```

2. **Update `backend/src/server.js`** - Add your IP to CORS allowed origins:
   ```javascript
   const allowedOrigins = [
     process.env.FRONTEND_URL || 'http://localhost:3000',
     'http://localhost:3000',
     'http://localhost:8080',
     'http://YOUR_IP:8080',  // Add this line
     'http://YOUR_IP:3000',  // Add this line (if needed)
   ];
   ```

## Step 4: Configure LiveKit Server

1. **Update LiveKit server configuration** (usually in `livekit.yaml` or environment):
   ```yaml
   rtc:
     tcp_port: 7881
     port_range_start: 50000
     port_range_end: 60000
   ```

2. **Make sure LiveKit server binds to all interfaces** (0.0.0.0) not just localhost.

## Step 5: Firewall Configuration

### Windows Firewall:
1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Next
5. Add these ports:
   - **5000** (Backend API)
   - **8080** (Frontend)
   - **7880** (LiveKit WebSocket)
   - **7881** (LiveKit TCP)
   - **50000-60000** (LiveKit RTC ports - you may need to allow a range)
6. Allow the connection for "Private" networks

### Quick PowerShell command (Run as Administrator):
```powershell
New-NetFirewallRule -DisplayName "Interview App Backend" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Interview App Frontend" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "LiveKit WebSocket" -Direction Inbound -LocalPort 7880 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "LiveKit TCP" -Direction Inbound -LocalPort 7881 -Protocol TCP -Action Allow
```

## Step 6: Start the Servers

1. **Start Backend:**
   ```bash
   cd ai-nexus/backend
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd arc-insight-lab
   npm start
   ```

3. **Start LiveKit** (if running separately):
   ```bash
   livekit-server --dev
   ```

## Step 7: Connect from Candidate Laptop

On the candidate's laptop, open a browser and navigate to:
```
http://YOUR_IP:8080
```

**Example:**
```
http://192.168.0.125:8080
```

## Troubleshooting

### Connection Refused:
- ✅ Check firewall rules are added
- ✅ Verify both laptops are on the same network
- ✅ Confirm the IP address is correct
- ✅ Make sure servers are running

### CORS Errors:
- ✅ Update `backend/src/server.js` CORS configuration
- ✅ Check `FRONTEND_URL` in backend `.env`

### LiveKit Connection Issues:
- ✅ Verify `LIVEKIT_URL` in backend `.env` uses your IP
- ✅ Check LiveKit server is accessible from network
- ✅ Ensure LiveKit RTC ports (50000-60000) are open

### Can't Find IP Address:
- Make sure both devices are on the same Wi-Fi network
- Try pinging from candidate laptop: `ping YOUR_IP`
- Check network adapter status in Windows Network Settings

## Quick Checklist

- [ ] Found your local IP address
- [ ] Created `.env` file in `arc-insight-lab/` with correct IP
- [ ] Updated `vite.config.ts` proxy target
- [ ] Updated `backend/.env` with FRONTEND_URL and LIVEKIT_URL
- [ ] Updated `backend/src/server.js` CORS origins
- [ ] Configured Windows Firewall for ports 5000, 8080, 7880, 7881
- [ ] Started backend server
- [ ] Started frontend server
- [ ] Tested connection from candidate laptop: `http://YOUR_IP:8080`

## Notes

- **Development IP**: The IP address may change if you disconnect/reconnect to Wi-Fi
- **Production**: For production, use a static IP or domain name
- **Security**: This setup is for development only. For production, use proper authentication and HTTPS

