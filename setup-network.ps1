# Network Setup Script for Multi-Device Access
# This script helps configure the app for network access

Write-Host "=== Network Setup for Interview App ===" -ForegroundColor Cyan
Write-Host ""

# Get local IP addresses
Write-Host "Finding your local IP addresses..." -ForegroundColor Yellow
$ipAddresses = Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    $_.IPAddress -notlike "127.*" -and 
    $_.IPAddress -notlike "169.254.*" -and
    $_.IPAddress -notlike "192.168.137.*"
} | Select-Object IPAddress, InterfaceAlias

Write-Host ""
Write-Host "Available IP addresses:" -ForegroundColor Green
$index = 1
$ipList = @()
foreach ($ip in $ipAddresses) {
    Write-Host "$index. $($ip.IPAddress) - $($ip.InterfaceAlias)" -ForegroundColor White
    $ipList += $ip
    $index++
}

Write-Host ""
$selected = Read-Host "Select IP address number (usually Wi-Fi or Ethernet)"

if ($selected -match '^\d+$' -and [int]$selected -ge 1 -and [int]$selected -le $ipList.Count) {
    $selectedIP = $ipList[[int]$selected - 1].IPAddress
    Write-Host ""
    Write-Host "Selected IP: $selectedIP" -ForegroundColor Green
    
    # Create .env file
    Write-Host ""
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    $envContent = @"
# API Configuration
VITE_API_BASE_URL=http://$selectedIP:5000/api
VITE_WS_URL=ws://$selectedIP:5000/ws/audio
"@
    
    $envContent | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "✅ Created .env file" -ForegroundColor Green
    
    # Update vite.config.ts
    Write-Host ""
    Write-Host "Updating vite.config.ts..." -ForegroundColor Yellow
    $viteConfig = Get-Content "vite.config.ts" -Raw
    $viteConfig = $viteConfig -replace "target: 'http://localhost:5000'", "target: 'http://$selectedIP:5000'"
    $viteConfig | Out-File -FilePath "vite.config.ts" -Encoding utf8 -NoNewline
    Write-Host "✅ Updated vite.config.ts" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "=== Setup Complete ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Update backend/.env with:" -ForegroundColor White
    Write-Host "   FRONTEND_URL=http://$selectedIP:8080" -ForegroundColor Gray
    Write-Host "   LIVEKIT_URL=ws://$selectedIP:7880" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Update backend/src/server.js CORS to include:" -ForegroundColor White
    Write-Host "   'http://$selectedIP:8080'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Configure Windows Firewall (run as Administrator):" -ForegroundColor White
    Write-Host "   See NETWORK_SETUP.md for details" -ForegroundColor Gray
    Write-Host ""
    Write-Host "4. Candidate laptop should access:" -ForegroundColor White
    Write-Host "   http://$selectedIP:8080" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "Invalid selection" -ForegroundColor Red
}

