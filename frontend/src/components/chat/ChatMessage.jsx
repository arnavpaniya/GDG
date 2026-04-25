import { motion } from 'framer-motion';
import { Download, FileText, FileCode, Table as TableIcon, ShieldCheck, User, Layers } from 'lucide-react';
import FairnessScore3D from '@/components/analysis/FairnessScore3D';
import BiasExplanationCard from '@/components/analysis/BiasExplanationCard';
import { exportToPDF, exportToJSON, exportToCSV } from '@/utils/exportService';

const ChatMessage = ({ message }) => {
  const isAI = message.role === 'assistant' || message.role === 'system';
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex w-full mb-section ${!isAI ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex gap-comfortable max-w-[85%] ${!isAI ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isAI ? 'bg-accent-gold-light text-accent-gold' : 'bg-accent-blue/10 text-accent-blue'
        }`}>
          {isAI ? <ShieldCheck size={18} /> : <User size={18} />}
        </div>

        {/* Content */}
        <div className={`flex flex-col gap-compact ${!isAI ? 'items-end' : 'items-start'}`}>
          {message.content && (
            <div className={`p-comfortable rounded-[18px] text-sm leading-relaxed shadow-sm ${
              isAI 
                ? 'bg-bg-surface text-text-primary border border-border rounded-tl-[4px]' 
                : 'bg-bg-secondary text-text-primary rounded-tr-[4px]'
            }`}>
              {message.content}
            </div>
          )}

          {/* Special Analysis Results */}
          {message.analysis && (
            <div className="mt-base flex flex-col gap-base w-full min-w-[300px] md:min-w-[450px]">
              {/* Multi-attribute Summary */}
              {message.analysis.sensitiveAttrs && (
                <div className="flex flex-wrap items-center gap-compact px-base py-compact bg-bg-secondary/20 rounded-pill border border-border/40">
                  <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest flex items-center gap-compact mr-2">
                    <Layers size={10} />
                    Analyzed Categories:
                  </span>
                  {message.analysis.sensitiveAttrs.map(attr => (
                    <span key={attr} className="text-[9px] px-2 py-0.5 rounded-pill bg-bg-surface text-text-secondary border border-border/50 shadow-sm">
                      {attr}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-center bg-bg-surface p-section rounded-card border border-border shadow-soft">
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

              {/* Export Actions */}
              <div className="flex items-center gap-base mt-base p-comfortable bg-bg-secondary/30 rounded-card border border-border/50 border-dashed">
                <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mr-auto flex items-center gap-compact">
                  <Download size={12} />
                  Export Report
                </span>
                
                <button 
                  onClick={() => exportToPDF(message.analysis)}
                  className="flex items-center gap-compact text-[10px] font-bold text-accent-gold hover:text-accent-gold/80 transition-fast uppercase tracking-widest"
                  title="Download PDF Report"
                >
                  <FileText size={14} />
                  PDF
                </button>
                
                <div className="w-px h-3 bg-border"></div>
                
                <button 
                  onClick={() => exportToCSV(message.analysis.findings)}
                  className="flex items-center gap-compact text-[10px] font-bold text-text-secondary hover:text-text-primary transition-fast uppercase tracking-widest"
                  title="Download CSV Data"
                >
                  <TableIcon size={14} />
                  CSV
                </button>

                <div className="w-px h-3 bg-border"></div>

                <button 
                  onClick={() => exportToJSON(message.analysis)}
                  className="flex items-center gap-compact text-[10px] font-bold text-text-secondary hover:text-text-primary transition-fast uppercase tracking-widest"
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
