@echo off
echo 🚀 Starting Nyaya AI Services...

:: Install root dependencies (concurrently)
echo [1/4] Installing root tools...
call npm install

:: Start everything
echo [2/4] Starting services...
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo ML API:   http://localhost:5001

npm run dev
