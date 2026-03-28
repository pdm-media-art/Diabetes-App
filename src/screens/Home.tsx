import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Clock, Droplets, Utensils, BookOpen, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AppColors, getLevelInfo } from '../lib/utils';
import MealLogging from './MealLogging';
import GlucoseLogging from './GlucoseLogging';
import FastingTimer from './FastingTimer';

export default function Home() {
  const { profile, todayLog, streaks, loading } = useApp();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const navigate = useNavigate();

  if (loading || !profile || !todayLog) return <div className="p-8">Loading...</div>;

  const levelInfo = getLevelInfo(profile.xp_total);
  const score = todayLog.metabolic_score;
  const scoreColor = score >= 85 ? AppColors.scoreGreen : score >= 65 ? AppColors.teal : score >= 40 ? AppColors.scoreYellow : AppColors.scoreRed;
  const scoreLabel = score >= 85 ? "Metabolic Green" : score >= 65 ? "On Track" : score >= 40 ? "Caution" : "Reset Needed";

  return (
    <div className="pb-24 p-6 max-w-md mx-auto bg-gray-50 min-h-screen">
      {/* Top Section */}
      <header className="mb-8">
        <h1 className="text-xl font-bold text-gray-800">Good morning, {profile.name}</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs font-semibold text-[#0D7377] bg-[#E8F6F3] px-2 py-0.5 rounded-full">
            {levelInfo.title} · Day {profile.day_count} of 90
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-200 rounded-full mt-3 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(profile.day_count / 90) * 100}%` }}
            className="h-full bg-[#0D7377]"
          />
        </div>
      </header>

      {/* Score Ring */}
      <section className="flex flex-col items-center mb-10">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle cx="96" cy="96" r="88" fill="none" stroke="#eee" strokeWidth="12" />
            <motion.circle 
              cx="96" cy="96" r="88" fill="none" 
              stroke={scoreColor} strokeWidth="12" strokeLinecap="round"
              initial={{ strokeDasharray: "0 553" }}
              animate={{ strokeDasharray: `${(score / 100) * 553} 553` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-5xl font-black text-gray-800">{score}</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Score</span>
          </div>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 font-bold"
          style={{ color: scoreColor }}
        >
          {scoreLabel}
        </motion.div>
      </section>

      {/* Streaks */}
      <section className="grid grid-cols-3 gap-3 mb-8">
        <StreakCard icon={<Flame size={16} />} count={streaks.compliance} label="Compliance" />
        <StreakCard icon={<Clock size={16} />} count={streaks.fasting} label="Fasting" />
        <StreakCard icon={<Droplets size={16} />} count={streaks.gps_clean} label="GPS Clean" />
      </section>

      {/* Quick Log */}
      <section className="grid grid-cols-3 gap-3 mb-8">
        <LogButton icon={<Utensils size={24} />} label="Meal" onClick={() => setActiveModal('meal')} />
        <LogButton icon={<Clock size={24} />} label="Fast" onClick={() => setActiveModal('fast')} />
        <LogButton icon={<Droplets size={24} />} label="Glucose" onClick={() => setActiveModal('glucose')} />
      </section>

      {/* Micro Lesson */}
      <section className="bg-[#0D7377] p-5 rounded-2xl text-white mb-8 shadow-lg shadow-teal-900/20">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Daily Lesson</span>
          <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded">45s Read</span>
        </div>
        <h3 className="text-lg font-bold leading-tight">Why roti is glucose in disguise</h3>
        <button 
          onClick={() => navigate('/learn')}
          className="mt-4 text-sm font-bold flex items-center gap-1"
        >
          Learn More <BookOpen size={14} />
        </button>
      </section>

      {/* Cohort Pulse */}
      <section className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
        <div className="bg-orange-100 p-2 rounded-full">🏃</div>
        <p className="text-sm text-gray-600">
          <span className="font-bold text-gray-800">6 people</span> in your season logged a perfect day today
        </p>
      </section>

      {/* Modals */}
      {activeModal === 'meal' && <MealLogging onClose={() => setActiveModal(null)} />}
      {activeModal === 'glucose' && <GlucoseLogging onClose={() => setActiveModal(null)} />}
      {activeModal === 'fast' && <FastingTimer onClose={() => setActiveModal(null)} />}
    </div>
  );
}

function StreakCard({ icon, count, label }: any) {
  return (
    <div className="bg-white p-3 rounded-xl border border-gray-100 flex flex-col items-center text-center">
      <div className="text-orange-500 mb-1">{icon}</div>
      <div className="text-lg font-bold text-gray-800">{count}</div>
      <div className="text-[9px] uppercase font-bold text-gray-400">{label}</div>
    </div>
  );
}

function LogButton({ icon, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-transform"
    >
      <div className="text-[#0D7377]">{icon}</div>
      <span className="text-xs font-bold text-gray-600">{label}</span>
    </button>
  );
}
