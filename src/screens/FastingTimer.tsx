import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Play, Square, Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function FastingTimer({ onClose }: { onClose: () => void }) {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [target, setTarget] = useState(16);
  const { refreshData } = useApp();

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${m}m ${sec}s`;
  };

  const handleEnd = async () => {
    const hours = seconds / 3600;
    await fetch('/api/logs/fasting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hours })
    });
    refreshData();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <motion.div 
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        className="bg-white w-full max-w-md rounded-t-3xl p-8 min-h-[70vh] flex flex-col"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">Fasting Timer</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
        </div>

        {!isActive ? (
          <div className="flex-1 flex flex-col">
            <h3 className="text-gray-500 font-medium mb-4">Choose Protocol</h3>
            <div className="grid grid-cols-2 gap-4 mb-12">
              {[12, 16, 18, 20].map(h => (
                <button 
                  key={h}
                  onClick={() => setTarget(h)}
                  className={`p-6 rounded-2xl border-2 transition-all ${target === h ? 'border-[#0D7377] bg-[#E8F6F3]' : 'border-gray-100'}`}
                >
                  <div className="text-2xl font-bold">{h}:8</div>
                  <div className="text-xs text-gray-500">Fast</div>
                </button>
              ))}
            </div>
            <button 
              onClick={() => setIsActive(true)}
              className="w-full bg-[#0D7377] text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
            >
              <Play size={20} fill="currentColor" /> Start Fasting
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-64 h-64 flex items-center justify-center mb-12">
              <svg className="w-full h-full -rotate-90">
                <circle cx="128" cy="128" r="120" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                <motion.circle 
                  cx="128" cy="128" r="120" fill="none" stroke="#0D7377" strokeWidth="8" strokeLinecap="round"
                  initial={{ strokeDasharray: "0 754" }}
                  animate={{ strokeDasharray: `${Math.min((seconds / (target * 3600)) * 754, 754)} 754` }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-gray-800">{formatTime(seconds)}</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Elapsed</span>
              </div>
            </div>

            {seconds / 3600 >= 16 && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="bg-[#14A085] text-white px-6 py-2 rounded-full font-bold text-sm mb-8 shadow-lg shadow-teal-500/30 animate-pulse"
              >
                AUTOPHAGY MODE
              </motion.div>
            )}

            <button 
              onClick={handleEnd}
              className="w-full bg-red-50 text-red-600 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 border border-red-100"
            >
              <Square size={20} fill="currentColor" /> Break Fast
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
