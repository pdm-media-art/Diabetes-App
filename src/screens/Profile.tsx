import React from 'react';
import { motion } from 'motion/react';
import { Settings, LogOut, Shield, Award, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getLevelInfo } from '../lib/utils';

export default function Profile() {
  const { profile } = useApp();
  if (!profile) return null;

  const levelInfo = getLevelInfo(profile.xp_total);

  return (
    <div className="pb-24 p-6 max-w-md mx-auto bg-gray-50 min-h-screen">
      <div className="flex flex-col items-center mb-10">
        <div className="relative mb-4">
          <div className="w-24 h-24 bg-[#0D7377] rounded-full flex items-center justify-center text-4xl border-4 border-white shadow-xl">
            {profile.name[0]}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-[#D4AC0D] p-2 rounded-xl border-2 border-white shadow-lg">
            <Shield size={16} className="text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
        <span className="text-sm font-bold text-[#0D7377]">{levelInfo.title}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
          <div className="text-2xl font-black text-gray-800">12</div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Perfect Days</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 text-center">
          <div className="text-2xl font-black text-gray-800">24</div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">GPS Clean</div>
        </div>
      </div>

      <div className="space-y-3">
        <ProfileLink icon={<Award size={18} />} label="Badges & Achievements" />
        <ProfileLink icon={<Settings size={18} />} label="Account Settings" />
        <ProfileLink icon={<Shield size={18} />} label="Privacy & Security" />
        <ProfileLink icon={<LogOut size={18} />} label="Logout" color="text-red-500" />
      </div>

      <div className="mt-12 bg-white p-6 rounded-3xl border border-gray-100 text-center">
        <p className="text-sm text-gray-500 mb-4">Want to dive deeper into the science?</p>
        <button className="w-full bg-[#0D7377] text-white py-4 rounded-xl font-bold">Get The Book</button>
      </div>
    </div>
  );
}

function ProfileLink({ icon, label, color = "text-gray-600" }: any) {
  return (
    <button className="w-full bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm active:scale-[0.98] transition-transform">
      <div className={color}>{icon}</div>
      <span className="flex-1 text-left font-bold text-gray-700">{label}</span>
      <ChevronRight size={16} className="text-gray-300" />
    </button>
  );
}
