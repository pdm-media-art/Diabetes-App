import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, CheckCircle2, AlertTriangle, Ban, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function MealLogging({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [description, setDescription] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { refreshData } = useApp();

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/meals/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
      });
      const data = await res.json();
      setAnalysis(data);
      setStep(2);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLog = async () => {
    await fetch('/api/meals/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description,
        gps_status: analysis.gps_status,
        gps_items_detected: analysis.detected_items,
        suggested_swap: analysis.suggested_swap,
        xp_earned: analysis.xp_impact
      })
    });
    setStep(3);
    setTimeout(() => {
      refreshData();
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="bg-white w-full max-w-md rounded-t-3xl p-6 min-h-[60vh]"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Log Meal</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="relative mb-6">
                <textarea 
                  placeholder="What did you eat?"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#0D7377] min-h-[120px]"
                />
                <div className="absolute bottom-4 right-4 text-[#0D7377]"><Search size={20} /></div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-8">
                {['Protein', 'Vegetables', 'Fat', 'Carb'].map(cat => (
                  <button key={cat} onClick={() => setDescription(d => d + (d ? ', ' : '') + cat)} className="p-3 bg-gray-50 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100">
                    {cat}
                  </button>
                ))}
              </div>

              <button 
                onClick={handleAnalyze}
                disabled={!description || loading}
                className="w-full bg-[#0D7377] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Analyzing..." : <><Sparkles size={20} /> GPS Guard Scan</>}
              </button>
            </motion.div>
          )}

          {step === 2 && analysis && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex flex-col items-center text-center mb-8">
                <div className="mb-4">
                  {analysis.gps_status === 'CLEAR' ? <CheckCircle2 size={64} className="text-green-500" /> : 
                   analysis.gps_status === 'ALERT' ? <AlertTriangle size={64} className="text-orange-500" /> : 
                   <Ban size={64} className="text-red-500" />}
                </div>
                <h3 className={cn("text-2xl font-black mb-2", 
                  analysis.gps_status === 'CLEAR' ? "text-green-600" : 
                  analysis.gps_status === 'ALERT' ? "text-orange-600" : "text-red-600"
                )}>
                  {analysis.gps_status}
                </h3>
                <p className="text-gray-600 px-4">{analysis.feedback_message}</p>
              </div>

              {analysis.detected_items.length > 0 && (
                <div className="mb-6">
                  <span className="text-[10px] font-bold uppercase text-gray-400 block mb-2">Detected GPS Items</span>
                  <div className="flex flex-wrap gap-2">
                    {analysis.detected_items.map((item: string) => (
                      <span key={item} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold">{item}</span>
                    ))}
                  </div>
                </div>
              )}

              {analysis.suggested_swap && (
                <div className="bg-green-50 p-4 rounded-2xl mb-8 border border-green-100">
                  <span className="text-[10px] font-bold uppercase text-green-600 block mb-1">Suggested Swap</span>
                  <p className="text-sm font-medium text-green-800">{analysis.suggested_swap}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-4 bg-gray-100 rounded-xl font-bold">Change</button>
                <button onClick={handleLog} className="flex-2 py-4 bg-[#0D7377] text-white rounded-xl font-bold">Log It (+{analysis.xp_impact} XP)</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-2xl font-bold mb-2">Meal Logged!</h3>
              <div className="text-[#D4AC0D] font-black text-xl">+25 XP</div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
