import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const AppColors = {
  teal: "#0D7377",
  tealLight: "#14A085",
  tealBg: "#E8F6F3",
  darkGray: "#2C3E50",
  midGray: "#566573",
  lightGray: "#F2F3F4",
  scoreGreen: "#14A085",
  scoreYellow: "#D35400",
  scoreRed: "#C0392B",
  xpGold: "#D4AC0D",
};

export const levels = [
  { level: 1, title: "Metabolic Beginner", xpMin: 0, xpMax: 500 },
  { level: 2, title: "Stabilizer", xpMin: 500, xpMax: 1500 },
  { level: 3, title: "Fat Burner", xpMin: 1500, xpMax: 3500 },
  { level: 4, title: "Insulin Controller", xpMin: 3500, xpMax: 7000 },
  { level: 5, title: "Metabolic Warrior", xpMin: 7000, xpMax: 12000 },
  { level: 6, title: "Fateh — The Conqueror", xpMin: 12000, xpMax: 999999 },
];

export const getLevelInfo = (xp: number) => {
  return levels.find(l => xp >= l.xpMin && xp < l.xpMax) || levels[levels.length - 1];
};
