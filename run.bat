@echo off
echo ========================================================
echo   Starting FillSync Servers (Port 5000 + Port 5173)
echo ========================================================
cd "%~dp0fillsync"
node start-project.js
pause
