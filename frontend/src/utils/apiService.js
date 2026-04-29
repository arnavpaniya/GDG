/**
 * Nyaya AI - Backend API Service
 * Handles all communication with the Node.js backend and ML service
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_PATH || '/api/v1';

class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Base fetch wrapper with error handling
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_URL}${API_BASE}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        data.message || 'API request failed',
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    // Network or parsing errors
    throw new APIError(
      error.message || 'Network error occurred',
      0,
      { originalError: error }
    );
  }
}

/**
 * Check backend and ML service health
 */
export async function checkServiceStatus() {
  return apiFetch('/analyze/status');
}

/**
 * Get list of available datasets and mitigation options
 */
export async function getAvailableDatasets() {
  return apiFetch('/analyze/datasets');
}

/**
 * Upload CSV file for instant bias analysis (JavaScript-based)
 * @param {File} file - CSV file to analyze
 * @returns {Promise} Analysis results
 */
export async function uploadAndAnalyze(file) {
  const formData = new FormData();
  formData.append('dataset', file);

  const url = `${API_URL}${API_BASE}/analyze/upload`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary
    });

    const data = await response.json();

    if (!response.ok) {
      throw new APIError(
        data.message || 'Upload failed',
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      error.message || 'Upload error occurred',
      0,
      { originalError: error }
    );
  }
}

/**
 * Run full ML pipeline analysis
 * @param {Object} params
 * @param {string} params.dataset - 'biased' or 'fair'
 * @param {string} params.mitigation - 'reweighting' or 'smote'
 * @returns {Promise} ML analysis results with before/after comparison
 */
export async function runMLAnalysis({ dataset = 'biased', mitigation = 'reweighting' }) {
  return apiFetch('/analyze/ml', {
    method: 'POST',
    body: JSON.stringify({ dataset, mitigation }),
  });
}

/**
 * Run ML analysis on built-in dataset (convenience method)
 * @param {Object} params
 * @param {string} params.dataset - 'biased' or 'fair'
 * @param {string} params.mitigation - 'reweighting' or 'smote'
 * @returns {Promise} ML analysis results
 */
export async function analyzeBuiltinDataset({ dataset = 'biased', mitigation = 'reweighting' }) {
  return apiFetch(`/analyze/builtin?dataset=${dataset}&mitigation=${mitigation}`);
}

/**
 * Send a chat message to the Gemini-powered backend API
 * @param {string} message - The user's message
 * @param {Object} context - Optional context about current dataset/analysis
 * @returns {Promise} Response from Gemini
 */
export async function sendChatMessage(message, context = null) {
  return apiFetch('/chat', {
    method: 'POST',
    body: JSON.stringify({ message, context }),
  });
}

/**
 * Format analysis results for chat display
 */
export function formatAnalysisForChat(apiResponse) {
  const { data } = apiResponse;
  
  if (!data) return null;

  // Handle upload response (JS-based analysis)
  if (data.dataset && data.bias) {
    return {
      type: 'upload',
      dataset: {
        filename: data.dataset.filename,
        rowCount: data.dataset.rowCount,
        headers: data.dataset.headers,
      },
      fairness: {
        score: data.fairness.groundTruth?.fairnessScore || 0,
        disparateImpact: data.fairness.groundTruth?.disparateImpact || 0,
        biasExists: data.fairness.groundTruth?.biasExists || false,
        disadvantagedGroup: data.fairness.groundTruth?.disadvantagedGroup,
        privilegedGroup: data.fairness.groundTruth?.privilegedGroup,
      },
      recommendations: data.recommendations || [],
      mlAvailable: data.mlAvailable,
    };
  }

  // Handle ML analysis response
  if (data.mlResult) {
    return {
      type: 'ml',
      dataset: data.dataset,
      mitigation: data.mitigation,
      before: {
        score: data.mlResult.before?.fairness_score || 0,
        disparateImpact: data.mlResult.before?.disparate_impact || 0,
        biasExists: data.mlResult.before?.bias_exists || false,
        verdict: data.mlResult.before?.verdict,
        selectionRates: data.mlResult.before?.selection_rates || {},
        insights: data.mlResult.before?.insights || [],
      },
      after: {
        score: data.mlResult.after?.fairness_score || 0,
        disparateImpact: data.mlResult.after?.disparate_impact || 0,
        biasExists: data.mlResult.after?.bias_exists || false,
        verdict: data.mlResult.after?.verdict,
        selectionRates: data.mlResult.after?.selection_rates || {},
        insights: data.mlResult.after?.insights || [],
      },
      comparison: data.mlResult.comparison || {},
      recommendations: data.recommendations || [],
      mitigationReport: data.mitigationReport,
    };
  }

  return null;
}

/**
 * Generate human-readable summary from analysis results
 */
export function generateAnalysisSummary(formattedData) {
  if (!formattedData) return 'Analysis failed to complete.';

  if (formattedData.type === 'upload') {
    const { fairness, dataset } = formattedData;
    const score = fairness.score;
    
    let summary = `📊 **Analysis Complete for ${dataset.filename}**\n\n`;
    summary += `**Fairness Score:** ${score}/100\n`;
    summary += `**Disparate Impact:** ${(fairness.disparateImpact * 100).toFixed(1)}%\n\n`;
    
    if (fairness.biasExists) {
      summary += `⚠️ **Bias Detected**\n`;
      summary += `The disadvantaged group is **${fairness.disadvantagedGroup}** `;
      summary += `compared to **${fairness.privilegedGroup}**.\n\n`;
    } else {
      summary += `✅ **No Significant Bias Detected**\n\n`;
    }
    
    if (formattedData.recommendations.length > 0) {
      summary += `**Recommendations:**\n`;
      formattedData.recommendations.slice(0, 3).forEach((rec, i) => {
        const text = typeof rec === 'string' ? rec : (rec.text || rec.description || rec.title || JSON.stringify(rec));
        summary += `${i + 1}. ${text}\n`;
      });
    }
    
    return summary;
  }

  if (formattedData.type === 'ml') {
    const { before, after, comparison } = formattedData;
    
    let summary = `🤖 **ML Analysis Complete**\n\n`;
    summary += `**Before Mitigation:**\n`;
    summary += `- Fairness Score: ${before.score}/100 ${before.verdict}\n`;
    summary += `- Disparate Impact: ${(before.disparateImpact * 100).toFixed(1)}%\n\n`;
    
    summary += `**After Mitigation (${formattedData.mitigation}):**\n`;
    summary += `- Fairness Score: ${after.score}/100 ${after.verdict}\n`;
    summary += `- Disparate Impact: ${(after.disparateImpact * 100).toFixed(1)}%\n\n`;
    
    if (comparison.improved) {
      summary += `✅ **Improvement:** +${comparison.fs_delta} points\n\n`;
    } else {
      summary += `⚠️ Mitigation did not improve fairness significantly.\n\n`;
    }
    
    if (after.insights && after.insights.length > 0) {
      summary += `**Key Insights:**\n`;
      after.insights.slice(0, 2).forEach(insight => {
        summary += `- ${insight}\n`;
      });
    }
    
    return summary;
  }

  return 'Analysis completed.';
}

export default {
  checkServiceStatus,
  getAvailableDatasets,
  uploadAndAnalyze,
  runMLAnalysis,
  analyzeBuiltinDataset,
  sendChatMessage,
  formatAnalysisForChat,
  generateAnalysisSummary,
  APIError,
};
