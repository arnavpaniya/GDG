"use client";

import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';

/**
 * Displays ML analysis results with before/after comparison
 */
const MLAnalysisCard = ({ analysis }) => {
  if (!analysis || analysis.type !== 'ml') return null;

  const { before, after, comparison, mitigation } = analysis;
  const improved = comparison?.improved;
  const scoreDelta = comparison?.fs_delta || 0;

  return (
    <div className="bg-bg-surface border border-border rounded-card p-comfortable shadow-soft space-y-section">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-compact">
          <BarChart3 className="text-accent-blue" size={20} />
          <h3 className="font-bold text-text-primary">ML Pipeline Analysis</h3>
        </div>
        <span className="text-xs text-text-tertiary uppercase tracking-wider">
          Mitigation: {mitigation}
        </span>
      </div>

      {/* Before/After Comparison */}
      <div className="grid md:grid-cols-2 gap-base">
        {/* Before */}
        <div className="bg-bg-primary border border-border rounded-lg p-base">
          <div className="text-xs text-text-tertiary uppercase tracking-wider mb-compact">
            Before Mitigation
          </div>
          <div className="space-y-compact">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Fairness Score</span>
              <span className="text-2xl font-bold text-text-primary">{before.score}/100</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Disparate Impact</span>
              <span className="text-lg font-semibold text-text-primary">
                {(before.disparateImpact * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center gap-compact mt-base">
              {before.biasExists ? (
                <>
                  <AlertTriangle size={16} className="text-accent-red" />
                  <span className="text-xs text-accent-red font-semibold">{before.verdict}</span>
                </>
              ) : (
                <>
                  <CheckCircle size={16} className="text-accent-teal" />
                  <span className="text-xs text-accent-teal font-semibold">Fair</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* After */}
        <div className="bg-bg-primary border border-accent-gold/30 rounded-lg p-base">
          <div className="text-xs text-accent-gold uppercase tracking-wider mb-compact">
            After Mitigation
          </div>
          <div className="space-y-compact">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Fairness Score</span>
              <div className="flex items-center gap-compact">
                <span className="text-2xl font-bold text-text-primary">{after.score}/100</span>
                {improved && (
                  <div className="flex items-center gap-1 text-accent-teal text-xs font-bold">
                    <TrendingUp size={14} />
                    +{scoreDelta}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Disparate Impact</span>
              <span className="text-lg font-semibold text-text-primary">
                {(after.disparateImpact * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center gap-compact mt-base">
              {after.biasExists ? (
                <>
                  <AlertTriangle size={16} className="text-accent-gold" />
                  <span className="text-xs text-accent-gold font-semibold">{after.verdict}</span>
                </>
              ) : (
                <>
                  <CheckCircle size={16} className="text-accent-teal" />
                  <span className="text-xs text-accent-teal font-semibold">Fair</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Selection Rates */}
      {after.selectionRates && Object.keys(after.selectionRates).length > 0 && (
        <div className="bg-bg-primary border border-border rounded-lg p-base">
          <div className="text-xs text-text-tertiary uppercase tracking-wider mb-compact">
            Selection Rates (After)
          </div>
          <div className="grid grid-cols-2 gap-base">
            {Object.entries(after.selectionRates).map(([group, rate]) => (
              <div key={group} className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">{group}</span>
                <span className="text-base font-semibold text-text-primary">
                  {(rate * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {after.insights && after.insights.length > 0 && (
        <div className="space-y-compact">
          <div className="text-xs text-text-tertiary uppercase tracking-wider">Key Insights</div>
          <ul className="space-y-compact">
            {after.insights.slice(0, 3).map((insight, idx) => (
              <li key={idx} className="text-sm text-text-secondary flex items-start gap-compact">
                <span className="text-accent-gold mt-1">•</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Improvement Summary */}
      {improved !== undefined && (
        <div className={`rounded-lg p-base border ${
          improved 
            ? 'bg-accent-teal/5 border-accent-teal/30' 
            : 'bg-accent-red/5 border-accent-red/30'
        }`}>
          <div className="flex items-center gap-compact">
            {improved ? (
              <>
                <TrendingUp className="text-accent-teal" size={18} />
                <span className="text-sm font-semibold text-accent-teal">
                  Mitigation improved fairness by {scoreDelta} points
                </span>
              </>
            ) : (
              <>
                <TrendingDown className="text-accent-red" size={18} />
                <span className="text-sm font-semibold text-accent-red">
                  Mitigation did not significantly improve fairness
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MLAnalysisCard;
