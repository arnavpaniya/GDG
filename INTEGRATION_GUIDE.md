# Nyaya AI - Frontend-Backend-ML Integration Guide

This guide explains how the frontend, backend, and ML model are connected and how to run the complete system.

## Architecture Overview

```
┌─────────────────┐
│   Frontend      │  Next.js (Port 3000)
│   (React)       │  - User interface
└────────┬────────┘  - File upload
         │           - Analysis display
         │
         ▼
┌─────────────────┐
│   Backend       │  Node.js/Express (Port 5000)
│   (API)         │  - CSV parsing
└────────┬────────┘  - JS-based bias detection
         │           - API routing
         │
         ▼
┌─────────────────┐
│   ML Service    │  Python/Flask (Port 5001)
│   (AI Model)    │  - Logistic Regression
└─────────────────┘  - Fairness metrics
                     - Bias mitigation (SMOTE/Reweighting)
```

## Data Flow

1. **User uploads CSV** → Frontend
2. **Frontend sends file** → Backend API (`/api/v1/analyze/upload`)
3. **Backend processes CSV** → Returns instant JS-based analysis
4. **Backend calls ML service** → Python Flask API (`/analyze`)
5. **ML service returns results** → Backend formats response
6. **Backend sends to frontend** → Display in chat interface

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file (already exists):
```env
PORT=5000
NODE_ENV=development
PYTHON_SERVICE_URL=http://localhost:5001
MAX_FILE_SIZE_MB=10
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

Start backend:
```bash
npm run dev
```

Backend will run on: `http://localhost:5000`

### 2. ML Service Setup

```bash
cd ml
pip install -r requirements.txt
```

Start ML service:
```bash
python -m nyaya_ai.api_service
```

ML service will run on: `http://localhost:5001`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` file (already created):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_API_BASE_PATH=/api/v1
```

Start frontend:
```bash
npm run dev
```

Frontend will run on: `http://localhost:3000`

## API Endpoints

### Backend API (Port 5000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/analyze/status` | Check service health |
| GET | `/api/v1/analyze/datasets` | List available datasets |
| GET | `/api/v1/analyze/builtin` | Run ML on built-in dataset |
| POST | `/api/v1/analyze/upload` | Upload CSV for analysis |
| POST | `/api/v1/analyze/ml` | Run full ML pipeline |

### ML Service API (Port 5001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Check ML service health |
| POST | `/analyze` | Run ML analysis pipeline |

## Frontend Integration

### API Service (`frontend/src/utils/apiService.js`)

The frontend uses a centralized API service to communicate with the backend:

```javascript
import { uploadAndAnalyze, formatAnalysisForChat, generateAnalysisSummary } from '@/utils/apiService';

// Upload and analyze CSV
const apiResponse = await uploadAndAnalyze(file);
const results = formatAnalysisForChat(apiResponse);
const summary = generateAnalysisSummary(results);
```

### Fallback Mechanism

The frontend includes a fallback to client-side analysis if the backend is unavailable:

```javascript
try {
  // Try backend API first
  const apiResponse = await uploadAndAnalyze(file);
  results = formatAnalysisForChat(apiResponse);
} catch (apiError) {
  // Fallback to client-side analysis
  results = await analyzeCSV(file);
}
```

## Testing the Integration

### 1. Check Service Health

```bash
# Backend health
curl http://localhost:5000/api/v1/analyze/status

# ML service health
curl http://localhost:5001/health
```

### 2. Test File Upload

```bash
curl -X POST http://localhost:5000/api/v1/analyze/upload \
  -F "dataset=@backend/src/data/biased_dataset.csv"
```

### 3. Test ML Analysis

```bash
curl -X POST http://localhost:5000/api/v1/analyze/ml \
  -H "Content-Type: application/json" \
  -d '{"dataset": "biased", "mitigation": "reweighting"}'
```

### 4. Test Built-in Dataset

```bash
curl "http://localhost:5000/api/v1/analyze/builtin?dataset=biased&mitigation=reweighting"
```

## Frontend Components

### Analysis Display Components

1. **MLAnalysisCard** (`frontend/src/components/analysis/MLAnalysisCard.jsx`)
   - Displays ML pipeline results
   - Shows before/after comparison
   - Visualizes improvement metrics

2. **FairnessScore3D** (`frontend/src/components/analysis/FairnessScore3D.jsx`)
   - 3D visualization of fairness score
   - Interactive Three.js component

3. **BiasExplanationCard** (`frontend/src/components/analysis/BiasExplanationCard.jsx`)
   - Explains detected bias
   - Shows severity levels

### Chat Integration

The chat interface (`frontend/src/app/(dashboard)/app/page.js`) handles:
- File uploads
- API communication
- Result display
- Error handling with fallback

## Environment Variables

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_API_BASE_PATH=/api/v1
```

### Backend (`.env`)
```env
PORT=5000
NODE_ENV=development
PYTHON_SERVICE_URL=http://localhost:5001
MAX_FILE_SIZE_MB=10
ALLOWED_ORIGINS=http://localhost:3000
```

## Troubleshooting

### Backend not connecting to ML service

**Error:** `ECONNREFUSED localhost:5001`

**Solution:** Make sure the Python ML service is running:
```bash
cd ml
python -m nyaya_ai.api_service
```

### Frontend not connecting to backend

**Error:** `Network error occurred`

**Solution:** 
1. Check backend is running on port 5000
2. Verify CORS settings in `backend/src/app.js`
3. Check `.env.local` has correct API URL

### CORS errors

**Solution:** Add your frontend URL to `ALLOWED_ORIGINS` in `backend/.env`:
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Production Deployment

### Environment Variables for Production

**Frontend:**
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_API_BASE_PATH=/api/v1
```

**Backend:**
```env
PORT=5000
NODE_ENV=production
PYTHON_SERVICE_URL=http://ml-service:5001
ALLOWED_ORIGINS=https://yourdomain.com
```

### Docker Deployment (Optional)

You can containerize each service:

1. Frontend: Next.js Docker container
2. Backend: Node.js Docker container
3. ML Service: Python Docker container

Use Docker Compose to orchestrate all services.

## Quick Start Script

Run all services at once (requires 3 terminal windows):

**Terminal 1 - Backend:**
```bash
cd backend && npm run dev
```

**Terminal 2 - ML Service:**
```bash
cd ml && python -m nyaya_ai.api_service
```

**Terminal 3 - Frontend:**
```bash
cd frontend && npm run dev
```

Then open: `http://localhost:3000`

## Features

✅ **File Upload Analysis** - Upload CSV files for instant bias detection  
✅ **ML Pipeline Integration** - Full Python ML analysis with mitigation  
✅ **Before/After Comparison** - Visual comparison of bias metrics  
✅ **Fallback Mechanism** - Client-side analysis if backend unavailable  
✅ **Real-time Chat Interface** - Interactive analysis results  
✅ **Export Functionality** - Export reports as PDF, CSV, or JSON  
✅ **Multi-language Support** - i18n for multiple languages  
✅ **Firebase Authentication** - Secure user sessions  

## Next Steps

1. ✅ Frontend connected to backend API
2. ✅ Backend connected to ML service
3. ✅ Analysis results displayed in chat
4. ✅ Fallback mechanism implemented
5. 🔄 Add real-time progress updates
6. 🔄 Implement batch analysis
7. 🔄 Add model training interface
8. 🔄 Deploy to production

## Support

For issues or questions:
- Check the logs in each service
- Verify all services are running
- Check environment variables
- Review CORS settings
