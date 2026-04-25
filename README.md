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

```bash
# Clone
git clone https://github.com/your-org/nyaya-ai.git
cd nyaya-ai

# Install
npm install

# Dev server
npm run dev

# Build
npm run build
```

---

## Prototype Scope (Hackathon)

This is a **frontend-only prototype**. Bias detection runs client-side using simplified statistical algorithms on uploaded CSV data. No backend or real ML model required.

**Simulated analysis flow:**
1. User uploads CSV in chat
2. PapaParse extracts columns
3. `biasEngine.js` computes group-level positive rates per attribute
4. Disparate impact ratio calculated vs 80% rule threshold
5. Results rendered as score + explanation cards in chat

---

## Team

Built at a Google for Developers hackathon.
Project: *Unbiased AI Decision — Ensuring Fairness and Detecting Bias in Automated Decisions*

---

## License

MIT
