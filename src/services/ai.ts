import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const analyzeMealAI = async (description: string) => {
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

  const result = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: [{ parts: [{ text: prompt }] }]
  });
  return JSON.parse(result.text);
};
