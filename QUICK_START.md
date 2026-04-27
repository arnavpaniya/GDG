# Nyaya AI - Quick Start Guide

Get up and running in 5 minutes! 🚀

## Prerequisites

- **Node.js** v18+ and npm
- **Python** 3.8+ and pip
- **Git**

## Installation

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd nyaya-ai
```

### 2. Install All Dependencies

```bash
# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..

# ML Service
cd ml && pip install -r requirements.txt && cd ..
```

Or use the convenience script:
```bash
npm run install:all
```

## Running the Application

### Start All Services

Open **3 separate terminal windows**:

#### Terminal 1: Backend
```bash
cd backend
npm run dev
```
✅ Backend running on: **http://localhost:5000**

#### Terminal 2: ML Service
```bash
cd ml
python -m nyaya_ai.api_service
```
✅ ML Service running on: **http://localhost:5001**

#### Terminal 3: Frontend
```bash
cd frontend
npm run dev
```
✅ Frontend running on: **http://localhost:3000**

### Verify Services

```bash
# Check backend
curl http://localhost:5000/api/v1/analyze/status

# Check ML service
curl http://localhost:5001/health

# Open frontend
open http://localhost:3000
```

## First Test

1. **Open browser:** http://localhost:3000
2. **Click "Upload CSV"**
3. **Select file:** `backend/src/data/biased_dataset.csv`
4. **Wait for analysis** (2-5 seconds)
5. **View results** in chat interface

## API Quick Reference

### Backend Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/analyze/status` | GET | Health check |
| `/api/v1/analyze/datasets` | GET | List datasets |
| `/api/v1/analyze/upload` | POST | Upload CSV |
| `/api/v1/analyze/ml` | POST | Run ML analysis |
| `/api/v1/analyze/builtin` | GET | Analyze built-in dataset |

### Example: Upload CSV

```bash
curl -X POST http://localhost:5000/api/v1/analyze/upload \
  -F "dataset=@backend/src/data/biased_dataset.csv"
```

### Example: Run ML Analysis

```bash
curl -X POST http://localhost:5000/api/v1/analyze/ml \
  -H "Content-Type: application/json" \
  -d '{"dataset": "biased", "mitigation": "reweighting"}'
```

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
ALLOWED_ORIGINS=http://localhost:3000
```

## Common Issues

### Issue: Port Already in Use

**Solution:** Kill the process using the port
```bash
# macOS/Linux
lsof -ti:5000 | xargs kill -9  # Backend
lsof -ti:5001 | xargs kill -9  # ML Service
lsof -ti:3000 | xargs kill -9  # Frontend
```

### Issue: Python Module Not Found

**Solution:** Install requirements
```bash
cd ml
pip install -r requirements.txt
```

### Issue: CORS Error

**Solution:** Check `ALLOWED_ORIGINS` in `backend/.env`
```env
ALLOWED_ORIGINS=http://localhost:3000
```

### Issue: Backend Can't Connect to ML Service

**Solution:** Make sure ML service is running
```bash
cd ml
python -m nyaya_ai.api_service
```

## Project Structure

```
nyaya-ai/
├── frontend/          # Next.js React app (Port 3000)
│   ├── src/
│   │   ├── app/       # Pages
│   │   ├── components/# React components
│   │   └── utils/     # API service, helpers
│   └── package.json
│
├── backend/           # Node.js Express API (Port 5000)
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   └── data/      # Sample datasets
│   └── package.json
│
├── ml/                # Python Flask ML service (Port 5001)
│   ├── nyaya_ai/
│   │   ├── pipeline.py
│   │   ├── model.py
│   │   ├── fairness.py
│   │   └── api_service.py
│   └── requirements.txt
│
└── README.md
```

## Development Workflow

1. **Make changes** to code
2. **Services auto-reload** (hot reload enabled)
3. **Test in browser** at http://localhost:3000
4. **Check logs** in terminal windows
5. **Commit changes** to git

## Testing

### Quick Health Check
```bash
# Test all services
npm run test:backend
npm run test:ml
```

### Full Integration Test
```bash
# Upload test file
curl -X POST http://localhost:5000/api/v1/analyze/upload \
  -F "dataset=@backend/src/data/biased_dataset.csv"

# Run ML analysis
curl -X POST http://localhost:5000/api/v1/analyze/ml \
  -H "Content-Type: application/json" \
  -d '{"dataset": "biased", "mitigation": "reweighting"}'
```

## Next Steps

- ✅ Services running
- ✅ Test file upload
- ✅ View analysis results
- 📖 Read [Integration Guide](./INTEGRATION_GUIDE.md)
- 🧪 Read [Testing Guide](./TESTING_GUIDE.md)
- 🎨 Read [Design System](./DESIGN_SKILL.md)

## Need Help?

1. Check the logs in each terminal window
2. Verify all services are running
3. Check environment variables
4. Review [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
5. Review [TESTING_GUIDE.md](./TESTING_GUIDE.md)

## Useful Commands

```bash
# Install all dependencies
npm run install:all

# Start services (separate terminals)
npm run start:backend
npm run start:ml
npm run start:frontend

# Test services
npm run test:backend
npm run test:ml

# View logs
# Check terminal windows where services are running
```

## Success Checklist

- [ ] All dependencies installed
- [ ] Backend running on port 5000
- [ ] ML service running on port 5001
- [ ] Frontend running on port 3000
- [ ] Health checks pass
- [ ] File upload works
- [ ] Analysis results display
- [ ] No errors in console

🎉 **You're ready to go!** Open http://localhost:3000 and start analyzing datasets for bias.
