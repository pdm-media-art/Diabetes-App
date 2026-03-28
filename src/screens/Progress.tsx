import React from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getLevelInfo } from '../lib/utils';

const mockData = [
  { day: 1, val: 115 }, { day: 2, val: 112 }, { day: 3, val: 108 }, { day: 4, val: 110 },
  { day: 5, val: 105 }, { day: 6, val: 102 }, { day: 7, val: 98 }, { day: 8, val: 100 },
  { day: 9, val: 96 }, { day: 10, val: 94 }, { day: 11, val: 95 }, { day: 12, val: 92 }
];

export default function Progress() {
  const { profile } = useApp();
  if (!profile) return null;

  const levelInfo = getLevelInfo(profile.xp_total);

  return (
    <div className="pb-24 p-6 max-w-md mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">Progress</h1>

      {/* XP Card */}
      <section className="bg-white p-6 rounded-3xl border border-gray-100 mb-8 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Current Level</div>
            <div className="text-xl font-bold text-[#0D7377]">{levelInfo.title}</div>
          </div>
          <div className="bg-[#E8F6F3] p-3 rounded-2xl text-2xl">🛡️</div>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((profile.xp_total - levelInfo.xpMin) / (levelInfo.xpMax - levelInfo.xpMin)) * 100}%` }}
            className="h-full bg-[#0D7377]"
          />
        </div>
        <div className="flex justify-between text-[10px] font-bold text-gray-400">
          <span>{profile.xp_total} XP</span>
          <span>{levelInfo.xpMax} XP</span>
        </div>
      </section>

      {/* Glucose Chart */}
      <section className="bg-white p-6 rounded-3xl border border-gray-100 mb-8 shadow-sm">
        <h3 className="text-sm font-bold text-gray-800 mb-6">Fasting Glucose Trend</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="day" hide />
              <YAxis hide domain={[70, 130]} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                labelStyle={{ display: 'none' }}
              />
              <ReferenceLine y={100} stroke="#14A085" strokeDasharray="3 3" />
              <Line 
                type="monotone" dataKey="val" stroke="#0D7377" strokeWidth={3} 
                dot={{ r: 4, fill: '#0D7377', strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between mt-4">
          <StatMini label="Avg Glucose" value="98" unit="mg/dL" />
          <StatMini label="Weight" value="-3.2" unit="kg" />
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Perfect Days" value="8" />
        <StatCard label="GPS Clean" value="24" />
        <StatCard label="Best Streak" value="12" />
        <StatCard label="Lessons" value="10/90" />
      </div>
    </div>
  );
}

function StatMini({ label, value, unit }: any) {
  return (
    <div>
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</div>
      <div className="text-lg font-bold text-gray-800">{value} <span className="text-xs font-normal text-gray-400">{unit}</span></div>
    </div>
  );
}

function StatCard({ label, value }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-2xl font-black text-[#0D7377]">{value}</div>
    </div>
  );
}
