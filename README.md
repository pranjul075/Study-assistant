# AuraStudy – AI-Powered Study Assistant

> **Frontend Internship Assignment** – A production-quality React application that transforms free-form notes or topics into interactive flashcards, quizzes, and study checklists powered by the Gemini API.

---

## Table of Contents
1. [Demo & Features](#demo--features)
2. [Tech Stack](#tech-stack)
3. [Setup & Installation](#setup--installation)
4. [Running Locally](#running-locally)
5. [Using the App](#using-the-app)
6. [AI Usage Note](#ai-usage-note)
7. [Architecture & Key Decisions](#architecture--key-decisions)
8. [Known Limitations & What I'd Do Next](#known-limitations--what-id-do-next)
9. [Time Spent](#time-spent)

---

## Demo & Features

### Core Features (All Required Items Implemented)
- ✅ **Free-form text input** – Paste raw notes, copy-paste study guides, or type a topic name
- ✅ **Real LLM API** – Proxied through a Node.js Express backend to the Gemini 1.5 Flash API; the key is never in the browser
- ✅ **Structured data rendering** – AI returns JSON; the app parses it and renders interactive stateful components — not a chatbot
- ✅ **Flashcards** – 3D CSS-flip cards with keyboard navigation (Space = flip, Left/Right Arrows = navigate, Up Arrow = Mark Mastered, Down Arrow = Mark Review)
- ✅ **Quiz** – Multiple-choice with immediate color-coded feedback, explanations, score, and **re-test wrong answers only**
- ✅ **Checklist** – Concept milestone tracking with animated progress bar
- ✅ **Loading, error, and empty states** – Multi-step animated loading overlay, graceful error fallback with retry
- ✅ **Handles bad AI output** – Schema validation, JSON strip-cleaning, shape-checking on the server; corrupted or missing fields default gracefully
- ✅ **Race condition prevention** – `AbortController` on every request; stale responses never overwrite newer ones
- ✅ **Mobile responsive** – Fluid layout at all breakpoints, sidebar overlay on mobile

### Stretch Features Implemented
- ✅ **Refinement loop** – Re-prompt the model with feedback ("make it harder", "translate to Spanish"); smart merge preserves mastery progress on unchanged cards
- ✅ **Session persistence** – Full LocalStorage save/load/delete of study history with progress tracking
- ✅ **Dark mode + animations** – Premium glassmorphism design, 3D card transforms, slide/fade-in micro-animations
- ✅ **Keyboard navigation** – Full flashcard keyboard controls documented in the UI
- ✅ **Mock AI Mode** – Fallback for running without any API key; works seamlessly out of the box

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Styling | Vanilla CSS (custom design system, glassmorphism, animations) |
| Icons | Lucide React |
| Backend | Node.js, Express |
| AI Provider | Google Gemini 1.5 Flash via `@google/generative-ai` |
| Fonts | Google Fonts (Outfit, Plus Jakarta Sans) |

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/) *(optional — Mock AI Mode works without it)*

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd "AI study Assistant"
npm run install:all
```

This single command installs dependencies for both the React frontend and the Node backend.

### 2. Configure the API Key (Optional)

Open `backend/.env` and replace the placeholder with your key:

```env
GEMINI_API_KEY=AIza...your_real_key_here
PORT=5001
```

> **If you skip this step**, the app runs in **Mock AI Mode** — the backend will generate rich, realistic mock study sets locally so the entire UI is fully testable without any external API.

---

## Running Locally

```bash
npm run dev
```

This single command starts both services concurrently:

| Service | URL |
|---|---|
| React Frontend | http://localhost:5173 |
| Express Backend | http://localhost:5001 |

> The backend status badge in the UI will indicate whether you are connected to live Gemini or running in Mock Mode.

---

## Using the App

1. **Paste your notes** into the text area, or click one of the **Quick Demo** buttons to pre-fill sample content.
2. Click **Generate Study Kit** and watch the animated loading indicator.
3. Your study session opens in the **Dashboard** with four tabs:
   - **Overview** – Topic summary, mastery metrics, and the **Refinement Loop** (type instructions to modify the kit).
   - **Flashcards** – Flip cards with keyboard shortcuts. Mark cards Mastered or Needs Review.
   - **Quiz** – Answer multiple-choice questions. After finishing, **Re-test Wrong Answers** to focus only on your gaps.
   - **Checklist** – Tick off concept milestones as you review them.
4. Sessions are **automatically saved** to history. Click **History** in the header to reload any past session.

---

## AI Usage Note

**Tools used:** Anthropic Claude (via Antigravity IDE) for code scaffolding and iterative development.

**What I used AI for:**
- Generating the initial skeleton of component files which I then reviewed and customized.
- Suggesting TypeScript interface design for the study session data model.
- Helping write the system prompt / JSON schema instruction sent to Gemini.
- Debugging TypeScript strict-mode `verbatimModuleSyntax` import errors.

**What I did myself:**
- Designing the full UI/UX architecture (tab navigation, refinement loop, 3D flip cards, progress metrics).
- The core `AbortController` race-condition logic in `App.tsx`.
- The smart card-merge algorithm in `handleRefine()` that preserves user mastery progress across refinements.
- All CSS design decisions, animations, and the glassmorphism design system.
- The Mock AI engine and pre-built topic data in `backend/index.js`.
- Structural debugging and wiring all components together.

I can explain every line of code and extend it live in an interview.

---

## Architecture & Key Decisions

### Why a Backend Proxy?
The Gemini API key must never be shipped to the browser. The Express server in `backend/index.js` holds the key in a `.env` file that is `.gitignore`d and forwards requests to the Gemini API.

### Handling Bad AI Output
The backend enforces two layers of defense:
1. **Prompt engineering** – The system instruction specifies exact JSON structure with TypeScript-style comments.
2. **Server-side validation** – After parsing, every field is type-checked and shape-validated. Missing arrays default to `[]`, missing strings default to safe fallbacks. The frontend never crashes on invalid output.

The client adds a third layer by validating the HTTP response status before processing, and wrapping everything in try/catch blocks.

### Race Condition Prevention
Every call to `handleGenerate` and `handleRefine` in `App.tsx` creates a new `AbortController` and immediately calls `.abort()` on the previous controller if one exists. The `finally` block only clears the loading state if the controller is still the *current* one — stale responses are silently discarded.

### Smart Merge on Refinement
When a user refines their study guide, the app compares incoming flashcard questions (normalized to lowercase) against the previous session's cards. Matching cards inherit the old `status` field (`mastered`, `review`, `new`). This means mastering a card survives refinements.

---

## Known Limitations & What I'd Do Next

| Limitation | What I'd Do Next |
|---|---|
| No streaming support yet | Add `generateContentStream()` from the Gemini SDK and pipe chunks via SSE to the client for real-time generation feedback |
| Sessions stored in `localStorage` only | Add a database (SQLite or Supabase) with user accounts for cloud-synced history |
| Quiz state resets when navigating tabs | Lift quiz state to the `Dashboard` to persist answers across tab switches |
| No chart/block type variety | Add a `type` discriminant to the JSON schema so the AI can return bar charts (for quantitative data), timeline blocks, or concept maps |
| Mock Mode quiz questions are static | Add a procedural generation engine for richer mock content |
| No undo for history deletion | Add a toast/undo mechanism for accidental deletes |

---

## Time Spent

| Phase | Hours |
|---|---|
| Planning, architecture design, API exploration | ~1.0 hr |
| Backend (Express server, Gemini integration, mock engine) | ~1.5 hrs |
| Frontend component development (Flashcards, Quiz, Checklist, Dashboard) | ~2.5 hrs |
| CSS design system, animations, responsiveness | ~1.5 hrs |
| App.tsx wiring, race conditions, refinement loop, session persistence | ~1.0 hr |
| TypeScript fixes, build verification, README | ~0.5 hr |
| **Total** | **~8.0 hrs** |
