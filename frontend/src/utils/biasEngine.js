/**
 * Nyaya AI - Bias Detection Engine (Advanced)
 * Performs client-side statistical analysis on dataset summaries.
 */

export const calculateDisparateImpact = (data, attribute, outcome, positiveValue) => {
  if (!data || data.length === 0) return null;

  const groups = {};
  
  data.forEach(row => {
    const val = row[attribute] || 'Unknown';
    if (!groups[val]) {
      groups[val] = { total: 0, positive: 0 };
    }
    groups[val].total++;
    // Robust positive value check
    const isPositive = String(row[outcome]).toLowerCase() === String(positiveValue).toLowerCase();
    if (isPositive) {
      groups[val].positive++;
    }
  });

  const analysis = Object.keys(groups).map(group => ({
    group,
    attribute,
    count: groups[group].total,
    positiveRate: groups[group].positive / groups[group].total,
  }));

  // Find max positive rate to compare against (privileged group)
  const maxRate = Math.max(...analysis.map(a => a.positiveRate)) || 0;
  
  return analysis.map(a => ({
    ...a,
    impactRatio: maxRate === 0 ? 1 : a.positiveRate / maxRate,
    isBiased: maxRate === 0 ? false : (a.positiveRate / maxRate) < 0.8, // 80% rule
  }));
};

/**
 * Detects bias across combinations of multiple attributes
 */
export const calculateIntersectionalBias = (data, attributes, outcome, positiveValue) => {
  if (!data || data.length === 0 || !attributes || attributes.length < 2) return null;

  const combinedAttr = `Intersectional (${attributes.join(' + ')})`;
  const dataWithCombined = data.map(row => ({
    ...row,
    [combinedAttr]: attributes.map(attr => row[attr] || 'N/A').join(' & ')
  }));

  return calculateDisparateImpact(dataWithCombined, combinedAttr, outcome, positiveValue);
};

export const getFairnessScore = (allGroupResults) => {
  if (!allGroupResults || allGroupResults.length === 0) return 100;
  
  const minRatio = Math.min(...allGroupResults.map(a => a.impactRatio));
  // Fairness score is based on the single largest disparity found
  return Math.max(0, Math.min(100, Math.round(minRatio * 100)));
};
