# 🚀 START HERE - Nyaya AI Quick Reference

## Your System is Ready! ✅

All three services (Frontend, Backend, ML) are integrated and working together.

---

## 🎯 Quick Start (3 Steps)

### Step 1: Start Backend
```bash
cd backend
npm run dev
```
✅ Backend running on **http://localhost:5000**

### Step 2: Start ML Service
```bash
cd ml
python -m nyaya_ai.api_service
```
✅ ML Service running on **http://localhost:5001**

### Step 3: Start Frontend
```bash
cd frontend
npm run dev
```
✅ Frontend running on **http://localhost:3000**

---

## 🧪 Quick Test

Open browser: **http://localhost:3000**

1. Click "Upload CSV"
2. Select `backend/src/data/biased_dataset.csv`
3. Wait 2-5 seconds
4. View results!

---

## 📊 What You Get

### Instant Analysis
- ⚡ Fairness Score (0-100)
- 📈 Disparate Impact Ratio
- 🎯 Bias Detection
- 💡 Recommendations

### ML Analysis
- 🤖 Before/After Comparison
- 📊 Selection Rates
- 🔄 Mitigation Results
- 📝 Plain-English Insights

---

## 🔍 Health Checks

```bash
# Backend
curl http://localhost:5000/api/v1/analyze/status

# ML Service
curl http://localhost:5001/health
```

---

## 📚 Documentation

| Guide | What's Inside |
|-------|---------------|
| **[QUICK_START.md](./QUICK_START.md)** | 5-minute setup |
| **[INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)** | Complete integration details |
| **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** | API testing & troubleshooting |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | System architecture |
| **[DATA_FLOW.md](./DATA_FLOW.md)** | Visual data flow |
| **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** | Production deployment |
| **[COMPLETION_SUMMARY.md](./COMPLETION_SUMMARY.md)** | What was done |

---

## 🛠️ Troubleshooting

### Backend won't start
```bash
cd backend
npm install
npm run dev
```

### ML Service won't start
```bash
cd ml
pip install -r requirements.txt
python -m nyaya_ai.api_service
```

### Frontend won't start
```bash
cd frontend
npm install
npm run dev
```

### CORS errors
Check `backend/.env`:
```env
ALLOWED_ORIGINS=http://localhost:3000
```

---

## 🎨 Features

✅ Full ML Pipeline Integration  
✅ Before/After Bias Comparison  
✅ Multiple Mitigation Techniques  
✅ Export to PDF, CSV, JSON  
✅ Fallback to Client-Side Analysis  
✅ Real-time Chat Interface  
✅ 3D Visualizations  
✅ Multi-language Support  

---

## 📦 Project Structure

```
nyaya-ai/
├── frontend/          # Next.js (Port 3000)
├── backend/           # Node.js (Port 5000)
├── ml/                # Python (Port 5001)
└── docs/              # All documentation
```

---

## 🔗 API Endpoints

### Backend (Port 5000)
- `GET /api/v1/analyze/status` - Health check
- `POST /api/v1/analyze/upload` - Upload CSV
- `POST /api/v1/analyze/ml` - Run ML analysis

### ML Service (Port 5001)
- `GET /health` - Health check
- `POST /analyze` - Run ML pipeline

---

## ⚡ Quick Commands

```bash
# Install all dependencies
npm run install:all

# Test backend
npm run test:backend

# Test ML service
npm run test:ml
```

---

## 🎯 Next Steps

1. ✅ Start all services
2. ✅ Test file upload
3. ✅ View analysis results
4. 📖 Read documentation
5. 🚀 Deploy to production

---

## 💡 Tips

- Use `backend/src/data/biased_dataset.csv` for testing
- Check terminal logs if something fails
- All services must be running for full functionality
- Frontend works offline with client-side analysis

---

## 🆘 Need Help?

1. Check the documentation
2. Review terminal logs
3. Verify all services are running
4. Check environment variables

---

## ✅ Status

**Integration:** ✅ Complete  
**Testing:** ✅ Verified  
**Documentation:** ✅ Complete  
**Production Ready:** ✅ Yes  

---

## 🎉 You're All Set!

**Open http://localhost:3000 and start analyzing datasets for bias!**

---

*Last Updated: April 26, 2026*
