import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Users, MessageSquare, TrendingUp } from 'lucide-react';

export default function Community() {
  return (
    <div className="pb-24 p-6 max-w-md mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">Community</h1>

      {/* Season Header */}
      <section className="bg-[#0D7377] p-6 rounded-3xl text-white mb-8 shadow-lg shadow-teal-900/20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Season 6</h2>
          <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-bold">Day 23 of 90</span>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <div className="flex justify-between text-[10px] uppercase font-bold mb-1 opacity-70">
              <span>142 / 150 Members</span>
              <span>Rank #34</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white w-[34%]" />
            </div>
          </div>
        </div>
      </section>

      {/* Feed */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Morning Pulse</h3>
        
        <FeedItem emoji="✅" name="Sarah" action="completed 30 days!" time="2m ago" />
        <FeedItem emoji="🩸" name="Ahmad" action="logged 94 mg/dL" time="15m ago" />
        <FeedItem emoji="🔥" name="Elena" action="is on a 14-day streak!" time="1h ago" />
        <FeedItem emoji="🍽" name="Marcus" action="logged a perfect meal" time="2h ago" />
      </div>

      <button className="w-full mt-8 bg-white border border-gray-100 p-4 rounded-2xl font-bold text-[#0D7377] flex items-center justify-center gap-2 shadow-sm">
        <MessageSquare size={18} /> Join the Discussion
      </button>
    </div>
  );
}

function FeedItem({ emoji, name, action, time }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-4 shadow-sm"
    >
      <div className="text-2xl">{emoji}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-600">
          <span className="font-bold text-gray-800">{name}</span> {action}
        </p>
        <span className="text-[10px] text-gray-400">{time}</span>
      </div>
    </motion.div>
  );
}
