# 90-Day Metabolic Reset App

This is a full-stack React + Express application for metabolic health tracking.

## 🚀 Deployment Instructions

### 1. Deploying to Render / Railway (Recommended)
Since this app uses an Express server for AI analysis, it needs a Node.js environment.

1.  **Export to GitHub** from AI Studio.
2.  Go to **Render.com** or **Railway.app**.
3.  Connect this repository.
4.  **Build Command:** `npm run build`
5.  **Start Command:** `npm start`
6.  **Environment Variables:** Add `GEMINI_API_KEY` with your key from AI Studio.

### 2. Running Locally
1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Create a `.env` file with your `GEMINI_API_KEY`.
4.  Run development server: `npm run dev`

## 🛠️ Tech Stack
- **Frontend:** React, Tailwind CSS, Framer Motion, Recharts
- **Backend:** Express, Gemini AI SDK
- **Navigation:** HashRouter (for mobile/static hosting compatibility)
