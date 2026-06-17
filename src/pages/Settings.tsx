import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { Settings as SettingsIcon, Moon, Sun, Monitor, Type, Languages, LogOut, ShieldAlert, Phone, ChevronLeft, Check } from 'lucide-react';

export const Settings: React.FC = () => {
  const { logout, data } = useAppContext();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');
  const [fontSize, setFontSize] = useState(localStorage.getItem('fontSize') || 'medium');
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'ar');
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
    if (fontSize === 'small') document.documentElement.style.fontSize = '14px';
    if (fontSize === 'medium') document.documentElement.style.fontSize = '16px';
    if (fontSize === 'large') document.documentElement.style.fontSize = '18px';
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const centerPhone = data?.groupsData?.centerSettings?.phone || '01000000000';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-6 pb-10 text-slate-100 relative z-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel border-t border-l border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-4 items-center shadow-[0_8px_32px_rgba(0,0,0,0.15)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-[60px]" />
        
        <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-indigo-400 rounded-xl shadow-inner border border-indigo-500/20 relative z-10">
          <SettingsIcon size={28} />
        </div>
        <div className="relative z-10 text-center md:text-right">
           <h2 className="text-2xl font-bold bg-gradient-to-l from-slate-100 to-slate-400 bg-clip-text text-transparent">الإعدادات</h2>
           <p className="text-sm font-medium text-indigo-400 mt-1">تخصيص الواجهة وإدارة الحساب</p>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Appearance Settings */}
        <motion.div variants={itemVariants} className="glass-card p-6 border border-white/5 relative overflow-hidden group">
          <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
            <Monitor size={20} className="text-indigo-400" />
            المظهر
          </h3>
          
          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-3">نمط الواجهة</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'light', label: 'نهاري', icon: Sun },
                  { id: 'dark', label: 'ليلي', icon: Moon },
                  { id: 'system', label: 'تلقائي', icon: Monitor },
                ].map((t) => {
                  const Icon = t.icon;
                  const isActive = theme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all ${
                        isActive 
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-inner' 
                        : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <Icon size={20} className="mb-2" />
                      <span className="text-xs font-bold">{t.label}</span>
                      {isActive && <div className="absolute top-2 left-2"><Check size={12} className="text-indigo-400" /></div>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-white/5 w-full" />

            <div>
              <p className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                <Type size={16} /> حجم الخط
              </p>
              <div className="flex bg-slate-800/50 rounded-xl p-1 border border-white/5">
                {[
                  { id: 'small', label: 'صغير' },
                  { id: 'medium', label: 'متوسط' },
                  { id: 'large', label: 'كبير' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setFontSize(s.id)}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                      fontSize === s.id 
                      ? 'bg-indigo-500 text-slate-900 shadow-md' 
                      : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-px bg-white/5 w-full" />

            {/* Note: In a real app we'd have i18n implementation. */}
            <div>
              <p className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                <Languages size={16} /> لغة التطبيق
              </p>
              <div className="flex bg-slate-800/50 rounded-xl p-1 border border-white/5">
                <button className="flex-1 py-2 text-sm font-bold rounded-lg bg-indigo-500 text-slate-900 shadow-md">
                  العربية
                </button>
                <button className="flex-1 py-2 text-sm font-bold rounded-lg text-slate-400 cursor-not-allowed opacity-50">
                  English (قريباً)
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Extras & Account */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="glass-card border border-white/5 p-2 flex flex-col gap-2">
            <button 
              onClick={() => window.open(`https://wa.me/2${centerPhone}`, '_blank')}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-800/50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Phone size={20} />
                </div>
                <div className="text-right">
                  <h4 className="font-bold text-slate-200 group-hover:text-emerald-300 transition-colors">تواصل مع إدارة السنتر</h4>
                  <p className="text-xs text-slate-400 mt-1" dir="ltr">{centerPhone}</p>
                </div>
              </div>
              <ChevronLeft size={20} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </button>
            <div className="h-px bg-white/5 w-[90%] mx-auto" />
            <button 
              onClick={() => setShowPrivacy(true)}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-800/50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <ShieldAlert size={20} />
                </div>
                <div className="text-right">
                  <h4 className="font-bold text-slate-200 group-hover:text-blue-300 transition-colors">سياسة الخصوصية</h4>
                  <p className="text-xs text-slate-400 mt-1">شروط الاستخدام وبيانات الحساب</p>
                </div>
              </div>
              <ChevronLeft size={20} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
            </button>
          </div>

          <div className="glass-card border border-rose-500/20 bg-rose-500/5 p-6">
             <div className="flex flex-col items-center justify-center text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
                   <LogOut size={28} className="translate-x-[-2px]" />
                </div>
                <div>
                   <h4 className="text-lg font-bold text-rose-300 mb-1">تسجيل الخروج</h4>
                   <p className="text-sm text-slate-400 line-clamp-2">سيتم إغلاق جلستك الآمنة، وستحتاج لإدخال كلمة المرور في المرة القادمة.</p>
                </div>
                <button onClick={logout} className="mt-2 w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 transition-all outline-none">
                  تأكيد الخروج
                </button>
             </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {showPrivacy && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-panel w-full max-w-lg p-6 max-h-[80vh] flex flex-col shadow-2xl border border-white/10"
            >
              <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-3 mb-4">
                <ShieldAlert className="text-blue-400" /> سياسة الخصوصية
              </h2>
              <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-sm text-slate-300 leading-relaxed font-medium">
                <p>نحن نحرص على حماية بيانات أبنائكم وبياناتكم الشخصية وفقاً لأعلى معايير الأمان المتاحة.</p>
                <p>يتم تخزين بيانات الجلسة بشكل مشفر محلياً على جهازك لضمان عدم الحاجة لتسجيل الدخول المتكرر، ولكن يمكنك تسجيل الخروج في أي وقت لمسح هذه الجلسة.</p>
                <p>هذا التطبيق مصمم للعمل كأداة متابعة آمنة ومغلقة، ولا يتم مشاركة بيانات الحضور أو الرسائل مع أي أطراف خارجية تحت أي ظرف.</p>
              </div>
              <button 
                onClick={() => setShowPrivacy(false)}
                className="mt-6 w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition-all"
              >
                إغلاق
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
