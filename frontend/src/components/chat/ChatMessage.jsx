import { motion } from 'framer-motion';
import { Download, FileText, FileCode, Table as TableIcon, ShieldCheck, User, Layers } from 'lucide-react';
import FairnessScore3D from '@/components/analysis/FairnessScore3D';
import BiasExplanationCard from '@/components/analysis/BiasExplanationCard';
import MLAnalysisCard from '@/components/analysis/MLAnalysisCard';
import { exportToPDF, exportToJSON, exportToCSV } from '@/utils/exportService';

const ChatMessage = ({ message }) => {
  const isAI = message.role === 'assistant' || message.role === 'system';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex w-full mb-6 ${!isAI ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex gap-3 max-w-[85%] ${!isAI ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
          isAI ? 'bg-accent-gold/10 text-accent-gold' : 'bg-accent-blue/10 text-accent-blue'
        }`}>
          {isAI ? <ShieldCheck size={16} /> : <User size={16} />}
        </div>

        {/* Content */}
        <div className={`flex flex-col gap-2 ${!isAI ? 'items-end' : 'items-start'}`}>
          {message.content && (
            <div className={`px-4 py-3 rounded-2xl text-[15px] leading-relaxed ${
              isAI 
                ? 'bg-bg-surface text-text-primary border border-border rounded-tl-sm' 
                : 'bg-bg-secondary text-text-primary rounded-tr-sm'
            }`}>
              {message.content}
            </div>
          )}

          {/* Special Analysis Results */}
          {message.analysis && (
            <div className="mt-4 flex flex-col gap-3 w-full min-w-[300px] md:min-w-[450px]">
              {/* ML Analysis Card (Backend) */}
              {message.analysis.type === 'ml' && (
                <MLAnalysisCard analysis={message.analysis} />
              )}

              {/* Client-side Analysis (Fallback) */}
              {message.analysis.type !== 'ml' && (
                <>
                  {/* Multi-attribute Summary */}
                  {message.analysis.sensitiveAttrs && (
                    <div className="flex flex-wrap items-center gap-2 px-4 py-2 bg-bg-secondary/50 rounded-full border border-border/50">
                      <span className="text-[11px] font-medium text-text-tertiary flex items-center gap-1.5 mr-2">
                        <Layers size={12} />
                        Analyzed:
                      </span>
                      {message.analysis.sensitiveAttrs.map(attr => (
                        <span key={attr} className="text-[11px] px-2.5 py-1 rounded-full bg-bg-surface text-text-secondary border border-border/50 shadow-sm">
                          {attr}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-center bg-bg-surface p-6 rounded-xl border border-border shadow-soft">
                    <FairnessScore3D score={message.analysis.score} />
                  </div>
                  
                  <div className="flex flex-col gap-compact">
                    {message.analysis.findings?.map((finding, index) => (
                      <BiasExplanationCard 
                        key={index}
                        title={finding.title}
                        description={finding.description}
                        severity={finding.severity}
                        detail={finding.detail}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Export Actions */}
              <div className="flex items-center gap-3 mt-4 p-3 bg-bg-secondary/30 rounded-lg border border-border/50 border-dashed">
                <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest mr-auto flex items-center gap-1.5">
                  <Download size={13} />
                  Export Report
                </span>
                
                <button 
                  onClick={() => exportToPDF(message.analysis)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-accent-gold hover:text-accent-gold/80 transition-fast uppercase tracking-widest"
                  title="Download PDF Report"
                >
                  <FileText size={14} />
                  PDF
                </button>
                
                <button 
                  onClick={() => exportToCSV(message.analysis.findings || message.analysis)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-text-secondary hover:text-text-primary transition-fast uppercase tracking-widest"
                  title="Download CSV Data"
                >
                  <TableIcon size={14} />
                  CSV
                </button>

                <button 
                  onClick={() => exportToJSON(message.analysis)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-text-secondary hover:text-text-primary transition-fast uppercase tracking-widest"
                  title="Download JSON Data"
                >
                  <FileCode size={14} />
                  JSON
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
