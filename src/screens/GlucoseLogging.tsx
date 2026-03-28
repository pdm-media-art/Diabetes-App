import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function GlucoseLogging({ onClose }: { onClose: () => void }) {
  const [value, setValue] = useState(110);
  const [type, setType] = useState<'fasting' | 'postmeal'>('fasting');
  const { refreshData } = useApp();

  const handleLog = async () => {
    await fetch('/api/logs/glucose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value, type })
    });
    refreshData();
    onClose();
  };

  const getColor = (v: number) => {
    if (v <= 100) return 'text-green-500';
    if (v <= 125) return 'text-yellow-500';
    if (v <= 180) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <motion.div 
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        className="bg-white w-full max-w-md rounded-t-3xl p-8 min-h-[60vh]"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">Log Glucose</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
        </div>

        <div className="flex flex-col items-center mb-12">
          <div className={`text-7xl font-black mb-4 ${getColor(value)}`}>{value}</div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">mg/dL</div>
          
          <input 
            type="range" min="40" max="400" value={value}
            onChange={e => setValue(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#0D7377] mt-8"
          />
        </div>

        <div className="flex gap-3 mb-12">
          <button 
            onClick={() => setType('fasting')}
            className={`flex-1 py-4 rounded-2xl font-bold border-2 transition-all ${type === 'fasting' ? 'border-[#0D7377] bg-[#E8F6F3] text-[#0D7377]' : 'border-gray-100 text-gray-500'}`}
          >
            Fasting
          </button>
          <button 
            onClick={() => setType('postmeal')}
            className={`flex-1 py-4 rounded-2xl font-bold border-2 transition-all ${type === 'postmeal' ? 'border-[#0D7377] bg-[#E8F6F3] text-[#0D7377]' : 'border-gray-100 text-gray-500'}`}
          >
            Post-meal
          </button>
        </div>

        <button 
          onClick={handleLog}
          className="w-full bg-[#0D7377] text-white py-5 rounded-2xl font-bold text-lg"
        >
          Log Reading
        </button>

        <button className="w-full mt-6 flex items-center justify-center gap-2 text-sm font-bold text-gray-400">
          What affects your reading? <ChevronRight size={16} />
        </button>
      </motion.div>
    </div>
  );
}
