# AuraStudy – AI-Powered Study Assistant

AuraStudy is a web application that helps students and professionals convert unstructured text notes or study topics into active learning sets. The app parses materials into three interactive modules: 3D double-sided flashcards, customizable multiple-choice quizzes, and structured concept checklists.

To protect API credentials, client requests are routed through a secure Node.js proxy server that calls the Gemini 1.5 Flash API. The system handles unstructured outputs reliably by enforcing schema validation, normalizing parsed JSON, and managing request cancellations.

## Table of Contents
1. [Core Features](#core-features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Setup & Installation](#setup--installation)
5. [Running Locally](#running-locally)
6. [User Guide](#user-guide)
7. [AI Usage Disclosure](#ai-usage-disclosure)
8. [System Architecture & Error Handling](#system-architecture--error-handling)
9. [Known Limitations & Future Scope](#known-limitations--future-scope)

---

## Core Features

- **Free-Form Note Parser**: Input raw text, study guides, or topics up to 5,000 characters.
- **Structured Data UI**: Parsed JSON outputs map directly to interactive, stateful components instead of a chatbot interface.
- **3D Flashcards**: Flip cards with full keyboard controls (Space to flip, Left/Right arrows to navigate, Up/Down arrows to categorize as "Mastered" or "Review").
- **Multiple-Choice Quizzes**: Inline validation showing option correctness, detailed explanations for every answer, and a state machine enabling re-testing of only incorrect questions.
- **Milestone Checklist**: Tracks concept progress with a progress bar and completion states.
- **Refinement Loop**: Refine the generated study guide using follow-up instructions (e.g., translating text, focusing on a subtopic). The application merges new content while preserving existing card mastery progress.
- **Session History**: Automatic persistence to localStorage with a sidebar panel to reload or clear past study sessions.
- **Network & Parse Resilience**: Graceful error UI with one-click retry triggers. Stale or slow responses are discarded using client-side AbortController guards to prevent race conditions.
- **Mock Fallback Engine**: Fully functional local mock mode to test the frontend and refinement loops without requiring a live Gemini API key.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Vanilla CSS (custom design system, dark-mode glassmorphism, responsive grid layout)
- **Icons**: Lucide React
- **Backend**: Node.js, Express
- **AI Integration**: Google Gemini 1.5 Flash (via `@google/generative-ai` SDK)

---

## Project Structure

```text
.
├── backend/
│   ├── .env.example       # Template for Gemini API credentials
│   ├── index.js           # Express API proxy & local Mock AI engine
│   └── package.json       # Node.js backend configuration
├── src/
│   ├── components/
│   │   ├── Checklist.tsx  # Interactive milestone lists & progress tracker
│   │   ├── Dashboard.tsx  # Coordinating tabs & refinement forms
│   │   ├── ErrorFallback.tsx # Retry handlers & error views
│   │   ├── Flashcards.tsx # 3D flip deck with keyboard shortcut listeners
│   │   ├── Header.tsx     # Branding & history toggle interface
│   │   ├── HistorySidebar.tsx # localStorage retrieval & session loader
│   │   ├── InputForm.tsx  # Text editor & pre-filled sample guide chips
│   │   └── Quiz.tsx       # MCQ state machine with re-testing wrong options
│   ├── App.tsx            # Main state orchestrator & AbortController routing
│   ├── index.css          # Dark-theme glassmorphism CSS layout & tokens
│   ├── main.tsx           # React bootstrap entrypoint
│   └── types.ts           # Shared study module interface types
├── index.html             # Application entry with SEO configurations
├── package.json           # Root task runner with postinstall scripts
├── tsconfig.json          # TypeScript workspace compiler settings
└── vite.config.ts         # Vite server with port 5001 proxy config
```

---

## Setup & Installation

### Prerequisites
- Node.js 18 or higher
- Google AI Studio API Key (optional; mock fallback is active by default)

### 1. Clone the Repository and Install Dependencies
```bash
git clone https://github.com/pranjul075/Study-assistant.git
cd "AI study Assistant"
npm install
```
*(Note: A `postinstall` hook runs automatically to install dependencies for both the frontend and backend).*

### 2. Configure Environment Variables (Optional)
Create a `.env` file in the `backend` folder based on the template:
```bash
cp backend/.env.example backend/.env
```
Open `backend/.env` and replace `your_api_key_here` with your Gemini API key:
```env
GEMINI_API_KEY=AIzaSy...your_actual_key...
PORT=5001
```
*If no key is configured, the server operates in Mock AI Mode, returning dynamic, structured local mock data.*

---

## Running Locally

To start the frontend and backend servers concurrently, run:
```bash
npm start
```
This runs:
- React Frontend (Vite) on http://localhost:5173
- Express API Server on http://localhost:5001 (proxied automatically via Vite configuration)

---

## User Guide

1. **Input Notes**: Paste study text or select a demo template (e.g., Photosynthesis or React Hooks) on the home screen.
2. **Review Deck**: Use the tabs to toggle between flashcards, quizzes, and checklists.
3. **Master Flashcards**: Use arrow keys to navigate and mark card status. The progress bar displays your mastery splits.
4. **Take Quizzes**: Select answers. On completion, click "Re-test Wrong Answers" to isolate and answer only missed questions.
5. **Update Guide**: Use the input field under the Overview tab to specify follow-up instructions.

---

## AI Usage Disclosure

### Tools Used
- **Anthropic Claude (via Antigravity IDE)** for component structuring and TypeScript troubleshooting.

### AI Assistance Log
- Scaffolding the boilerplate React component structures.
- Suggesting the TypeScript interface schema for study objects.
- Adjusting prompt configurations for Gemini schema compliance.
- Resolving compiler errors related to strict strict-mode type imports (`verbatimModuleSyntax`).

### Original Work
- Architected the application state and components integration in `App.tsx`.
- Implemented the client-side `AbortController` cancellation engine to block race conditions.
- Programmed the smart merge logic that compares incoming card arrays and maintains card status records.
- Designed the CSS stylesheet, including the responsive dark glassmorphism layout and 3D card flipping transforms.
- Built the local Mock AI routing system in Express.

---

## System Architecture & Error Handling

### API Proxy Configuration
To prevent client-side credential exposure, the React app forwards all generation requests to `/api/generate`, which Vite proxies to the Express backend. The backend securely injects the `GEMINI_API_KEY` from local environment variables.

### Resilience Against Bad AI Output
The system handles malformed output on three levels:
1. **Model Parameter Constraints**: We enforce strict schema parsing using `responseMimeType: "application/json"` in the Gemini generation config.
2. **Server-Side Sanitization**: The Express endpoint uses regex to strip markdown code blocks (e.g. ````json ... ````) if returned, parses the JSON, and inspects the output. If fields are missing or typed incorrectly, it enforces defaults (e.g. converting nulls to empty arrays) to guarantee the shape.
3. **Client-Side Boundaries**: HTTP failures and parse exceptions are captured within the frontend framework and rendered as non-blocking `ErrorFallback` views with simple retry triggers.

### Race Condition Mitigation
In active typing or fast generation environments, network latency can cause old requests to settle after newer ones. The React app handles this by maintaining a mutable reference to an active `AbortController`. Triggering a new generation aborts any in-flight request instantly.

### Smart Merging
When the user refines their study guide, we compare incoming questions against the current deck. If a question matches one previously reviewed, we copy its progress status (`mastered` or `review`) into the new state so the user does not lose their learning metrics.

---

## Known Limitations & Future Scope

- **No Streaming Support**: Future versions will use `generateContentStream()` and Server-Sent Events (SSE) to render parts of the cards as they generate.
- **Tab State Resets**: Switching tabs currently resets active quiz response histories. Moving the current quiz state up to the dashboard controller is planned.
- **LocalStorage Storage Limits**: Currently uses browser storage. Adding a lightweight SQLite or Postgres backend with user authentication would allow cross-device sync.
