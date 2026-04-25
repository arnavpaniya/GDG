import useStore from '@/store/useStore';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Sidebar from './Sidebar';

const AppShell = ({ children }) => {
  const { isSidebarOpen, setSidebarOpen } = useStore();

  return (
    <div className="flex h-screen w-full bg-bg-primary overflow-hidden relative">
      {/* Main Sidebar */}
      <div className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-[300px]' : 'w-0'}`}>
        <Sidebar />
      </div>

      {/* Floating Toggle Button when Sidebar is closed */}
      {!isSidebarOpen && (
        <button 
          onClick={() => setSidebarOpen(true)}
          className="absolute top-4 left-4 z-50 p-2 bg-bg-surface border border-border rounded-button text-text-secondary hover:text-accent-gold transition-all shadow-soft group"
        >
          <PanelLeftOpen size={20} />
          <span className="absolute left-full ml-2 px-2 py-1 bg-text-primary text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest font-bold">
            Expand Sidebar
          </span>
        </button>
      )}

      <main className="flex-1 flex flex-col relative overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default AppShell;
