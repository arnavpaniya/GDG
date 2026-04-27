# Nyaya AI - Data Flow Diagram

## Complete Request-Response Flow

### Scenario 1: User Uploads CSV File

```
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 1: User Action                                                 │
└─────────────────────────────────────────────────────────────────────┘

User clicks "Upload CSV" button
User selects file: biased_dataset.csv (2000 rows)

        ↓

┌─────────────────────────────────────────────────────────────────────┐
│ STEP 2: Frontend Processing                                         │
│ File: frontend/src/app/(dashboard)/app/page.js                     │
└─────────────────────────────────────────────────────────────────────┘

handleFileUpload(file) triggered
        ↓
Try backend API first:
  uploadAndAnalyze(file)
        ↓
File: frontend/src/utils/apiService.js
  - Create FormData
  - Append file as "dataset"
  - POST to http://localhost:5000/api/v1/analyze/upload

        ↓

┌─────────────────────────────────────────────────────────────────────┐
│ STEP 3: Backend Receives Request                                    │
│ File: backend/src/routes/analysisRoutes.js                         │
└─────────────────────────────────────────────────────────────────────┘

POST /api/v1/analyze/upload
        ↓
Middleware: uploadMiddleware.js (Multer)
  - Validate file type (CSV only)
  - Check file size (< 10MB)
  - Store in memory buffer
        ↓
Controller: analysisController.js
  uploadAndAnalyze(req, res, next)

        ↓

┌─────────────────────────────────────────────────────────────────────┐
│ STEP 4: Backend Processing                                          │
│ File: backend/src/controllers/analysisController.js                │
└─────────────────────────────────────────────────────────────────────┘

1. Parse CSV:
   dataService.loadDataset(req.file.buffer)
   - Parse CSV with csv-parse
   - Extract headers
   - Count rows
   - Analyze gender distribution
   - Analyze shortlisted distribution

2. Detect Bias (JavaScript):
   biasService.detectBias(dataset.rawRows)
   - Calculate selection rates per group
   - Compute disparate impact
   - Identify disadvantaged groups

3. Build Fairness Report:
   fairnessService.buildFairnessReport(dataset.rawRows)
   - Fairness score (0-100)
   - Disparate impact ratio
   - Bias verdict

4. Generate Recommendations:
   recommendationService.generateRecommendations(fairness)
   - Actionable suggestions
   - Mitigation strategies

        ↓

┌─────────────────────────────────────────────────────────────────────┐
│ STEP 5: Backend Response                                            │
└─────────────────────────────────────────────────────────────────────┘

Return JSON:
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

        ↓

┌─────────────────────────────────────────────────────────────────────┐
│ STEP 6: Frontend Receives Response                                  │
│ File: frontend/src/utils/apiService.js                             │
└─────────────────────────────────────────────────────────────────────┘

formatAnalysisForChat(apiResponse)
  - Extract fairness metrics
  - Format for display
  - Add type: 'upload'

generateAnalysisSummary(formattedData)
  - Create human-readable summary
  - Include score, disparate impact
  - Add recommendations

        ↓

┌─────────────────────────────────────────────────────────────────────┐
│ STEP 7: Display Results                                             │
│ File: frontend/src/app/(dashboard)/app/page.js                     │
└─────────────────────────────────────────────────────────────────────┘

addMessage(userId, chatId, {
  role: 'assistant',
  content: summary,
  analysis: results,
  source: 'backend'
})

        ↓

┌─────────────────────────────────────────────────────────────────────┐
│ STEP 8: UI Rendering                                                │
│ File: frontend/src/components/chat/ChatMessage.jsx                 │
└─────────────────────────────────────────────────────────────────────┘

Render:
  - Message bubble with summary text
  - FairnessScore3D component (score: 30)
  - BiasExplanationCard components
  - Export buttons (PDF, CSV, JSON)

        ↓

┌─────────────────────────────────────────────────────────────────────┐
│ RESULT: User sees analysis in chat                                  │
└─────────────────────────────────────────────────────────────────────┘

✅ Fairness Score: 30/100
✅ Disparate Impact: 30.15%
⚠️ HIGH BIAS detected
📊 Female disadvantaged vs Male
💡 3 recommendations provided
```

---

### Scenario 2: User Requests ML Analysis

```
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 1: User Action                                                 │
└─────────────────────────────────────────────────────────────────────┘

User clicks "Run ML Analysis" button
Or types: "Analyze biased dataset with reweighting"

        ↓

┌─────────────────────────────────────────────────────────────────────┐
│ STEP 2: Frontend API Call                                           │
│ File: frontend/src/utils/apiService.js                             │
└─────────────────────────────────────────────────────────────────────┘

runMLAnalysis({
  dataset: 'biased',
  mitigation: 'reweighting'
})
        ↓
POST http://localhost:5000/api/v1/analyze/ml
Content-Type: application/json
Body: {"dataset": "biased", "mitigation": "reweighting"}

        ↓

┌─────────────────────────────────────────────────────────────────────┐
│ STEP 3: Backend Receives Request                                    │
│ File: backend/src/controllers/analysisController.js                │
└─────────────────────────────────────────────────────────────────────┘

runMLAnalysis(req, res, next)
  - Validate dataset name
  - Validate mitigation technique
        ↓
modelService.runFullPipeline({
  dataset: 'biased',
  mitigation: 'reweighting'
})

        ↓

┌─────────────────────────────────────────────────────────────────────┐
│ STEP 4: Backend Calls ML Service                                    │
│ File: backend/src/services/modelService.js                         │
└─────────────────────────────────────────────────────────────────────┘

axios.post('http://localhost:5001/analyze', {
  dataset: 'biased',
  mitigation: 'reweighting'
})

        ↓

┌─────────────────────────────────────────────────────────────────────┐
│ STEP 5: ML Service Receives Request                                 │
│ File: ml/nyaya_ai/api_service.py                                   │
└─────────────────────────────────────────────────────────────────────┘

POST /analyze
  - Validate request
  - Extract parameters
        ↓
Run pipeline:
  run_pipeline(dataset='biased', mitigation='reweighting')

        ↓

┌─────────────────────────────────────────────────────────────────────┐
│ STEP 6: ML Pipeline Execution                                       │
│ Files: ml/nyaya_ai/*.py                                             │
└─────────────────────────────────────────────────────────────────────┘

A. PREPROCESSING (preprocessing.py)
   - Load biased_dataset.csv
   - Handle missing values
   - Encode gender (Male=1, Female=0)
   - Encode education (ordinal)
   - Train/test split (80/20)

B. BEFORE MITIGATION
   1. Train Model (model.py)
      - StandardScaler normalization
      - Logistic Regression training
      - Predict on test set
   
   2. Evaluate Fairness (fairness.py)
      - Calculate selection rates:
        * Male: 32.5%
        * Female: 9.8%
      - Compute disparate impact: 0.3015
      - Fairness score: 30/100
      - Verdict: 🚨 HIGH BIAS
   
   3. Generate Insights (explainer.py)
      - "Female candidates have 9.8% selection rate"
      - "This violates the 80% rule"

C. APPLY MITIGATION (mitigation.py)
   - Technique: Reweighting
   - Calculate sample weights
   - Assign higher weights to Female×shortlisted
   - No rows added/removed

D. AFTER MITIGATION
   1. Retrain Model (model.py)
      - Same pipeline with sample weights
      - New predictions
   
   2. Re-evaluate Fairness (fairness.py)
      - New selection rates:
        * Male: 32.6%
        * Female: 25.6%
      - New disparate impact: 0.784
      - New fairness score: 78/100
      - New verdict: ⚠️ MODERATE RISK
   
   3. Generate New Insights (explainer.py)
      - "Female selection improved to 25.6%"
      - "Disparate impact now 78.4%"

E. COMPARISON
   - DI delta: +0.482
   - FS delta: +48 points
   - Improved: true

        ↓

┌─────────────────────────────────────────────────────────────────────┐
│ STEP 7: ML Service Response                                         │
└─────────────────────────────────────────────────────────────────────┘

Return JSON:
{
  "dataset": "biased",
  "mitigation": "reweighting",
  "before": {
    "fairness_score": 30,
    "disparate_impact": 0.3015,
    "bias_exists": true,
    "verdict": "🚨  HIGH BIAS",
    "selection_rates": {"Male": 0.325, "Female": 0.098},
    "disadvantaged": "Female",
    "privileged": "Male",
    "insights": [...]
  },
  "after": {
    "fairness_score": 78,
    "disparate_impact": 0.784,
    "bias_exists": true,
    "verdict": "⚠️  MODERATE RISK",
    "selection_rates": {"Male": 0.326, "Female": 0.256},
    "insights": [...]
  },
  "comparison": {
    "di_delta": 0.4825,
    "fs_delta": 48,
    "improved": true
  }
}

        ↓

┌─────────────────────────────────────────────────────────────────────┐
│ STEP 8: Backend Processes ML Response                               │
│ File: backend/src/controllers/analysisController.js                │
└─────────────────────────────────────────────────────────────────────┘

fairnessService.buildMitigationReport(mlResult)
  - Format before/after comparison
  - Calculate improvements

recommendationService.generateRecommendations(beforeMetrics)
  - Generate actionable recommendations
  - Based on bias severity

Return formatted response to frontend

        ↓

┌─────────────────────────────────────────────────────────────────────┐
│ STEP 9: Frontend Receives ML Results                                │
│ File: frontend/src/utils/apiService.js                             │
└─────────────────────────────────────────────────────────────────────┘

formatAnalysisForChat(apiResponse)
  - Extract before/after metrics
  - Format comparison data
  - Add type: 'ml'

generateAnalysisSummary(formattedData)
  - Create summary with before/after
  - Highlight improvements
  - Include key insights

        ↓

┌─────────────────────────────────────────────────────────────────────┐
│ STEP 10: Display ML Results                                         │
│ File: frontend/src/components/chat/ChatMessage.jsx                 │
└─────────────────────────────────────────────────────────────────────┘

Render MLAnalysisCard:
  - Before metrics (score: 30, DI: 30.15%)
  - After metrics (score: 78, DI: 78.4%)
  - Improvement indicator (+48 points)
  - Selection rates comparison
  - Key insights
  - Export buttons

        ↓

┌─────────────────────────────────────────────────────────────────────┐
│ RESULT: User sees ML analysis with before/after comparison          │
└─────────────────────────────────────────────────────────────────────┘

✅ Before: 30/100 → After: 78/100
✅ Improvement: +48 points
✅ Female selection: 9.8% → 25.6%
✅ Disparate impact: 30.15% → 78.4%
💡 Mitigation was successful
```

---

### Scenario 3: Backend Offline (Fallback)

```
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 1: User uploads CSV                                            │
└─────────────────────────────────────────────────────────────────────┘

User selects file: biased_dataset.csv

        ↓

┌─────────────────────────────────────────────────────────────────────┐
│ STEP 2: Frontend tries backend API                                  │
└─────────────────────────────────────────────────────────────────────┘

uploadAndAnalyze(file)
        ↓
POST http://localhost:5000/api/v1/analyze/upload
        ↓
[ERROR: ECONNREFUSED - Backend offline]

        ↓

┌─────────────────────────────────────────────────────────────────────┐
│ STEP 3: Fallback to Client-Side Analysis                            │
│ File: frontend/src/app/(dashboard)/app/page.js                     │
└─────────────────────────────────────────────────────────────────────┘

catch (apiError) {
  console.warn('Backend unavailable, falling back...')
  results = await analyzeCSV(file)  // Client-side
}

        ↓

┌─────────────────────────────────────────────────────────────────────┐
│ STEP 4: Client-Side Processing                                      │
│ File: frontend/src/utils/fileAnalysis.js                           │
└─────────────────────────────────────────────────────────────────────┘

analyzeCSV(file)
  - Parse CSV with PapaParse
  - Identify sensitive attributes
  - Identify outcome variable
  - Calculate disparate impact (JS)
  - Compute fairness score
  - Generate findings

        ↓

┌─────────────────────────────────────────────────────────────────────┐
│ STEP 5: Display Client-Side Results                                 │
└─────────────────────────────────────────────────────────────────────┘

Display results with source: 'client'
  - Fairness score
  - Bias findings
  - Note: "Analyzed locally (backend offline)"

        ↓

┌─────────────────────────────────────────────────────────────────────┐
│ RESULT: User still gets analysis, no data loss                      │
└─────────────────────────────────────────────────────────────────────┘

✅ Analysis completed (client-side)
⚠️ ML features unavailable
✅ Basic bias detection working
```

---

## Key Takeaways

1. **Three-Tier Architecture**: Frontend → Backend → ML Service
2. **Graceful Degradation**: Fallback to client-side if backend offline
3. **Comprehensive Analysis**: JS-based + ML-based detection
4. **Before/After Comparison**: Shows mitigation effectiveness
5. **Real-time Results**: Displayed in chat interface
6. **Export Capabilities**: PDF, CSV, JSON formats

## Performance Metrics

- **File Upload**: < 2 seconds
- **JS Analysis**: < 1 second
- **ML Analysis**: 3-5 seconds
- **Total Flow**: 5-7 seconds end-to-end
