import Papa from 'papaparse';
import { calculateDisparateImpact, calculateIntersectionalBias, getFairnessScore } from './biasEngine';

const SENSITIVE_ATTRIBUTES = ['gender', 'race', 'age', 'ethnicity', 'religion', 'disability', 'sex', 'nationality', 'caste'];
const OUTCOME_KEYWORDS = ['hired', 'approved', 'admitted', 'promoted', 'loan_status', 'outcome', 'target', 'label', 'decision'];

export const analyzeCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data;
        const columns = results.meta.fields;

        if (!data || data.length === 0) {
          resolve({ error: "The CSV file appears to be empty." });
          return;
        }

        // Identify ALL sensitive attributes
        const sensitiveAttrs = columns.filter(c => 
          SENSITIVE_ATTRIBUTES.some(sa => c.toLowerCase().includes(sa))
        );
        
        const outcomeAttr = columns.find(c => 
          OUTCOME_KEYWORDS.some(ok => c.toLowerCase().includes(ok))
        );

        if (sensitiveAttrs.length === 0 || !outcomeAttr) {
          resolve({
            error: "Could not automatically identify sensitive attributes (e.g., gender, race) or outcome variables (e.g., hired).",
            columns
          });
          return;
        }

        // Detect positive outcome value
        const sampleOutcomes = data.map(d => d[outcomeAttr]).filter(Boolean);
        const positiveValue = sampleOutcomes.find(v => 
          ['1', 'yes', 'true', 'approved', 'hired', 'positive', 'passed'].includes(v?.toString().toLowerCase())
        ) || sampleOutcomes[0];

        let allGroupResults = [];
        
        // Analyze each sensitive attribute
        sensitiveAttrs.forEach(attr => {
          const analysis = calculateDisparateImpact(data, attr, outcomeAttr, positiveValue);
          if (analysis) allGroupResults = [...allGroupResults, ...analysis];
        });

        // Add intersectional analysis for the first two attributes if applicable
        if (sensitiveAttrs.length >= 2) {
          const intersectional = calculateIntersectionalBias(data, sensitiveAttrs.slice(0, 2), outcomeAttr, positiveValue);
          if (intersectional) allGroupResults = [...allGroupResults, ...intersectional];
        }

        const score = getFairnessScore(allGroupResults);

        // Generate prioritized findings
        const findings = allGroupResults
          .filter(a => a.isBiased)
          .sort((a, b) => a.impactRatio - b.impactRatio) // Most biased first
          .map(a => ({
            title: `Bias Found: ${a.group}`,
            description: `Attribute: ${a.attribute}. Disparity detected for "${a.group}".`,
            severity: a.impactRatio < 0.5 ? 'HIGH' : 'MODERATE',
            detail: `The impact ratio for group "${a.group}" is ${(a.impactRatio * 100).toFixed(1)}%. This is significantly below the 80% rule threshold compared to the best-performing group.`
          }));

        if (findings.length === 0 && score === 100) {
          findings.push({
            title: "High Fairness Score",
            description: "No statistically significant bias detected across the identified categories.",
            severity: "LOW",
            detail: "The analysis confirms that selection rates across all sensitive groups meet the legal 80% rule threshold."
          });
        }

        resolve({
          score,
          findings: findings.slice(0, 8), // Cap at 8 key findings
          sensitiveAttrs,
          outcomeAttr,
          rowCount: data.length
        });
      },
      error: (err) => reject(err)
    });
  });
};
