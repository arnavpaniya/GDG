# Nyaya AI - System Architecture

## Overview

Nyaya AI is a three-tier application designed to detect and mitigate bias in AI systems and datasets.

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                     http://localhost:3000                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP/REST
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      FRONTEND LAYER                             │
│                    Next.js + React                              │
├─────────────────────────────────────────────────────────────────┤
│  Components:                                                    │
│  • ChatWindow.jsx        - Main chat interface                 │
│  • ChatInput.jsx         - File upload + text input            │
│  • MLAnalysisCard.jsx    - ML results display                  │
│  • FairnessScore3D.jsx   - 3D visualization                    │
│                                                                 │
│  Services:                                                      │
│  • apiService.js         - Backend API client                  │
│  • fileAnalysis.js       - Client-side fallback                │
│  • biasEngine.js         - JS bias detection                   │
│                                                                 │
│  State Management:                                              │
│  • Zustand store         - Global state                        │
│  • Firebase Auth         - User authentication                 │
│  • Firestore             - Chat history                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            │ POST /api/v1/analyze/upload
                            │ POST /api/v1/analyze/ml
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                      BACKEND LAYER                              │
│                  Node.js + Express                              │
│                  http://localhost:5000                          │
├─────────────────────────────────────────────────────────────────┤
│  Routes:                                                        │
│  • /api/v1/analyze/status    - Health check                    │
│  • /api/v1/analyze/datasets  - List datasets                   │
│  • /api/v1/analyze/upload    - Upload CSV                      │
│  • /api/v1/analyze/ml        - Run ML pipeline                 │
│  • /api/v1/analyze/builtin   - Built-in datasets               │
│                                                                 │
│  Controllers:                                                   │
│  • analysisController.js     - Request handlers                │
│                                                                 │
│  Services:                                                      │
│  • dataService.js            - CSV parsing                     │
│  • biasService.js            - JS bias detection               │
│  • fairnessService.js        - Fairness metrics                │
│  • modelService.js           - ML service client               │
│  • recommendationService.js  - Generate recommendations        │
│                                                                 │
│  Middleware:                                                    │
│  • uploadMiddleware.js       - Multer file upload              │
│  • CORS                      - Cross-origin requests           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            │ POST /analyze
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                       ML SERVICE LAYER                          │
│                    Python + Flask                               │
│                  http://localhost:5001                          │
├─────────────────────────────────────────────────────────────────┤
│  API:                                                           │
│  • /health               - Health check                        │
│  • /analyze              - Run ML pipeline                     │
│                                                                 │
│  Pipeline Modules:                                              │
│  • preprocessing.py      - Data cleaning & encoding            │
│  • model.py              - Logistic Regression training        │
│  • fairness.py           - Bias metrics calculation            │
│  • mitigation.py         - SMOTE & Reweighting                 │
│  • explainer.py          - Plain-English insights              │
│  • visualizer.py         - Chart generation                    │
│                                                                 │
│  ML Models:                                                     │
│  • Logistic Regression   - Binary classification               │
│  • StandardScaler        - Feature normalization               │
│                                                                 │
│  Techniques:                                                    │
│  • SMOTE                 - Synthetic oversampling              │
│  • Reweighting           - Sample weight adjustment            │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. File Upload Flow

```
User selects CSV file
        ↓
Frontend: ChatInput.jsx
        ↓
Frontend: apiService.uploadAndAnalyze(file)
        ↓
Backend: POST /api/v1/analyze/upload
        ↓
Backend: analysisController.uploadAndAnalyze()
        ↓
Backend: dataService.loadDataset()
        ↓
Backend: biasService.detectBias()
        ↓
Backend: fairnessService.buildFairnessReport()
        ↓
Backend: Returns JSON response
        ↓
Frontend: formatAnalysisForChat()
        ↓
Frontend: Display in ChatWindow
```

### 2. ML Analysis Flow

```
User uploads file or selects built-in dataset
        ↓
Frontend: apiService.runMLAnalysis()
        ↓
Backend: POST /api/v1/analyze/ml
        ↓
Backend: analysisController.runMLAnalysis()
        ↓
Backend: modelService.runFullPipeline()
        ↓
ML Service: POST /analyze
        ↓
ML Service: preprocessing.load_and_preprocess()
        ↓
ML Service: model.train_model() [BEFORE]
        ↓
ML Service: fairness.evaluate_fairness() [BEFORE]
        ↓
ML Service: mitigation.apply_mitigation()
        ↓
ML Service: model.train_model() [AFTER]
        ↓
ML Service: fairness.evaluate_fairness() [AFTER]
        ↓
ML Service: explainer.generate_insights()
        ↓
ML Service: Returns JSON with before/after metrics
        ↓
Backend: fairnessService.buildMitigationReport()
        ↓
Backend: recommendationService.generateRecommendations()
        ↓
Backend: Returns formatted response
        ↓
Frontend: formatAnalysisForChat()
        ↓
Frontend: Display MLAnalysisCard in chat
```

### 3. Fallback Flow (Backend Offline)

```
User uploads file
        ↓
Frontend: apiService.uploadAndAnalyze(file)
        ↓
[Network Error - Backend Offline]
        ↓
Frontend: Catch error
        ↓
Frontend: fileAnalysis.analyzeCSV(file)
        ↓
Frontend: Client-side bias detection
        ↓
Frontend: Display results with "client" source tag
```

## Technology Stack

### Frontend
- **Framework:** Next.js 16.2.4 (React 19.2.4)
- **Styling:** Tailwind CSS 4
- **3D Graphics:** Three.js + React Three Fiber
- **Charts:** Recharts
- **State:** Zustand
- **Auth:** Firebase Authentication
- **Database:** Firestore
- **CSV Parsing:** PapaParse
- **Export:** jsPDF, html2canvas

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Middleware:** CORS, Morgan, Multer
- **CSV Parsing:** csv-parse
- **HTTP Client:** Axios

### ML Service
- **Language:** Python 3.8+
- **Framework:** Flask
- **ML Library:** scikit-learn
- **Data Processing:** pandas, numpy
- **Bias Mitigation:** imbalanced-learn (SMOTE)
- **Visualization:** matplotlib

## API Contracts

### Backend → Frontend

**Upload Response:**
```json
{
  "success": true,
  "data": {
    "dataset": {
      "filename": "string",
      "rowCount": number,
      "headers": ["string"]
    },
    "fairness": {
      "groundTruth": {
        "fairnessScore": number,
        "disparateImpact": number,
        "biasExists": boolean,
        "disadvantagedGroup": "string",
        "privilegedGroup": "string"
      }
    },
    "recommendations": ["string"],
    "mlAvailable": boolean
  }
}
```

**ML Analysis Response:**
```json
{
  "success": true,
  "data": {
    "dataset": "string",
    "mitigation": "string",
    "mlResult": {
      "before": {
        "fairness_score": number,
        "disparate_impact": number,
        "bias_exists": boolean,
        "verdict": "string",
        "selection_rates": {},
        "insights": ["string"]
      },
      "after": {
        "fairness_score": number,
        "disparate_impact": number,
        "bias_exists": boolean,
        "verdict": "string",
        "selection_rates": {},
        "insights": ["string"]
      },
      "comparison": {
        "di_delta": number,
        "fs_delta": number,
        "improved": boolean
      }
    },
    "recommendations": ["string"]
  }
}
```

### Backend → ML Service

**Request:**
```json
{
  "dataset": "biased" | "fair",
  "mitigation": "reweighting" | "smote"
}
```

**Response:**
```json
{
  "dataset": "string",
  "mitigation": "string",
  "before": { /* fairness metrics */ },
  "after": { /* fairness metrics */ },
  "comparison": { /* improvement metrics */ }
}
```

## Security Considerations

### Frontend
- ✅ Firebase Authentication for user sessions
- ✅ Environment variables for API URLs
- ✅ Client-side input validation
- ✅ Secure file upload (size limits)

### Backend
- ✅ CORS configuration
- ✅ File size limits (10MB)
- ✅ Input validation
- ✅ Error handling
- ⚠️ TODO: Rate limiting
- ⚠️ TODO: API authentication

### ML Service
- ✅ Input validation
- ✅ Error handling
- ⚠️ TODO: Authentication
- ⚠️ TODO: Request throttling

## Scalability Considerations

### Current Architecture (Development)
- Single instance per service
- In-memory processing
- No caching
- Synchronous ML processing

### Production Recommendations
- **Load Balancing:** Multiple backend instances behind load balancer
- **Caching:** Redis for frequently accessed datasets
- **Queue System:** RabbitMQ/Celery for async ML processing
- **Database:** PostgreSQL for persistent storage
- **CDN:** CloudFront for static assets
- **Monitoring:** Prometheus + Grafana
- **Logging:** ELK stack

## Deployment Architecture

### Development
```
localhost:3000 (Frontend)
localhost:5000 (Backend)
localhost:5001 (ML Service)
```

### Production (Recommended)
```
https://app.nyaya.ai (Frontend - Vercel/Netlify)
        ↓
https://api.nyaya.ai (Backend - AWS/GCP/Heroku)
        ↓
http://ml-service:5001 (ML Service - Internal network)
```

## Performance Metrics

### Target Response Times
- Health check: < 100ms
- File upload: < 2s
- JS-based analysis: < 2s
- ML analysis: < 5s
- Export PDF: < 3s

### Resource Usage
- Frontend: ~50MB RAM
- Backend: ~100MB RAM
- ML Service: ~500MB RAM (with model loaded)

## Error Handling

### Frontend
- Network errors → Fallback to client-side analysis
- Invalid file → User-friendly error message
- Backend timeout → Retry with exponential backoff

### Backend
- ML service down → Return JS-based analysis only
- Invalid CSV → Detailed error message
- File too large → 413 Payload Too Large

### ML Service
- Invalid dataset → 400 Bad Request
- Processing error → 500 with error details
- Timeout → 504 Gateway Timeout

## Monitoring & Logging

### Frontend
- Console logs for debugging
- Error tracking (TODO: Sentry)
- Analytics (TODO: Google Analytics)

### Backend
- Morgan HTTP logging
- Console error logs
- TODO: Winston structured logging

### ML Service
- Flask request logging
- Python logging module
- TODO: Structured JSON logs

## Future Enhancements

### Phase 1 (Current)
- ✅ Basic file upload
- ✅ JS-based bias detection
- ✅ ML pipeline integration
- ✅ Chat interface

### Phase 2 (Next)
- 🔄 Real-time progress updates
- 🔄 Batch analysis
- 🔄 Model comparison
- 🔄 Advanced visualizations

### Phase 3 (Future)
- 📋 API authentication
- 📋 User dashboard
- 📋 Team collaboration
- 📋 Scheduled audits
- 📋 Webhook notifications

## Development Guidelines

### Code Organization
- **Frontend:** Feature-based components
- **Backend:** Service-oriented architecture
- **ML Service:** Pipeline-based modules

### Testing Strategy
- **Frontend:** Jest + React Testing Library
- **Backend:** Jest + Supertest
- **ML Service:** pytest + unittest

### Version Control
- **Branching:** GitFlow
- **Commits:** Conventional Commits
- **PRs:** Required reviews

## Documentation

- **[README.md](./README.md)** - Project overview
- **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup
- **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** - Detailed integration
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Testing procedures
- **[DESIGN_SKILL.md](./DESIGN_SKILL.md)** - Design system
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - This document
