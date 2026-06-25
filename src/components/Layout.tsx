import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, CalendarCheck, BellRing, Settings as SettingsIcon,
  BellDot, ShieldCheck, Eye, EyeOff, Info
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
  { id: 'messages', label: 'الإشعارات', icon: BellRing },
  { id: 'settings', label: 'الإعدادات', icon: SettingsIcon },
];

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { 
    parent, data, myChildren, showPhone, setShowPhone, 
    hasSeenHint, setHasSeenHint, lastUpdate 
  } = useAppContext();
  
  const [showHintLocal, setShowHintLocal] = useState(false);

  useEffect(() => {
    // Logic for showing hint after 2nd run
    const runCount = parseInt(localStorage.getItem('app_run_count') || '0');
    if (!hasSeenHint && runCount >= 1) {
      // Check last dismissed time (if any)
      const lastDismissed = localStorage.getItem('hint_dismissed_at');
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      if (!lastDismissed || (Date.now() - parseInt(lastDismissed)) > oneWeek) {
        setShowHintLocal(true);
      }
    }
    localStorage.setItem('app_run_count', (runCount + 1).toString());
  }, [hasSeenHint]);

  const dismissHint = () => {
    setShowHintLocal(false);
    setHasSeenHint(true);
    localStorage.setItem('hint_dismissed_at', Date.now().toString());
  };

  const centerName = data?.centerSettings?.name || 'سنتر المنارة';
  const centerLogo = data?.centerSettings?.logo || '/open.png';

  const activeIndex = TABS.findIndex(t => t.id === activeTab);

  return (
    <div className="min-h-screen bg-[#0b141a] text-slate-100 font-sans overflow-hidden">
      {/* Background Blurs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-emerald-500/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-teal-500/5 blur-[120px]"></div>
      </div>

      {/* Fixed Top Header */}
      <header className="glass-header-container px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-0.5">
             <img src={centerLogo} alt="Logo" className="w-full h-full object-contain" onError={(e) => (e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/2940/2940651.png')} />
          </div>
          <div 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => window.open('https://wa.me/201031123461', '_blank')}
          >
            <h1 className="text-xs font-bold bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent truncate max-w-[120px]">
              {centerName}
            </h1>
            <p className="text-[8px] font-medium text-slate-500 uppercase tracking-tighter mt-[-1px]">
              Manara by Graphiqa
            </p>
          </div>
        </div>

        <div className="mr-auto flex items-center gap-3">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg border border-white/10">
              <p className={cn(
                "text-[10px] font-bold tracking-wider transition-all duration-300",
                !showPhone && "blur-[3px] select-none"
              )} dir="ltr">
                {parent?.phone}
              </p>
              <button onClick={() => setShowPhone(!showPhone)} className="text-slate-500 hover:text-emerald-400">
                {showPhone ? <EyeOff size={10} /> : <Eye size={10} />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-bold text-emerald-400">مباشر</span>
          </div>
        </div>
      </header>

      {/* Hint Tooltip */}
      <AnimatePresence>
        {showHintLocal && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-[85px] left-1/2 -translate-x-1/2 z-[110] w-[calc(100%-40px)] max-w-[360px]"
          >
            <div className="glass-card p-4 border-emerald-500/30 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl" />
              <div className="flex items-start gap-3 relative z-10">
                <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
                  <Info size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">تلميح الخصوصية</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    يمكنك إخفاء رقم هاتفك المسجل من شريط العنوان العلوي أو من قسم الإعدادات لزيادة الخصوصية.
                  </p>
                  <button 
                    onClick={dismissHint}
                    className="mt-3 px-4 py-1.5 bg-emerald-500 text-slate-900 text-[9px] font-bold rounded-lg shadow-lg shadow-emerald-500/20"
                  >
                    فهمت، شكراً
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="pt-[85px] pb-[100px] h-screen overflow-y-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Fixed Glass Bottom Navigation */}
      <div className="glass-nav-container">
        <div className="glass-indicator" style={{ transform: `translateX(${-activeIndex * 100}%)` }}>
          <div className="indicator-glow"></div>
        </div>
        
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <div 
              key={tab.id} 
              className="nav-item"
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className={cn("nav-icon", isActive && "active-icon")} />
              {isActive && (
                <motion.span 
                  layoutId="nav-label"
                  className="absolute bottom-2.5 text-[7px] font-bold text-emerald-400"
                >
                  {tab.label}
                </motion.span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
