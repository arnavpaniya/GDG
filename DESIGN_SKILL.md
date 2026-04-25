# Nyaya AI — Design Skill

## Identity

**Product**: Nyaya AI — bias detection platform
**Tagline**: Fair AI starts here.
**Tone**: Trustworthy, warm, accessible. Non-intimidating for non-developers.
**Aesthetic reference**: Claude.ai — off-white base, soft neutrals, clean type, zero visual noise.

---

## Color System

### Base Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#F5F4EF` | Page background (warm off-white) |
| `--bg-secondary` | `#EEECD8` | Sidebar, input area background |
| `--bg-surface` | `#FFFFFF` | Cards, modals, chat bubbles |
| `--border` | `rgba(0,0,0,0.12)` | All dividers and borders |
| `--text-primary` | `#1A1916` | Headings, body |
| `--text-secondary` | `#6B6860` | Captions, muted labels |
| `--text-tertiary` | `#9A9890` | Placeholders, hints |

### Accent Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--accent-gold` | `#D4A017` | Primary CTA, logo mark, score ring accent |
| `--accent-gold-light` | `#FFF3CD` | Gold tint backgrounds |
| `--accent-teal` | `#1D9E75` | Success, fair score, positive outcome |
| `--accent-red` | `#E24B4A` | Bias detected, danger, high disparity |
| `--accent-amber` | `#F5A623` | Moderate bias, warning states |
| `--accent-blue` | `#2D6BE4` | Links, info states, active nav |

### Semantic Tokens

```css
--score-fair:   var(--accent-teal);   /* 75–100 */
--score-warn:   var(--accent-amber);  /* 50–74  */
--score-bias:   var(--accent-red);    /* 0–49   */
```

---

## Typography

| Role | Font | Size | Weight |
|------|------|------|--------|
| Display / Hero | `Tiempos Headline` or `Lora` | 40–56px | 500 |
| Heading H1 | `Lora` | 28px | 500 |
| Heading H2 | `Lora` | 22px | 500 |
| Body | `Inter` or system-sans | 15px | 400 |
| Label / UI | System sans | 13px | 500 |
| Caption / Muted | System sans | 12px | 400 |
| Mono / Code | `JetBrains Mono` | 13px | 400 |

> Rule: serif for brand moments (hero, section titles). Sans for all UI/data.

---

## Layout

### App Shell

```
┌─────────────────────────────────────────────────┐
│  Sidebar (260px)  │  Main content area (flex-1) │
│  ─────────────    │                              │
│  Logo             │  [Chat hero]                 │
│  New Chat btn     │  [Nyaya info section below]  │
│  Search           │                              │
│  Chat history     │                              │
└─────────────────────────────────────────────────┘
```

### Sidebar

- Width: `260px` fixed, collapsible on mobile
- Background: `--bg-secondary`
- Border-right: `0.5px solid var(--border)`
- Sections: Logo → New Chat button → Search bar → History list
- History item: `14px`, hover `bg: rgba(0,0,0,0.05)`, active item `bg: rgba(0,0,0,0.08)`
- Bottom: user avatar + name + settings icon

### Main Area

- Max-width: `720px`, centered
- Chat input pinned to bottom (sticky)
- Hero: centered, top 30% of viewport before first message
- Below chat: Nyaya AI info section (features, how it works, example prompts)

---

## Components

### Chat Input

- Height: `52px` min, auto-grows
- Border: `1px solid var(--border)`, radius `16px`
- Background: `--bg-surface`
- Attach icon (left), Send button (right, gold accent when active)
- Placeholder: `"Paste your dataset or ask about AI fairness..."`
- Prompt chips above input (3 suggestions): pill shape, `--bg-secondary` fill

### Fairness Score Ring

- SVG circle, `120px` diameter
- Stroke-width: `10px`
- Color: semantic score tokens (teal/amber/red)
- Animated fill on load (0 → score, 1.2s ease-out)
- Center: score number `32px 500`, label `12px muted` below

### Bias Explanation Card

- Background: `--bg-surface`
- Border-left: `3px solid` (color = severity token)
- Padding: `16px 20px`
- Tag chip (HIGH / MODERATE / LOW) top-right
- Collapsible: click to expand detail

### Message Bubble

- User: right-aligned, `--bg-secondary` fill, radius `18px 18px 4px 18px`
- AI: left-aligned, no fill (text only), avatar mark left
- Analysis result messages: contain embedded cards (score ring + chart inline)

### Login Page

- Centered card `420px` wide
- Logo top, tagline below
- Email + password inputs
- "Continue" button (gold, full-width)
- Divider + "Continue with Google" option
- Footer: "By signing in you agree to our Terms"

---

## Spacing Scale

```
4px  — tight (icon gaps)
8px  — compact (chip padding)
12px — base (form internal)
16px — comfortable (card padding)
24px — section gap
40px — large section breathing room
64px — hero vertical padding
```

---

## Border Radius

| Element | Radius |
|---------|--------|
| Buttons | `10px` |
| Cards | `16px` |
| Input | `16px` |
| Chips/pills | `100px` |
| Avatar | `50%` |
| Score ring | SVG circle |

---

## Iconography

- Library: **Lucide React**
- Size: `16px` inline, `20px` standalone, `24px` nav
- Stroke-width: `1.5px`
- Color: inherit from text token

---

## Motion

| Interaction | Animation |
|-------------|-----------|
| Page transition | fade + 8px slide-up, `200ms ease` |
| Score ring fill | stroke-dashoffset, `1.2s ease-out` |
| Card appear | fade + scale `0.98→1`, `180ms ease` |
| Sidebar collapse | width transition, `200ms ease` |
| Chat message in | fade + 6px slide-up, `150ms ease` |
| Button hover | `bg` transition `120ms` |

> Respect `prefers-reduced-motion`. All animations wrap in media query.

---

## Dark Mode

Support via `[data-theme="dark"]` class on `<html>`.

| Token | Light | Dark |
|-------|-------|------|
| `--bg-primary` | `#F5F4EF` | `#1A1916` |
| `--bg-secondary` | `#EEECD8` | `#242320` |
| `--bg-surface` | `#FFFFFF` | `#2C2B28` |
| `--text-primary` | `#1A1916` | `#E8E6DF` |
| `--text-secondary` | `#6B6860` | `#9A9890` |
| `--border` | `rgba(0,0,0,0.12)` | `rgba(255,255,255,0.10)` |

---

## Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| `< 768px` | Sidebar hidden (hamburger), single column |
| `768px–1024px` | Sidebar collapsible |
| `> 1024px` | Sidebar always visible |

---

## Dos and Don'ts

✅ Warm off-white backgrounds
✅ Serif fonts for brand/hero moments
✅ Generous whitespace
✅ Soft, purposeful shadows (`box-shadow: 0 1px 4px rgba(0,0,0,0.08)`)
✅ Gold accent for primary actions only

❌ Purple gradients or neon glows
❌ Dense, cramped layouts
❌ System fonts (Arial, Roboto) for headings
❌ Multiple competing accent colors on same screen
❌ Hard black backgrounds in light mode
