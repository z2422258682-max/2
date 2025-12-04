import { useState, useEffect, useMemo } from 'react';
import { UserSettings, WageStats } from '../types';

export const useWageCalculator = (settings: UserSettings) => {
  const [stats, setStats] = useState<WageStats>({
    perSecond: 0,
    perMinute: 0,
    perDay: 0,
    earnedToday: 0,
    isWorkingHours: false,
    progressPercent: 0
  });

  // Calculate base rates
  const rates = useMemo(() => {
    const { monthlySalary, workingDaysPerMonth, startHour, endHour } = settings;
    const dailyWage = monthlySalary / workingDaysPerMonth;
    
    // Total working seconds per day
    let workHours = endHour - startHour;
    if (workHours <= 0) workHours = 8; // Fallback safety
    
    const totalSeconds = workHours * 3600;
    const perSecond = dailyWage / totalSeconds;
    
    return {
      dailyWage,
      perSecond,
      perMinute: perSecond * 60,
      totalSeconds
    };
  }, [settings]);

  useEffect(() => {
    const calculate = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();
      const currentMs = now.getMilliseconds();
      
      const { startHour, endHour } = settings;
      const { dailyWage, perSecond, totalSeconds } = rates;

      // Determine if we are within working hours
      const startTime = new Date(now);
      startTime.setHours(startHour, 0, 0, 0);
      
      const endTime = new Date(now);
      endTime.setHours(endHour, 0, 0, 0);
      
      let earned = 0;
      let isWorking = false;
      let percent = 0;

      if (now < startTime) {
        // Before work
        earned = 0;
        percent = 0;
        isWorking = false;
      } else if (now >= endTime) {
        // After work
        earned = dailyWage;
        percent = 100;
        isWorking = false;
      } else {
        // During work
        isWorking = true;
        const secondsPassed = (now.getTime() - startTime.getTime()) / 1000;
        earned = secondsPassed * perSecond;
        percent = (secondsPassed / totalSeconds) * 100;
      }

      setStats({
        perSecond: rates.perSecond,
        perMinute: rates.perMinute,
        perDay: rates.dailyWage,
        earnedToday: earned,
        isWorkingHours: isWorking,
        progressPercent: percent
      });
    };

    // Update frequently for smooth ticker
    const timer = setInterval(calculate, 50);
    calculate(); // Initial call

    return () => clearInterval(timer);
  }, [settings, rates]);

  return stats;
};