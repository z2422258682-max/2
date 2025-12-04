import React, { useState, useEffect, useRef } from 'react';
import { UserSettings, WageStats } from '../types';
import { ICONS } from '../constants';

interface TickerProps {
  stats: WageStats;
  settings: UserSettings;
}

interface Particle {
  id: number;
  left: number; // percentage 0-100
  size: number; // scale
  delay: number;
}

export const Ticker: React.FC<TickerProps> = ({ stats, settings }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const lastSpawnTime = useRef(0);
  
  const formatMoney = (val: number, decimals: number = 2) => {
    return val.toFixed(decimals);
  };

  // Logic to spawn particles when working
  useEffect(() => {
    if (!stats.isWorkingHours) {
      setParticles([]);
      return;
    }

    // Dynamic spawn rate based on salary (higher salary = slightly faster particles, but capped)
    // Base interval is around 800ms, reduced by salary factor
    const spawnRate = Math.max(300, 1500 - (stats.perSecond * 5000));

    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastSpawnTime.current > spawnRate) {
        lastSpawnTime.current = now;
        
        const newParticle: Particle = {
          id: now,
          left: 20 + Math.random() * 60, // Keep within center 60%
          size: 0.8 + Math.random() * 0.4,
          delay: 0
        };

        setParticles(prev => {
          // Keep max 5 particles to prevent DOM overload
          const cleaned = prev.filter(p => now - p.id < 2000); 
          return [...cleaned, newParticle];
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [stats.isWorkingHours, stats.perSecond]);

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-8 w-full">
      
      {/* Main Counter Card */}
      <div className="bg-white rounded-2xl shadow-sm w-full p-8 border border-gray-100 flex flex-col items-center relative overflow-hidden group">
        
        {/* Progress Bar Background with Shimmer */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100">
           <div 
             className="h-full bg-gradient-to-r from-wx-green via-green-400 to-wx-green bg-[length:200%_100%] transition-all duration-300 ease-linear" 
             style={{ 
               width: `${stats.progressPercent}%`,
               animation: stats.isWorkingHours ? 'shimmer 2s linear infinite' : 'none'
             }}
           />
        </div>
        
        {/* Floating Particles Area */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map(p => (
              <div
                key={p.id}
                className="absolute text-green-500 font-bold opacity-0 animate-float select-none flex items-center gap-0.5"
                style={{
                  left: `${p.left}%`,
                  bottom: '40%',
                  fontSize: `${p.size}rem`,
                }}
              >
                <span className="text-[10px]">+</span>{settings.currencySymbol}
              </div>
            ))}
        </div>

        <p className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wide z-10">
          今日已赚
        </p>
        
        <div className="flex items-baseline space-x-1 z-10 relative">
          <span className="text-2xl text-wx-green font-bold translate-y-[-8px]">
            {settings.currencySymbol}
          </span>
          {/* Added pulse effect to the number when working */}
          <span className={`text-6xl font-bold text-gray-800 tabular-nums tracking-tight ${stats.isWorkingHours ? 'animate-pulse' : ''}`} style={{ animationDuration: '3s' }}>
            {formatMoney(stats.earnedToday, 4)}
          </span>
        </div>

        <div className="mt-6 flex gap-2 z-10">
            <span className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-500 ${
                stats.isWorkingHours 
                ? 'bg-green-100 text-green-700 shadow-sm border border-green-200' 
                : 'bg-gray-100 text-gray-500'
            }`}>
                {stats.isWorkingHours ? '⚡️ 正在入账中...' : '☕️ 休息时间'}
            </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 w-full">
         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-md transition-shadow duration-300">
            <div className="p-2 bg-blue-50 text-blue-500 rounded-full mb-2">
                <ICONS.Briefcase className="w-5 h-5" />
            </div>
            <span className="text-xs text-gray-400 uppercase">每秒收入</span>
            <span className="text-xl font-bold text-gray-700 mt-1 tabular-nums">
                {settings.currencySymbol}{formatMoney(stats.perSecond, 4)}
            </span>
         </div>

         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center hover:shadow-md transition-shadow duration-300">
             <div className="p-2 bg-purple-50 text-purple-500 rounded-full mb-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <span className="text-xs text-gray-400 uppercase">每分收入</span>
            <span className="text-xl font-bold text-gray-700 mt-1 tabular-nums">
                {settings.currencySymbol}{formatMoney(stats.perMinute, 2)}
            </span>
         </div>
      </div>

      {/* Motivational / Context Card */}
      <div className="bg-wx-bg w-full rounded-xl p-4 text-center">
          <p className="text-gray-500 text-sm">
            今日目标: <span className="font-bold text-gray-700">{settings.currencySymbol}{formatMoney(stats.perDay, 0)}</span>
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3 overflow-hidden">
            <div 
                className="bg-wx-green h-2.5 rounded-full transition-all duration-1000 relative" 
                style={{ width: `${stats.progressPercent}%` }}
            >
                {/* Subtle shine on the bottom progress bar too */}
                {stats.isWorkingHours && (
                    <div className="absolute inset-0 bg-white/30 w-full h-full animate-shimmer" 
                         style={{ backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)', backgroundSize: '200% 100%' }} 
                    />
                )}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-right">{stats.progressPercent.toFixed(1)}%</p>
      </div>

    </div>
  );
};