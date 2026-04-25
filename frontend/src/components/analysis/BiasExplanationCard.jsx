import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

const BiasExplanationCard = ({ title, description, severity = 'LOW', detail }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const severityColors = {
    HIGH: 'var(--color-accent-red)',
    MODERATE: 'var(--color-accent-amber)',
    LOW: 'var(--color-accent-teal)',
  };

  return (
    <div 
      className="bg-bg-surface rounded-card shadow-soft overflow-hidden transition-all duration-base"
      style={{ borderLeft: `3px solid ${severityColors[severity]}` }}
    >
      <div 
        className="p-comfortable flex justify-between items-start cursor-pointer hover:bg-black/[0.02]"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex gap-comfortable items-start">
          <div className="mt-0.5">
            <AlertCircle size={20} style={{ color: severityColors[severity] }} />
          </div>
          <div className="flex flex-col gap-tight">
            <h3 className="text-sm font-medium text-text-primary">{title}</h3>
            <p className="text-xs text-text-secondary leading-relaxed">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-compact">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-pill bg-black/5`} style={{ color: severityColors[severity] }}>
            {severity}
          </span>
          {isExpanded ? <ChevronUp size={16} className="text-text-tertiary" /> : <ChevronDown size={16} className="text-text-tertiary" />}
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-comfortable pb-comfortable pt-0 border-t border-border mt-2 animate-in fade-in duration-300">
          <p className="text-xs text-text-secondary leading-relaxed pt-comfortable">
            {detail}
          </p>
        </div>
      )}
    </div>
  );
};

export default BiasExplanationCard;
