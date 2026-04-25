import React from 'react';

const FairnessScoreRing = ({ score = 0 }) => {
  const circumference = 345;
  const progress = (Math.max(0, Math.min(score, 100)) / 100) * circumference;
  const offset = circumference - progress;
  
  // Determine color based on semantic tokens
  const getColor = () => {
    if (score >= 75) return 'var(--color-score-fair)';
    if (score >= 50) return 'var(--color-score-warn)';
    return 'var(--color-score-bias)';
  };

  return (
    <div className="flex flex-col items-center gap-compact">
      <div className="relative w-[120px] h-[120px]">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background Ring */}
          <circle
            cx="60"
            cy="60"
            r="55"
            fill="transparent"
            stroke="var(--color-border)"
            strokeWidth="10"
          />
          {/* Animated Score Ring */}
          <circle
            cx="60"
            cy="60"
            r="55"
            fill="transparent"
            stroke={getColor()}
            strokeWidth="10"
            strokeDasharray="345"
            style={{ 
              strokeDashoffset: offset,
              transition: 'stroke-dashoffset 1.2s ease-out'
            }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-medium text-text-primary">{score}</span>
          <span className="text-[10px] text-text-secondary uppercase tracking-wider">Score</span>
        </div>
      </div>
    </div>
  );
};

export default FairnessScoreRing;
