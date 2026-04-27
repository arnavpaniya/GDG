# Nyaya AI - Testing Guide

This guide helps you test the complete integration between frontend, backend, and ML service.

## Prerequisites

Make sure all services are running:

1. **Backend** on `http://localhost:5000`
2. **ML Service** on `http://localhost:5001`
3. **Frontend** on `http://localhost:3000`

## Quick Health Check

### 1. Test Backend Health

```bash
curl http://localhost:5000/api/v1/analyze/status
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "nodeBackend": {
      "status": "ok",
      "version": "v18.x.x"
    },
    "pythonService": {
      "status": "ok",
      "message": "Python ML service is healthy"
    }
  }
}
```

### 2. Test ML Service Health

```bash
curl http://localhost:5001/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "service": "Nyaya AI ML Service",
  "version": "1.0.0"
}
```

### 3. Test Frontend

Open browser: `http://localhost:3000`

You should see the Nyaya AI landing page.

## API Testing

### 1. List Available Datasets

```bash
curl http://localhost:5000/api/v1/analyze/datasets
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "datasets": [
      {
        "key": "biased",
        "label": "Biased Hiring Dataset",
        "description": "2,000 synthetic recruitment records with gender-based bias injected.",
        "rows": 2000,
        "biasLevel": "High"
      },
      {
        "key": "fair",
        "label": "Fair Hiring Dataset",
        "description": "2,000 synthetic recruitment records with equal selection rates.",
        "rows": 2000,
        "biasLevel": "Low"
      }
    ],
    "mitigationOptions": [
      {
        "key": "reweighting",
        "label": "Sample Reweighting",
        "description": "Assigns higher training weights to underrepresented group×class combinations."
      },
      {
        "key": "smote",
        "label": "SMOTE Oversampling",
        "description": "Generates synthetic minority-class samples to balance the dataset."
      }
    ]
  }
}
```

### 2. Upload CSV File

```bash
curl -X POST http://localhost:5000/api/v1/analyze/upload \
  -F "dataset=@backend/src/data/biased_dataset.csv"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "dataset": {
      "filename": "biased_dataset.csv",
      "rowCount": 2000,
      "headers": ["name", "gender", "education", "experience", "shortlisted"],
      "genderDist": { "Male": 1000, "Female": 1000 },
      "shortlistedDist": { "0": 1675, "1": 325 }
    },
    "bias": {
      "detected": true,
      "severity": "HIGH"
    },
    "fairness": {
      "groundTruth": {
        "fairnessScore": 30,
        "disparateImpact": 0.3015,
        "biasExists": true,
        "disadvantagedGroup": "Female",
        "privilegedGroup": "Male"
      }
    },
    "recommendations": [
      "Review selection criteria for gender neutrality",
      "Implement blind screening processes",
      "Apply bias mitigation techniques"
    ],
    "mlAvailable": false
  }
}
```

### 3. Run ML Analysis (Built-in Dataset)

```bash
curl -X POST http://localhost:5000/api/v1/analyze/ml \
  -H "Content-Type: application/json" \
  -d '{
    "dataset": "biased",
    "mitigation": "reweighting"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "dataset": "biased",
    "mitigation": "reweighting",
    "mlResult": {
      "before": {
        "fairness_score": 30,
        "disparate_impact": 0.3015,
        "bias_exists": true,
        "verdict": "🚨  HIGH BIAS",
        "selection_rates": {
          "Male": 0.325,
          "Female": 0.098
        },
        "disadvantaged": "Female",
        "privileged": "Male",
        "insights": [
          "Female candidates have a selection rate of 9.8% compared to 32.5% for Male candidates.",
          "This represents a significant disparity that violates the 80% rule."
        ]
      },
      "after": {
        "fairness_score": 78,
        "disparate_impact": 0.784,
        "bias_exists": true,
        "verdict": "⚠️  MODERATE RISK",
        "selection_rates": {
          "Male": 0.326,
          "Female": 0.256
        },
        "insights": [
          "Female candidates now have a selection rate of 25.6%, improved from 9.8%.",
          "The disparate impact ratio improved to 78.4%, approaching the 80% threshold."
        ]
      },
      "comparison": {
        "di_delta": 0.4825,
        "fs_delta": 48,
        "improved": true
      }
    },
    "recommendations": [
      "Continue monitoring selection rates",
      "Consider additional mitigation strategies",
      "Implement regular fairness audits"
    ]
  }
}
```

### 4. Run Built-in Analysis (GET)

```bash
curl "http://localhost:5000/api/v1/analyze/builtin?dataset=fair&mitigation=smote"
```

## Frontend Testing

### 1. Manual UI Testing

1. **Open Frontend:** `http://localhost:3000`

2. **Test File Upload:**
   - Click "Upload CSV" button
   - Select `backend/src/data/biased_dataset.csv`
   - Wait for analysis results
   - Verify fairness score is displayed
   - Check that bias findings are shown

3. **Test Chat Interface:**
   - Type a question: "How does bias detection work?"
   - Press Enter or click Send
   - Verify message appears in chat

4. **Test Authentication:**
   - Click "Sign In" button
   - Complete authentication flow
   - Verify user session is maintained

5. **Test Export Functions:**
   - After analysis, click "Export Report"
   - Try PDF, CSV, and JSON exports
   - Verify files download correctly

### 2. Browser Console Testing

Open browser console (F12) and run:

```javascript
// Test API service
const apiService = await import('/src/utils/apiService.js');

// Check service status
const status = await apiService.checkServiceStatus();
console.log('Service Status:', status);

// Get available datasets
const datasets = await apiService.getAvailableDatasets();
console.log('Available Datasets:', datasets);

// Run ML analysis
const mlResult = await apiService.runMLAnalysis({
  dataset: 'biased',
  mitigation: 'reweighting'
});
console.log('ML Result:', mlResult);
```

## Integration Testing

### Test Complete Flow

1. **Start all services**
2. **Upload CSV via frontend**
3. **Verify backend receives file**
4. **Check backend calls ML service**
5. **Verify ML service processes data**
6. **Check results return to frontend**
7. **Verify UI displays results correctly**

### Expected Log Output

**Backend Console:**
```
🚀  Nyaya AI Backend running on http://localhost:5000
   Environment : development

POST /api/v1/analyze/upload 200 1234ms
```

**ML Service Console:**
```
 * Running on http://localhost:5001
POST /analyze 200 2345ms
```

**Frontend Console:**
```
✅ Backend API analysis successful
Analysis complete: {type: 'upload', fairness: {...}}
```

## Error Testing

### 1. Test Backend Offline

1. Stop backend service
2. Upload file in frontend
3. **Expected:** Frontend falls back to client-side analysis
4. **Verify:** Warning message in console: "⚠️ Backend API unavailable, falling back to client-side analysis"

### 2. Test ML Service Offline

1. Stop ML service
2. Keep backend running
3. Try ML analysis via backend
4. **Expected:** Backend returns error
5. **Verify:** Error message indicates ML service unavailable

### 3. Test Invalid File Upload

1. Upload non-CSV file
2. **Expected:** Error message
3. **Verify:** "Invalid file format" or similar

### 4. Test Invalid Dataset Name

```bash
curl -X POST http://localhost:5000/api/v1/analyze/ml \
  -H "Content-Type: application/json" \
  -d '{"dataset": "invalid", "mitigation": "reweighting"}'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid dataset 'invalid'. Valid options: biased, fair"
}
```

## Performance Testing

### 1. Test Upload Speed

```bash
time curl -X POST http://localhost:5000/api/v1/analyze/upload \
  -F "dataset=@backend/src/data/biased_dataset.csv"
```

**Expected:** < 2 seconds

### 2. Test ML Analysis Speed

```bash
time curl -X POST http://localhost:5000/api/v1/analyze/ml \
  -H "Content-Type: application/json" \
  -d '{"dataset": "biased", "mitigation": "reweighting"}'
```

**Expected:** < 5 seconds

## Automated Testing Script

Create a test script `test-integration.sh`:

```bash
#!/bin/bash

echo "🧪 Testing Nyaya AI Integration..."

# Test 1: Backend Health
echo "1. Testing Backend Health..."
curl -s http://localhost:5000/api/v1/analyze/status | grep -q "ok" && echo "✅ Backend OK" || echo "❌ Backend Failed"

# Test 2: ML Service Health
echo "2. Testing ML Service Health..."
curl -s http://localhost:5001/health | grep -q "ok" && echo "✅ ML Service OK" || echo "❌ ML Service Failed"

# Test 3: List Datasets
echo "3. Testing List Datasets..."
curl -s http://localhost:5000/api/v1/analyze/datasets | grep -q "biased" && echo "✅ Datasets OK" || echo "❌ Datasets Failed"

# Test 4: Upload Analysis
echo "4. Testing File Upload..."
curl -s -X POST http://localhost:5000/api/v1/analyze/upload \
  -F "dataset=@backend/src/data/biased_dataset.csv" | grep -q "success" && echo "✅ Upload OK" || echo "❌ Upload Failed"

# Test 5: ML Analysis
echo "5. Testing ML Analysis..."
curl -s -X POST http://localhost:5000/api/v1/analyze/ml \
  -H "Content-Type: application/json" \
  -d '{"dataset": "biased", "mitigation": "reweighting"}' | grep -q "mlResult" && echo "✅ ML Analysis OK" || echo "❌ ML Analysis Failed"

echo ""
echo "🎉 Integration tests complete!"
```

Run with:
```bash
chmod +x test-integration.sh
./test-integration.sh
```

## Troubleshooting

### Issue: "ECONNREFUSED localhost:5001"

**Cause:** ML service not running

**Solution:**
```bash
cd ml
python -m nyaya_ai.api_service
```

### Issue: "CORS error"

**Cause:** Frontend URL not in ALLOWED_ORIGINS

**Solution:** Update `backend/.env`:
```env
ALLOWED_ORIGINS=http://localhost:3000
```

### Issue: "Module not found"

**Cause:** Dependencies not installed

**Solution:**
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install

# ML
cd ml && pip install -r requirements.txt
```

## Success Criteria

✅ All services start without errors  
✅ Health checks return "ok" status  
✅ File upload works via frontend  
✅ Backend processes CSV correctly  
✅ ML service returns analysis results  
✅ Frontend displays results in chat  
✅ Export functions work (PDF, CSV, JSON)  
✅ Fallback mechanism works when backend offline  
✅ Error messages are clear and helpful  

## Next Steps

After successful testing:

1. ✅ Verify all integration points
2. ✅ Test error scenarios
3. ✅ Check performance metrics
4. 🔄 Deploy to staging environment
5. 🔄 Run load tests
6. 🔄 Deploy to production
