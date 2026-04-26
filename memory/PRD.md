# Nyaya AI — PRD

## Original problem statement
> "make the website more 3D immersive use the logo images I have provided properly. use framer motion and set up a cool hero page. add section on what this ai provides, why it is better, how this works, what can be achieved type of sections, etc. Give it modern design and 3d interactiveness. you can change the whole design of the website if u want"

## Product
**Nyaya AI** — bias detection & AI fairness platform.
- Detects bias in datasets and AI model outputs
- Calculates a 0–100 fairness score
- Visualises bias on dashboards
- Explains bias in plain English
- Compares responses across multiple models (GPT, Gemini, Claude…)
- Identifies sensitive attributes (gender, region, age…)
- Recommends actionable fixes
- Real-time bias-checker API
- PDF audit reports
- Promotes ethical, transparent, trustworthy AI

## Architecture
- **Framework:** Next.js 16 (Turbopack, App Router) — `/app/frontend`
- **Styling:** Tailwind CSS v4 (`@theme` tokens) + custom utilities
- **3D:** React Three Fiber + drei + three.js (animated logo mark, Sparkles, MeshTransmissionMaterial)
- **Animations:** framer-motion 12 (scroll reveals, tilt, counters, parallax)
- **State:** zustand (theme + chat store)
- **Auth/DB:** Firebase (existing — preserved)
- **Charts:** recharts (existing)
- **Reports:** jsPDF + html2canvas (existing)

## Routes
| Route | Purpose | Layout |
|-------|---------|--------|
| `/` | Marketing landing (NEW) | Root layout only — full-bleed |
| `/app` | Chat / fairness analysis dashboard (moved from `/`) | `(dashboard)` route group with AppShell sidebar |
| `/login` | Sign-in / sign-up | Root layout |
| `/privacy`, `/terms` | Legal | Root layout |

## What's been implemented (Apr 26, 2026)
### New immersive landing (`/`)
- **Hero3D** — R3F scene with the Nyaya AI logo mark rebuilt in 3D (gold ring, cross beams, side node rings, glowing nodes, transmissive core orb), mouse parallax, floating animation, gold sparkle particles, blueprint grid + radial gold glow + grain backdrop
- **Navbar** — sticky, scroll-blur, logo, in-page links (Features / Why / How / Outcomes), theme toggle, "Launch App" CTA, mobile menu
- **Hero section** — split-word animated headline, eyebrow chip, dual CTAs (`Try Nyaya AI free` → `/app`, `See how it works`), 3-stat trust strip, scroll indicator
- **Features section** — 10 capability cards (Bias Detection, Fairness Score, Interactive Visuals, Plain-English Reasons, Model Comparison, Sensitive Attribute Detection, Actionable Suggestions, Real-time API, PDF Reports, Ethical by Design) with mouse-tracked 3D tilt, glass + gold-accent hover
- **WhyBetter section** — split comparison: "Most fairness tools" vs "Nyaya AI" with strike-through old way / glowing new way + closing principle quote
- **HowItWorks section** — 4-step timeline (Bring data → Auto-detect attrs → Score & explain → Fix & ship) with scroll-animated gold rail and pulsing nodes
- **Outcomes section** — animated counter stats (67% / 8x / 84+ / 0) + 6 use-case cards (Hiring, Lending, Healthcare, Public sector, EdTech, LLMs)
- **CTA section** — glass card with rotating background logo marks + "Launch Nyaya AI" / "Create account"
- **Footer** — brand, product nav, get-started, legal, copyright tagline

### Theme system
- `dark` (default) — deep cinematic black `#07070a` + gold `#E5B028`
- `light` — warm luxe cream `#F7F4EC` + deeper gold `#C68A12`
- Theme toggle (sun/moon) with motion icon swap
- Persisted to localStorage; pre-paint script in `<head>` prevents flash
- Existing nordic/forest themes retained

### Logo usage
- `logo-mark.png` — navbar, footer, login, sidebar, CTA decorative spinning marks, favicon-style
- `logo.png` (full horizontal) — hero of `/app` dashboard
- 3D recreation of mark used as the centerpiece of the landing hero

### Other
- Moved chat experience from `/` → `/app`; AuthProvider redirects updated; `/app` is publicly previewable
- Favicon, SEO metadata refreshed
- Dependencies installed via `yarn install --ignore-engines`
- Supervisor `start` script switched to `next dev` for hot-reload preview

## Tech stack constraints honoured
- Three.js v0.184, R3F v9, drei v10
- framer-motion v12
- lucide-react v1.11 (icons verified for availability)
- Tailwind v4 with `@theme` block
- No backend changes (existing Firebase config untouched)

## Out of scope / Backlog (P0 → P2)
- **P1** — Real bias-detection ML backend (currently the chat returns a mock assistant reply; CSV is parsed locally with `biasEngine.js`)
- **P1** — Live model comparison endpoint (GPT / Gemini / Claude)
- **P1** — Real-time bias-checker API + API key management
- **P2** — Team collaboration (shared workspaces, roles)
- **P2** — Marquee of customer logos / press logos on landing
- **P2** — Pricing page + Stripe checkout
- **P2** — Pricing-aware "Launch app" gating

## Known limitations
- The chat assistant is a **MOCKED** response (1s delay, echoes the prompt). Wiring to a real LLM provider is pending.
- The bias engine is a client-side simplified prototype (in `utils/biasEngine.js`).
- Three.js scene uses no HDR Environment to keep first paint fast.

## Test credentials
- Firebase Auth — uses live `nyaya-ai-hackathon-2026` project; user must create their own account or use Google Sign-In.
- No seeded test user created during this redesign session.

---

_Last updated: Apr 26, 2026 — landing redesign session_
