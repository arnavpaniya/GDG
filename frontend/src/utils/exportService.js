import { jsPDF } from "jspdf";

/**
 * Nyaya AI - Export Service
 * Handles report generation and data exports.
 */

export const exportToPDF = (analysis, filename = "Nyaya_AI_Report.pdf") => {
  const doc = jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(184, 153, 107); // Accent Gold
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("NYAYA AI", 20, 25);
  
  doc.setFontSize(10);
  doc.text("FAIRNESS ANALYSIS REPORT", 20, 32);
  
  // Content
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(16);
  const score = analysis.score ?? analysis.fairness?.score ?? analysis.after?.score ?? 'N/A';
  doc.text(`Fairness Score: ${score}/100`, 20, 60);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 70);
  
  let y = 90;
  doc.setFont("helvetica", "bold");
  doc.text("Key Findings:", 20, y);
  y += 10;
  
  doc.setFont("helvetica", "normal");
  const findingsList = analysis.findings || analysis.recommendations || (analysis.after ? analysis.after.insights : []) || [];
  const findingsArray = Array.isArray(findingsList) ? findingsList : [];
  
  findingsArray.forEach((finding, index) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    
    doc.setFont("helvetica", "bold");
    const title = typeof finding === 'string' ? `Insight ${index + 1}` : (finding.title || `Insight ${index + 1}`);
    doc.text(`${index + 1}. ${title}`, 20, y);
    y += 7;
    
    doc.setFont("helvetica", "normal");
    const detailText = typeof finding === 'string' ? finding : (finding.detail || finding.text || finding.description || JSON.stringify(finding));
    const splitDescription = doc.splitTextToSize(String(detailText), pageWidth - 40);
    doc.text(splitDescription, 20, y);
    y += (splitDescription.length * 7) + 5;
  });
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Nyaya AI - Ethical Analysis Platform | confidential", pageWidth / 2, 285, { align: "center" });
  
  doc.save(filename);
};

export const exportToJSON = (data, filename = "analysis_data.json") => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToCSV = (data, filename = "analysis_findings.csv") => {
  const headers = "Title,Severity,Description\n";
  const findings = Array.isArray(data) ? data : (data?.findings || data?.recommendations || (data?.after ? data.after.insights : []) || []);
  const rows = findings.map(f => {
    if (typeof f === 'string') return `"Insight","Info","${f.replace(/"/g, '""')}"`;
    return `"${f.title || 'Insight'}","${f.severity || 'Info'}","${(f.detail || f.text || f.description || JSON.stringify(f))?.replace(/"/g, '""') || ''}"`;
  }).join("\n");
  const blob = new Blob([headers + rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportFullChatToJSON = (messages, filename = "nyaya_chat_export.json") => {
  const exportData = {
    exportDate: new Date().toISOString(),
    messages: messages.map(m => ({
      role: m.role,
      content: m.content,
      timestamp: m.createdAt,
      analysis: m.analysis || null,
      structured: m.structured || null
    }))
  };
  exportToJSON(exportData, filename);
};

export const exportFullChatToPDF = (messages, filename = "Nyaya_Chat_History.pdf") => {
  try {
    const doc = jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    // Header
    doc.setFillColor(184, 153, 107); // Accent Gold
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("NYAYA AI - CONVERSATION", margin, 25);
    doc.setFontSize(10);
    doc.text(`EXPORTED ON ${new Date().toLocaleDateString().toUpperCase()}`, margin, 32);

    let y = 55;
    doc.setTextColor(40, 40, 40);

    messages.forEach((msg) => {
      // Check for page overflow
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      const isAI = msg.role === 'assistant' || msg.role === 'system';
      const roleName = isAI ? 'NYAYA AI' : 'USER';
      
      // Role Label
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(isAI ? 184 : 50, isAI ? 153 : 50, isAI ? 107 : 50);
      doc.text(`${roleName}:`, margin, y);
      y += 6;

      // Message Content
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(40, 40, 40);
      
      const content = msg.content || (msg.text) || "";
      if (content) {
        const splitText = doc.splitTextToSize(String(content), contentWidth);
        doc.text(splitText, margin, y);
        y += (splitText.length * 6) + 8;
      } else if (!msg.structured && !msg.analysis) {
        doc.text("[Empty Message]", margin, y);
        y += 10;
      }

      // Structured Data (if any)
      if (isAI && msg.structured) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        const biasRisk = `Bias Risk: ${msg.structured.bias_risk || 'Low'} | Confidence: ${msg.structured.confidence || 'Medium'}`;
        doc.text(biasRisk, margin, y);
        y += 6;
        
        if (msg.structured.reason) {
          doc.setFont("helvetica", "normal");
          const splitReason = doc.splitTextToSize(`Reasoning: ${msg.structured.reason}`, contentWidth);
          doc.text(splitReason, margin, y);
          y += (splitReason.length * 5) + 6;
        }
      }

      // Analysis Report (if any)
      if (isAI && msg.analysis) {
        doc.setFillColor(248, 250, 252); // Light Slate
        doc.setDrawColor(226, 232, 240);
        
        const startY = y - 2;
        const analysisText = [];
        analysisText.push(`ANALYSIS REPORT - Score: ${msg.analysis.score}/100`);
        
        if (msg.analysis.findings) {
          msg.analysis.findings.forEach((f, i) => {
            analysisText.push(`${i+1}. ${f.title}: ${f.severity}`);
          });
        }
        
        const splitAnalysis = doc.splitTextToSize(analysisText.join('\n'), contentWidth - 10);
        const rectHeight = (splitAnalysis.length * 5) + 10;
        
        // Draw box for analysis
        doc.rect(margin - 5, startY, contentWidth + 10, rectHeight, 'FD');
        doc.setTextColor(30, 41, 59);
        doc.setFont("helvetica", "bold");
        doc.text(splitAnalysis, margin, y + 5);
        
        y += rectHeight + 10;
      } else {
        y += 4;
      }
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Nyaya AI - Ethical Analysis Platform | Page ${i} of ${pageCount}`, pageWidth / 2, 285, { align: "center" });
    }
    
    doc.save(filename);
  } catch (error) {
    console.error("PDF Export Error:", error);
    alert("Failed to generate PDF. Please try again.");
  }
};
