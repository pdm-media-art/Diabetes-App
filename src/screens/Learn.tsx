import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Lock, CheckCircle, ChevronLeft, ArrowRight } from 'lucide-react';

const lessons = [
  { 
    id: 1, 
    title: "Roti is glucose in disguise", 
    cat: "NO GPS", 
    dur: "45s",
    content: "Whole wheat roti is often marketed as healthy, but its glycemic index is nearly identical to white bread. For a diabetic, one roti is essentially a bowl of sugar once digested. Your insulin spikes, fat storage locks, and your reset slows down.",
    takeaway: "Swap roti for cauliflower rice or extra green vegetables to keep insulin low."
  },
  { 
    id: 2, 
    title: "The insulin lock", 
    cat: "Insulin", 
    dur: "60s",
    content: "Insulin is the storage hormone. When it's high, your body is in 'store' mode. It is physiologically impossible to burn body fat while insulin is elevated. By eliminating GPS foods, you lower insulin and 'unlock' your fat stores.",
    takeaway: "Low insulin = Fat burning. High insulin = Fat storage."
  },
  { 
    id: 3, 
    title: "Fasting hour 16", 
    cat: "Fasting", 
    dur: "45s",
    content: "Around the 16th hour of fasting, your body enters a state called Autophagy. This is 'self-eating'—where your cells clean out damaged components and recycle them for energy. It's the ultimate metabolic spring cleaning.",
    takeaway: "16 hours is the magic threshold for cellular repair."
  },
  { id: 4, title: "The GPS diagnosis", cat: "Science", dur: "90s", content: "Grains, Potatoes, and Sugar all break down into glucose rapidly. Your body doesn't see 'healthy oats'—it sees a massive glucose influx that requires an insulin response.", takeaway: "The source doesn't matter; the glucose impact does." },
  { id: 5, title: "Why 'sugar-free' is a trap", cat: "NO GPS", dur: "45s", content: "Many 'sugar-free' snacks use maltitol or other sweeteners that still spike insulin. Always check the total carb count, not just the sugar count.", takeaway: "Total carbs > Sugar-free labels." },
  { id: 6, title: "Autophagy explained", cat: "Science", dur: "120s", content: "Autophagy is your body's way of recycling old parts. It helps reduce inflammation and improves insulin sensitivity over time.", takeaway: "Fasting is a repair mechanism, not just a calorie restriction." },
  { id: 7, title: "The pancreas overload", cat: "Insulin", dur: "60s", content: "Constant snacking and high-carb meals force your pancreas to pump out insulin non-stop. Eventually, it gets exhausted, leading to Type 2 Diabetes.", takeaway: "Give your pancreas a break with fasting and low-carb meals." },
  { id: 8, title: "Gluconeogenesis", cat: "Science", dur: "90s", content: "Your liver can create glucose from protein and fat. You do not need to eat carbohydrates to maintain blood sugar levels.", takeaway: "Carbs are the only non-essential macronutrient." },
  { id: 9, title: "The identity shift", cat: "Identity", dur: "45s", content: "You are not a 'diabetic' managing a disease. You are a conqueror reclaiming your metabolic health. Every meal is a vote for your new identity.", takeaway: "Change your plate, change your identity." },
  { id: 10, title: "Sleep and glucose", cat: "Science", dur: "60s", content: "Poor sleep increases cortisol, which triggers your liver to dump glucose into your blood. One bad night can make you insulin resistant the next day.", takeaway: "Sleep is as important as what you eat." }
];

export default function Learn() {
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  return (
    <div className="pb-24 p-6 max-w-md mx-auto bg-gray-50 min-h-screen">
      <AnimatePresence mode="wait">
        {!selectedLesson ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h1 className="text-2xl font-bold mb-8">Learn Hub</h1>
            <div className="grid grid-cols-1 gap-4">
              {lessons.map((l, i) => (
                <motion.div 
                  key={l.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedLesson(l)}
                  className={`bg-white p-5 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm transition-transform active:scale-[0.98] cursor-pointer`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-[#E8F6F3] text-[#0D7377]`}>
                    <BookOpen size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{l.cat} · {l.dur}</div>
                    <h3 className={`font-bold text-gray-800`}>{l.title}</h3>
                  </div>
                  <CheckCircle size={16} className="text-[#14A085]" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col h-full"
          >
            <button 
              onClick={() => setSelectedLesson(null)}
              className="flex items-center gap-2 text-gray-400 font-bold text-sm mb-8"
            >
              <ChevronLeft size={18} /> Back to Hub
            </button>

            <div className="bg-[#0D7377] p-8 rounded-3xl text-white mb-8 shadow-xl shadow-teal-900/20">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 block mb-2">{selectedLesson.cat}</span>
              <h2 className="text-2xl font-black leading-tight mb-4">{selectedLesson.title}</h2>
              <div className="flex items-center gap-2 text-xs font-bold bg-white/20 w-fit px-3 py-1 rounded-full">
                <BookOpen size={12} /> {selectedLesson.dur} Lesson
              </div>
            </div>

            <div className="prose prose-teal">
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                {selectedLesson.content}
              </p>

              <div className="bg-white p-6 rounded-2xl border-l-4 border-[#14A085] shadow-sm mb-12">
                <span className="text-[10px] font-bold uppercase text-[#14A085] block mb-2">Key Takeaway</span>
                <p className="font-bold text-gray-800">{selectedLesson.takeaway}</p>
              </div>
            </div>

            <button 
              onClick={() => setSelectedLesson(null)}
              className="mt-auto w-full bg-[#0D7377] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              Complete Lesson <ArrowRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
