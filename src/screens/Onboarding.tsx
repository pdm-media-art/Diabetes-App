import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AppColors } from '../lib/utils';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    yearsWithDiabetes: 5,
    weight: 85,
    glucose: 110,
    hba1c: 6.5,
    medication: false,
    intensity: 'standard',
    name: ''
  });
  const { updateProfile } = useApp();
  const navigate = useNavigate();

  const nextStep = () => setStep(s => s + 1);

  const handleFinish = async () => {
    await updateProfile({
      name: formData.name,
      onboarding_intensity: formData.intensity,
      baseline_weight_kg: formData.weight,
      baseline_glucose: formData.glucose,
      baseline_hba1c: formData.hba1c
    });
    navigate('/home');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full text-center p-8 bg-black text-white"
          >
            <h2 className="text-2xl font-bold mb-8">For how many years has diabetes controlled your life?</h2>
            <input 
              type="range" min="0" max="40" value={formData.yearsWithDiabetes}
              onChange={(e) => setFormData({...formData, yearsWithDiabetes: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#0D7377] mb-4"
            />
            <div className="text-4xl font-bold mb-8">{formData.yearsWithDiabetes} Years</div>
            <p className="text-gray-400 mb-12">This ends now.</p>
            <button 
              onClick={nextStep}
              className="w-full bg-[#0D7377] py-4 rounded-xl font-bold text-lg"
            >
              BEGIN MY RESET
            </button>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            className="flex flex-col items-center justify-center h-full p-8 bg-white text-black"
          >
            <div className="bg-gray-50 p-8 rounded-2xl shadow-sm mb-8 text-center italic">
              "You are starting a 90-Day Metabolic Reset. This is not a diet. This is a decision."
            </div>
            <h3 className="text-xl font-bold mb-4 text-[#0D7377]">The NO GPS Method</h3>
            <p className="text-center mb-8">No Grains. No Potatoes. No Sugar.</p>
            <div className="grid grid-cols-3 gap-4 mb-12">
              <div className="text-center">🚫<br/><span className="text-xs">Grains</span></div>
              <div className="text-center">🚫<br/><span className="text-xs">Potatoes</span></div>
              <div className="text-center">🚫<br/><span className="text-xs">Sugar</span></div>
            </div>
            <button 
              onClick={nextStep}
              className="w-full bg-[#0D7377] text-white py-4 rounded-xl font-bold"
            >
              I'm Ready
            </button>
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            className="flex flex-col h-full p-8 bg-white"
          >
            <h2 className="text-2xl font-bold mb-8">Baseline Stats</h2>
            <div className="space-y-6 mb-12">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Weight (kg)</label>
                <input type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})} className="w-full p-3 border rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fasting Glucose (mg/dL)</label>
                <input type="number" value={formData.glucose} onChange={e => setFormData({...formData, glucose: parseInt(e.target.value)})} className="w-full p-3 border rounded-xl" />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span>Taking medication?</span>
                <input type="checkbox" checked={formData.medication} onChange={e => setFormData({...formData, medication: e.target.checked})} className="w-6 h-6" />
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mb-8">This app is not a medical device. Consult your doctor before changing medication.</p>
            <button onClick={nextStep} className="w-full bg-[#0D7377] text-white py-4 rounded-xl font-bold">Continue</button>
          </motion.div>
        );
      case 4:
        return (
          <motion.div 
            initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            className="flex flex-col h-full p-8 bg-white"
          >
            <h2 className="text-2xl font-bold mb-8">Choose Your Path</h2>
            <div className="space-y-4 mb-12">
              {[
                { id: 'beginner', label: 'Beginner', desc: 'Reduce GPS foods gradually. Best for first-timers.', color: 'green' },
                { id: 'standard', label: 'Standard', desc: 'Full GPS elimination from Day 1. Proven method.', color: 'blue' },
                { id: 'warrior', label: 'Warrior', desc: 'GPS elimination + daily fasting. Maximum results.', color: 'red' }
              ].map(p => (
                <div 
                  key={p.id}
                  onClick={() => setFormData({...formData, intensity: p.id})}
                  className={cn(
                    "p-4 border-2 rounded-2xl cursor-pointer transition-all",
                    formData.intensity === p.id ? "border-[#0D7377] bg-[#E8F6F3]" : "border-gray-100"
                  )}
                >
                  <div className="font-bold flex items-center gap-2">
                    <span className={cn("w-3 h-3 rounded-full", `bg-${p.color}-500`)}></span>
                    {p.label}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{p.desc}</p>
                </div>
              ))}
            </div>
            <button onClick={nextStep} className="w-full bg-[#0D7377] text-white py-4 rounded-xl font-bold">Continue</button>
          </motion.div>
        );
      case 5:
        return (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center h-full p-8 bg-white text-center"
          >
            <h2 className="text-2xl font-bold mb-8">Identity Contract</h2>
            <input 
              placeholder="What is your name?"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full p-4 border-b-2 border-[#0D7377] text-center text-xl mb-12 focus:outline-none"
            />
            <div className="bg-[#E8F6F3] p-6 rounded-full w-32 h-32 flex flex-col items-center justify-center mb-4">
              <span className="text-4xl">🛡️</span>
            </div>
            <div className="font-bold text-[#0D7377] mb-12">Metabolic Beginner — Level 1</div>
            <button 
              onClick={handleFinish}
              disabled={!formData.name}
              className="w-full bg-[#0D7377] text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50"
            >
              START DAY 1
            </button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto overflow-hidden relative">
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
