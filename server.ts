import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenAI } from "@google/genai";

// --- Types & Mock Data ---
interface Profile {
  id: string;
  name: string;
  level: number;
  xp_total: number;
  onboarding_intensity: 'beginner' | 'standard' | 'warrior';
  baseline_weight_kg: number;
  baseline_glucose: number;
  baseline_hba1c: number;
  day_count: number;
}

interface DailyLog {
  date: string;
  metabolic_score: number;
  gps_violations: number;
  fasting_hours: number;
  glucose_fasting: number;
  glucose_postmeal: number;
  mood: number;
  energy: number;
  sleep_hours: number;
  weight_kg: number;
  notes: string;
}

interface Meal {
  id: string;
  logged_at: string;
  description: string;
  gps_status: 'CLEAR' | 'ALERT' | 'VIOLATION';
  gps_items_detected: string[];
  suggested_swap: string | null;
  xp_earned: number;
}

// In-memory store for demo
let userProfile: Profile = {
  id: "user-1",
  name: "Guest",
  level: 1,
  xp_total: 0,
  onboarding_intensity: 'standard',
  baseline_weight_kg: 85,
  baseline_glucose: 110,
  baseline_hba1c: 6.5,
  day_count: 12
};

let dailyLogs: Record<string, DailyLog> = {};
let meals: Meal[] = [];
let streaks = {
  compliance: 5,
  fasting: 3,
  gps_clean: 8
};

// --- AI Service ---
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function analyzeMeal(description: string) {
  const prompt = `
You are the GPS Guard for the 90-Day Metabolic Reset app. Analyze the user's meal input and classify it.

NO GPS = No Grains, Potatoes, Sugar.

GPS VIOLATIONS include:
- Grains: bread, rice, pasta, roti, chapati, naan, cereal, oats, flour, biscuits, crackers
- Potatoes: potato, fries, chips, hash brown, mashed potato
- Sugar: sugar, syrup, honey, candy, chocolate, cake, juice, soda, dessert, sweetener

Meal: "${description}"

Respond in this exact JSON format:
{
  "gps_status": "CLEAR" | "ALERT" | "VIOLATION",
  "detected_items": ["list", "of", "gps", "items", "found"],
  "feedback_message": "Short, encouraging, educational message (max 20 words)",
  "suggested_swap": "Healthy alternative (max 15 words, null if CLEAR)",
  "xp_impact": 25 | 5,
  "score_impact": 0 | -15
}

Tone: Supportive coach, never judgmental. Always educational.
`;

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ parts: [{ text: prompt }] }]
    });
    const text = result.text;
    // Extract JSON from markdown if necessary
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Invalid AI response");
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
      gps_status: "CLEAR",
      detected_items: [],
      feedback_message: "Logged successfully.",
      suggested_swap: null,
      xp_impact: 25,
      score_impact: 0
    };
  }
}

// --- Score Algorithm ---
function calculateScore(log: Partial<DailyLog>) {
  const gps_score = log.gps_violations === 0 ? 100 : log.gps_violations === 1 ? 75 : log.gps_violations === 2 ? 50 : 0;
  
  const fasting = log.fasting_hours || 0;
  const fasting_score = fasting >= 16 ? 100 : fasting >= 12 ? 60 : fasting >= 8 ? 30 : 0;
  
  const glucose = log.glucose_fasting || 0;
  let glucose_score = 0;
  if (glucose > 0) {
    if (glucose <= 100) glucose_score = 100;
    else if (glucose <= 125) glucose_score = 75;
    else if (glucose <= 150) glucose_score = 50;
    else if (glucose <= 200) glucose_score = 25;
  }

  // Simplified carb score for demo
  const carb_score = 100; 
  
  // Completeness
  let modules = 0;
  if (log.gps_violations !== undefined) modules++;
  if (log.fasting_hours !== undefined) modules++;
  if (log.glucose_fasting !== undefined) modules++;
  if (log.mood !== undefined) modules++;
  const completeness_score = (modules / 4) * 100;

  return Math.round((gps_score * 0.40) + (fasting_score * 0.20) + (glucose_score * 0.20) + (carb_score * 0.10) + (completeness_score * 0.10));
}

// --- Server Setup ---
async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(bodyParser.json());

  // API Routes
  app.get("/api/profile", (req, res) => res.json(userProfile));
  
  app.post("/api/onboarding", (req, res) => {
    userProfile = { ...userProfile, ...req.body, day_count: 1 };
    res.json(userProfile);
  });

  app.get("/api/dashboard", (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const todayLog = dailyLogs[today] || {
      date: today,
      metabolic_score: 0,
      gps_violations: 0,
      fasting_hours: 0,
      glucose_fasting: 0,
      glucose_postmeal: 0,
      mood: 0,
      energy: 0,
      sleep_hours: 0,
      weight_kg: userProfile.baseline_weight_kg,
      notes: ""
    };
    
    res.json({
      profile: userProfile,
      todayLog,
      streaks,
      meals: meals.slice(-5)
    });
  });

  app.post("/api/meals/analyze", async (req, res) => {
    const { description } = req.body;
    const analysis = await analyzeMeal(description);
    res.json(analysis);
  });

  app.post("/api/meals/log", (req, res) => {
    const meal: Meal = {
      id: Math.random().toString(36).substr(2, 9),
      logged_at: new Date().toISOString(),
      ...req.body
    };
    meals.push(meal);
    
    // Update today's log
    const today = new Date().toISOString().split('T')[0];
    if (!dailyLogs[today]) {
      dailyLogs[today] = {
        date: today,
        metabolic_score: 0,
        gps_violations: 0,
        fasting_hours: 0,
        glucose_fasting: 0,
        glucose_postmeal: 0,
        mood: 0,
        energy: 0,
        sleep_hours: 0,
        weight_kg: userProfile.baseline_weight_kg,
        notes: ""
      };
    }
    
    if (meal.gps_status === 'VIOLATION') {
      dailyLogs[today].gps_violations++;
    }
    
    dailyLogs[today].metabolic_score = calculateScore(dailyLogs[today]);
    userProfile.xp_total += meal.xp_earned;
    
    res.json({ meal, todayLog: dailyLogs[today], profile: userProfile });
  });

  app.post("/api/logs/glucose", (req, res) => {
    const { value, type } = req.body;
    const today = new Date().toISOString().split('T')[0];
    if (!dailyLogs[today]) {
       dailyLogs[today] = { date: today, metabolic_score: 0, gps_violations: 0, fasting_hours: 0, glucose_fasting: 0, glucose_postmeal: 0, mood: 0, energy: 0, sleep_hours: 0, weight_kg: userProfile.baseline_weight_kg, notes: "" };
    }
    
    if (type === 'fasting') dailyLogs[today].glucose_fasting = value;
    else dailyLogs[today].glucose_postmeal = value;
    
    dailyLogs[today].metabolic_score = calculateScore(dailyLogs[today]);
    userProfile.xp_total += 15;
    
    res.json({ todayLog: dailyLogs[today], profile: userProfile });
  });

  app.post("/api/logs/fasting", (req, res) => {
    const { hours } = req.body;
    const today = new Date().toISOString().split('T')[0];
    if (!dailyLogs[today]) {
       dailyLogs[today] = { date: today, metabolic_score: 0, gps_violations: 0, fasting_hours: 0, glucose_fasting: 0, glucose_postmeal: 0, mood: 0, energy: 0, sleep_hours: 0, weight_kg: userProfile.baseline_weight_kg, notes: "" };
    }
    
    dailyLogs[today].fasting_hours = hours;
    dailyLogs[today].metabolic_score = calculateScore(dailyLogs[today]);
    
    let xp = 0;
    if (hours >= 20) xp = 45;
    else if (hours >= 16) xp = 30;
    userProfile.xp_total += xp;
    
    res.json({ todayLog: dailyLogs[today], profile: userProfile });
  });

  // Vite middleware
  const isProd = process.env.NODE_ENV === "production";
  const distPath = path.join(process.cwd(), "dist");
  const hasDist = fs.existsSync(distPath);

  if (!isProd && !hasDist) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
