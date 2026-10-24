@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Please install Node.js 20 or newer, then open this file again.
  pause
  exit /b 1
)
echo Starting Pitstop at http://127.0.0.1:3000
echo Keep this window open. Press Ctrl+C to stop.
node server.mjs
pause
