# 90-Day Metabolic Reset: Deployment Guide

This application is a **full-stack** app with a React frontend and an Express (Node.js) backend. It requires a Node.js environment to run the AI analysis features.

## ⚠️ Important: GitHub Pages
**GitHub Pages is NOT suitable for this application.** GitHub Pages only hosts static files (HTML/CSS/JS) and cannot run the Node.js backend required for the AI "GPS Guard" to function. If you deploy to GitHub Pages, you will see a blank page or broken features.

## Recommended Hosting Platforms
To deploy this app correctly, use a platform that supports Node.js:

1. **Render** (Recommended)
   - Create a new "Web Service" on Render.
   - Connect your GitHub repository.
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment Variables:** Add `GEMINI_API_KEY` with your Google AI Studio API key.

2. **Railway**
   - Create a new project and connect your GitHub repo.
   - Railway will automatically detect the `package.json` and start the app.
   - **Environment Variables:** Add `GEMINI_API_KEY`.

3. **Vercel** (Requires configuration)
   - Vercel is primarily for static sites but supports Serverless Functions. You would need to adapt the `server.ts` to Vercel's API routes format.

## Local Setup
1. Clone the repository.
2. Run `npm install`.
3. Create a `.env` file and add `GEMINI_API_KEY=your_key_here`.
4. Run `npm run dev` to start the development server.
5. Open `http://localhost:3000`.

## Troubleshooting "Blank Page"
If you see a blank page on your deployed site:
1. **Check the Console:** Open Browser DevTools (F12) and look for errors.
2. **Check the Logs:** Look at the server logs on your hosting platform (Render/Railway).
3. **Environment Variables:** Ensure `NODE_ENV` is set to `production` on your hosting platform.
4. **Build Folder:** Ensure the `dist` folder is being generated correctly during the build process.
