#!/bin/bash

# Nyaya AI - Start All Services
# This script starts the backend, ML service, and frontend in separate terminal windows

echo "🚀 Starting Nyaya AI Services..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running on macOS or Linux
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo -e "${BLUE}Detected macOS${NC}"
    
    # Start Backend
    echo -e "${GREEN}Starting Backend (Port 5000)...${NC}"
    osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"'/backend && npm run dev"'
    
    # Wait a bit
    sleep 2
    
    # Start ML Service
    echo -e "${GREEN}Starting ML Service (Port 5001)...${NC}"
    osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"'/ml && python -m nyaya_ai.api_service"'
    
    # Wait a bit
    sleep 2
    
    # Start Frontend
    echo -e "${GREEN}Starting Frontend (Port 3000)...${NC}"
    osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"'/frontend && npm run dev"'
    
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    echo -e "${BLUE}Detected Linux${NC}"
    
    # Check if gnome-terminal is available
    if command -v gnome-terminal &> /dev/null; then
        # Start Backend
        echo -e "${GREEN}Starting Backend (Port 5000)...${NC}"
        gnome-terminal -- bash -c "cd $(pwd)/backend && npm run dev; exec bash"
        
        sleep 2
        
        # Start ML Service
        echo -e "${GREEN}Starting ML Service (Port 5001)...${NC}"
        gnome-terminal -- bash -c "cd $(pwd)/ml && python -m nyaya_ai.api_service; exec bash"
        
        sleep 2
        
        # Start Frontend
        echo -e "${GREEN}Starting Frontend (Port 3000)...${NC}"
        gnome-terminal -- bash -c "cd $(pwd)/frontend && npm run dev; exec bash"
    else
        echo -e "${YELLOW}gnome-terminal not found. Please start services manually:${NC}"
        echo "Terminal 1: cd backend && npm run dev"
        echo "Terminal 2: cd ml && python -m nyaya_ai.api_service"
        echo "Terminal 3: cd frontend && npm run dev"
    fi
else
    echo -e "${YELLOW}Unsupported OS. Please start services manually:${NC}"
    echo "Terminal 1: cd backend && npm run dev"
    echo "Terminal 2: cd ml && python -m nyaya_ai.api_service"
    echo "Terminal 3: cd frontend && npm run dev"
fi

echo ""
echo -e "${GREEN}✅ All services starting...${NC}"
echo ""
echo "Services will be available at:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend:  http://localhost:5000"
echo "  - ML API:   http://localhost:5001"
echo ""
echo "Check the individual terminal windows for logs."
