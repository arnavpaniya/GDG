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
  doc.text(`Fairness Score: ${analysis.score}/100`, 20, 60);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 70);
  
  let y = 90;
  doc.setFont("helvetica", "bold");
  doc.text("Key Findings:", 20, y);
  y += 10;
  
  doc.setFont("helvetica", "normal");
  analysis.findings.forEach((finding, index) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    
    doc.setFont("helvetica", "bold");
    doc.text(`${index + 1}. ${finding.title}`, 20, y);
    y += 7;
    
    doc.setFont("helvetica", "normal");
    const splitDescription = doc.splitTextToSize(finding.detail, pageWidth - 40);
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

export const exportToCSV = (findings, filename = "analysis_findings.csv") => {
  const headers = "Title,Severity,Description\n";
  const rows = findings.map(f => `"${f.title}","${f.severity}","${f.detail.replace(/"/g, '""')}"`).join("\n");
  const blob = new Blob([headers + rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
