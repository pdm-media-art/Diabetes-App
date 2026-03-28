import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Splash() {
  const navigate = useNavigate();
  const { profile, loading } = useApp();

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        if (profile && profile.name && profile.name !== "Guest") {
          navigate('/home');
        } else {
          navigate('/onboarding');
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loading, profile, navigate]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0D7377]">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center shadow-2xl"
      >
        <span className="text-5xl">🛡️</span>
      </motion.div>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-white text-2xl font-black tracking-tighter"
      >
        90-DAY RESET
      </motion.h1>
    </div>
  );
}
