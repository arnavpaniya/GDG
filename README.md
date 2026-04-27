# Nyaya AI ⚖️

> **Nyaya** (Sanskrit: न्याय) — *justice, fairness, ethical judgment.*

Nyaya AI is a bias detection platform that helps developers and organizations identify, measure, and explain unfairness in AI models and datasets — before their systems impact real people.

---

## The Problem

AI systems now make life-changing decisions: who gets hired, who gets a loan, who receives medical care. When these systems learn from flawed historical data, they repeat and amplify the same discriminatory patterns — silently, at scale.

---

## What Nyaya AI Does

Upload a dataset or describe your AI model in chat. Nyaya AI:

1. **Detects bias** — Identifies unfair patterns across protected attributes (gender, age, race, etc.)
2. **Scores fairness** — Provides a 0–100 Fairness Score with clear thresholds
3. **Explains in plain English** — No statistics degree required to understand the results
4. **Recommends fixes** — Actionable next steps to reduce detected bias
5. **Compares models** — Side-by-side fairness analysis across multiple AI systems

---

## Features

| Feature | Status |
|---------|--------|
| CSV dataset upload & analysis | ✅ MVP |
| Fairness Score ring (0–100) | ✅ MVP |
| Bias explanation cards | ✅ MVP |
| Chat-based interface | ✅ MVP |
| Attribute-level bias heatmap | ✅ MVP |
| Model comparison table | 🔄 Advanced |
| Real-time Bias Checker API | 🔄 Advanced |
| PDF report generation | 🔄 Advanced |

---

## App Structure

```
nyaya-ai/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx          # Nav, history, new chat
│   │   │   └── AppShell.jsx         # Root layout wrapper
│   │   ├── chat/
│   │   │   ├── ChatInput.jsx        # Input + file attach + prompt chips
│   │   │   ├── MessageBubble.jsx    # User & AI messages
│   │   │   └── PromptChips.jsx      # Suggested prompt pills
│   │   ├── analysis/
│   │   │   ├── FairnessScoreRing.jsx  # Animated SVG score gauge
│   │   │   ├── BiasHeatmap.jsx        # Attribute × outcome grid
│   │   │   ├── AttributeBarChart.jsx  # Per-group positive rate bars
│   │   │   └── BiasExplanationCard.jsx # Plain-English result cards
│   │   └── auth/
│   │       └── LoginPage.jsx
│   ├── pages/
│   │   ├── Home.jsx         # Chat hero + Nyaya info below
│   │   └── Login.jsx
│   ├── store/
│   │   └── useStore.js      # Zustand global state
│   ├── utils/
│   │   ├── csvParser.js     # PapaParse wrapper
│   │   └── biasEngine.js    # Bias detection logic (prototype)
│   ├── styles/
│   │   └── tokens.css       # Design tokens (colors, spacing, type)
│   └── main.jsx
├── DESIGN_SKILL.md           # Full design system
├── README.md
└── package.json
```

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | React + Vite | Fast HMR, hackathon-friendly |
| Styling | Tailwind CSS | Utility-first, consistent spacing |
| Charts | Recharts | Declarative, React-native |
| CSV parsing | PapaParse | In-browser, no backend needed |
| State | Zustand | Minimal boilerplate |
| Icons | Lucide React | Consistent, 1.5px stroke |
| Routing | React Router v6 | File-based, simple |
| PDF | jsPDF + html2canvas | Client-side report export |

---

## Design System

See [`DESIGN_SKILL.md`](./DESIGN_SKILL.md) for:
- Full color token system (light + dark mode)
- Typography scale (Lora serif + system sans)
- Component specs (chat input, score ring, cards)
- Spacing scale, border radius, motion guidelines

**Aesthetic**: Claude.ai-inspired — warm off-white (`#F5F4EF`), soft neutrals, generous whitespace, serif brand moments.

---

## Routes

```
/          →  Home (login gate → chat + info)
/login     →  Auth page
/chat/:id  →  Individual chat session
```

---

## Getting Started

### Quick Start (All Services)

**Option 1: Manual Start (Recommended)**

Open 3 terminal windows:

```bash
# Terminal 1 - Backend (Port 5000)
cd backend
npm install
npm run dev

# Terminal 2 - ML Service (Port 5001)
cd ml
pip install -r requirements.txt
python -m nyaya_ai.api_service

# Terminal 3 - Frontend (Port 3000)
cd frontend
npm install
npm run dev
```

**Option 2: Using Scripts**

```bash
# Install all dependencies
npm run install:all

# Start services (in separate terminals)
npm run start:backend    # Terminal 1
npm run start:ml         # Terminal 2
npm run start:frontend   # Terminal 3
```

Then open: **http://localhost:3000**

### Individual Service Setup

**Frontend Only:**
```bash
cd frontend
npm install
npm run dev
```

**Backend Only:**
```bash
cd backend
npm install
npm run dev
```

**ML Service Only:**
```bash
cd ml
pip install -r requirements.txt
python -m nyaya_ai.api_service
```

---

## Architecture

Nyaya AI is a **full-stack application** with three integrated services:

```
┌─────────────────┐
│   Frontend      │  Next.js (Port 3000)
│   (React)       │  - User interface
└────────┬────────┘  - File upload
         │           - Analysis display
         ▼
┌─────────────────┐
│   Backend       │  Node.js/Express (Port 5000)
│   (API)         │  - CSV parsing
└────────┬────────┘  - JS-based bias detection
         │           - API routing
         ▼
┌─────────────────┐
│   ML Service    │  Python/Flask (Port 5001)
│   (AI Model)    │  - Logistic Regression
└─────────────────┘  - Fairness metrics
                     - Bias mitigation
```

### Key Features

✅ **Full ML Integration** - Python-based ML pipeline with Logistic Regression  
✅ **Bias Mitigation** - SMOTE and Reweighting techniques  
✅ **Before/After Analysis** - Compare fairness metrics pre and post-mitigation  
✅ **Fallback Mechanism** - Client-side analysis if backend unavailable  
✅ **Real-time Chat** - Interactive analysis results in chat interface  
✅ **Export Reports** - PDF, CSV, and JSON export functionality  

### Analysis Flow

1. **User uploads CSV** → Frontend
2. **Frontend sends file** → Backend API (`/api/v1/analyze/upload`)
3. **Backend processes CSV** → Returns instant JS-based analysis
4. **Backend calls ML service** → Python Flask API (`/analyze`)
5. **ML service runs pipeline** → Trains model, detects bias, applies mitigation
6. **Results return to frontend** → Display in chat with visualizations

---

## Documentation

- **[Integration Guide](./INTEGRATION_GUIDE.md)** - Complete setup and architecture
- **[Testing Guide](./TESTING_GUIDE.md)** - API testing and troubleshooting
- **[Design System](./DESIGN_SKILL.md)** - UI/UX specifications
- **[ML Pipeline](./ml/README.md)** - Python ML service details
- **[Backend API](./backend/README.md)** - Node.js API documentation

---

## Team

Built at a Google for Developers hackathon.
Project: *Unbiased AI Decision — Ensuring Fairness and Detecting Bias in Automated Decisions*

---

## License

MIT
