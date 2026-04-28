"use client";

import React from 'react';
import { motion } from 'framer-motion';

const BiasGauge = ({ score = 0, size = 120, label = "Fairness Score" }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = (Math.max(0, Math.min(score, 100)) / 100) * circumference;
  const offset = circumference - progress;
  
  const getColor = () => {
    if (score >= 80) return '#22c55e'; // Green
    if (score >= 60) return '#facc15'; // Yellow
    return '#ef4444'; // Red
  };

  const color = getColor();

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          {/* Track */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="10"
          />
          {/* Progress */}
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth="10"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 4px ${color}44)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-bold text-white"
          >
            {score}
          </motion.span>
          <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">
            / 100
          </span>
        </div>
      </div>
      <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {label}
      </p>
    </div>
  );
};

export default BiasGauge;
