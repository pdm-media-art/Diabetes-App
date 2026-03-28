import React, { createContext, useContext, useState, useEffect } from 'react';

interface Profile {
  id: string;
  name: string;
  level: number;
  xp_total: number;
  onboarding_intensity: 'beginner' | 'standard' | 'warrior';
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

interface AppContextType {
  profile: Profile | null;
  todayLog: DailyLog | null;
  streaks: { compliance: number; fasting: number; gps_clean: number };
  meals: any[];
  loading: boolean;
  refreshData: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [streaks, setStreaks] = useState({ compliance: 0, fasting: 0, gps_clean: 0 });
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();
      setProfile(data.profile);
      setTodayLog(data.todayLog);
      setStreaks(data.streaks);
      setMeals(data.meals);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: any) => {
    const res = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const newProfile = await res.json();
    setProfile(newProfile);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <AppContext.Provider value={{ profile, todayLog, streaks, meals, loading, refreshData, updateProfile }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
