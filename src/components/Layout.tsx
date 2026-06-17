import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Users, CalendarCheck, MessageCircle, 
  LogOut, ShieldCheck, Menu, X, BellDot, Settings as SettingsIcon
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TABS = [
  { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
  { id: 'attendance', label: 'سجل المتابعة', icon: CalendarCheck },
  { id: 'messages', label: 'تواصل مع الإدارة', icon: MessageCircle },
  { id: 'settings', label: 'الإعدادات', icon: SettingsIcon },
];

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { parent, logout, data, myChildren } = useAppContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Future feature: unread messages from admin
  const getUnreadMessages = () => {
    return 0; // Placeholder
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row overflow-hidden text-slate-100 relative">
      <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none"></div>
      
      {/* Mobile Header */}
      <header className="md:hidden glass-card mx-2 mt-2 px-4 py-3 flex items-center justify-between sticky top-2 z-40">
        <div className="flex items-center">
          <ShieldCheck className="text-emerald-400 ml-2" size={24} />
          <span className="font-bold text-lg bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">بوابة ولي الأمر</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-lg bg-white/5 text-emerald-400 border border-white/10 shadow-sm backdrop-blur-md">
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 right-0 z-50 w-[260px] glass-panel border-l border-white/10 transform transition-transform duration-300 ease-in-out flex flex-col md:relative md:translate-x-0 shadow-2xl shadow-black/50 py-[1.5rem] font-sans md:m-4 md:rounded-3xl",
        isSidebarOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="px-6 pb-6 flex items-center justify-between border-b border-white/5 mb-4">
          <div className="flex items-center">
            <ShieldCheck className="text-emerald-400 ml-2" size={28} />
            <div className="font-bold text-[1.15rem] leading-tight bg-gradient-to-l from-emerald-300 to-teal-100 bg-clip-text text-transparent">
              بوابة ولي الأمر
            </div>
          </div>
          <button onClick={closeSidebar} className="md:hidden p-2 text-slate-400 hover:bg-white/10 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pb-6">
          <p className="text-xs font-medium text-slate-400 mb-1">الرقم المسجل</p>
          <p className="text-sm font-bold text-emerald-300 tracking-wider" dir="ltr">{parent?.phone}</p>
        </div>

        <nav className="flex-1 overflow-y-auto space-y-1.5 px-3">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  closeSidebar();
                }}
                className={cn(
                  "w-full flex items-center py-3 px-4 transition-all duration-300 relative group font-bold text-sm cursor-pointer rounded-xl",
                  isActive 
                    ? "bg-emerald-500/20 text-emerald-100 border border-emerald-500/30 shadow-[0_4px_16px_rgba(16,185,129,0.15)]" 
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
                )}
              >
                <Icon size={20} className={cn("ml-3 shrink-0", isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-emerald-300 transition-colors")} />
                <span>{tab.label}</span>
                {tab.id === 'messages' && getUnreadMessages() > 0 && (
                  <span className="mr-auto w-5 h-5 flex items-center justify-center bg-emerald-500 text-slate-900 text-[10px] rounded-full font-bold shadow-md shadow-emerald-500/20">
                    {getUnreadMessages()}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white shadow-lg shadow-red-500/10 font-bold transition-all cursor-pointer rounded-xl"
          >
            <LogOut size={18} className="shrink-0" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-5 shrink-0 z-30">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              {TABS.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="text-sm font-medium text-emerald-400 mt-1 flex items-center gap-2">
              <BellDot size={14} />
              متابعة مباشرة لأبنائك ({myChildren.length})
            </p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-left">
                <p className="text-xs text-slate-400">الجلسة آمنة</p>
                <p className="text-sm font-bold text-slate-200" dir="ltr">{parent?.phone}</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Users className="text-slate-900" size={20} />
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:px-8 md:pb-8 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="max-w-7xl mx-auto h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
