import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings as SettingsIcon, LogOut, ShieldAlert, Phone, 
  ChevronLeft, User, Hash, GraduationCap, Eye, EyeOff, Check
} from 'lucide-react';
import { cn } from '../lib/utils';

export const Settings: React.FC = () => {
  const { logout, data, myChildren, showPhone, setShowPhone } = useAppContext();
  const [showPrivacy, setShowPrivacy] = useState(false);

  const centerPhone = data?.centerSettings?.phone || '01000000000';

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
        className="glass-panel border-t border-l border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-4 items-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-[60px]" />
        
        <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl shadow-inner border border-emerald-500/20 relative z-10">
          <SettingsIcon size={28} />
        </div>
        <div className="relative z-10 text-center md:text-right">
           <h2 className="text-xl font-bold bg-gradient-to-l from-slate-100 to-slate-400 bg-clip-text text-transparent">إعدادات الحساب</h2>
           <p className="text-xs font-medium text-slate-500 mt-1">إدارة بيانات الأبناء والخصوصية</p>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Student Details Section */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 flex items-center gap-2 px-2">
            <User size={16} /> بيانات الطلاب المسجلين
          </h3>
          
          {myChildren.map((child, idx) => (
            <div key={idx} className="glass-card p-5 border border-white/5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-emerald-400 border border-white/5">
                  <User size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-100">{child.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">طالب مسجل بنظام المتابعة</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Hash size={12} />
                    <span className="text-[10px] font-bold">كود الطالب</span>
                  </div>
                  <p className="text-sm font-bold text-emerald-400">{child.code}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <GraduationCap size={12} />
                    <span className="text-[10px] font-bold">المرحلة الدراسية</span>
                  </div>
                  <p className="text-sm font-bold text-slate-200">{child.stage || 'غير محدد'}</p>
                </div>
              </div>

              <div className="bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-400">
                    <Phone size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500">رقم الهاتف</p>
                    <p className={cn(
                      "text-sm font-bold tracking-wider transition-all duration-300",
                      !showPhone && "blur-[5px] select-none"
                    )} dir="ltr">
                      {child.phone}
                    </p>
                  </div>
                </div>
                {/* Visual hint is managed globally but we show the state here too */}
                <div className="text-[10px] text-slate-600 italic">
                  {!showPhone ? 'مخفي للخصوصية' : 'ظاهر'}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Visibility and Extras */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="glass-card p-6 border border-white/5">
            <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
              <ShieldAlert size={18} className="text-emerald-400" /> التحكم في الخصوصية
            </h3>
            
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
               <div>
                  <h4 className="text-sm font-bold text-slate-200">إظهار أرقام الهواتف</h4>
                  <p className="text-[10px] text-slate-500 mt-1">إظهار أو إخفاء أرقام الهواتف في جميع الصفحات</p>
               </div>
               <button 
                  onClick={() => setShowPhone(!showPhone)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all duration-300 relative",
                    showPhone ? "bg-emerald-500" : "bg-slate-700"
                  )}
               >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300",
                    showPhone ? "left-7" : "left-1"
                  )} />
               </button>
            </div>
          </div>

          <div className="glass-card border border-white/5 p-2 flex flex-col gap-1">
            <button 
              onClick={() => window.open(`https://wa.me/2${centerPhone}`, '_blank')}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                  <Phone size={18} />
                </div>
                <div className="text-right">
                  <h4 className="font-bold text-sm text-slate-200">تواصل مع إدارة السنتر</h4>
                  <p className="text-[10px] text-slate-500 mt-1">واتساب مباشر</p>
                </div>
              </div>
              <ChevronLeft size={18} className="text-slate-600" />
            </button>
            
            <div className="h-px bg-white/5 w-[90%] mx-auto" />
            
            <button 
              onClick={() => setShowPrivacy(true)}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                  <ShieldAlert size={18} />
                </div>
                <div className="text-right">
                  <h4 className="font-bold text-sm text-slate-200">سياسة الخصوصية</h4>
                  <p className="text-[10px] text-slate-500 mt-1">شروط الاستخدام والأمان</p>
                </div>
              </div>
              <ChevronLeft size={18} className="text-slate-600" />
            </button>
          </div>

          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 py-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-2xl font-bold transition-all shadow-lg shadow-rose-500/5"
          >
            <LogOut size={20} />
            <span>تسجيل الخروج الآمن</span>
          </button>
        </motion.div>
      </motion.div>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {showPrivacy && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-panel w-full max-w-lg p-6 max-h-[80vh] flex flex-col shadow-2xl border border-white/10"
            >
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-3 mb-6">
                <ShieldAlert className="text-emerald-400" /> سياسة الخصوصية والأمان
              </h2>
              <div className="flex-1 overflow-y-auto pr-2 space-y-5 text-sm text-slate-400 leading-relaxed font-medium">
                <p>نحن في السنتر نؤمن بأن خصوصية بيانات أبنائكم هي أولوية قصوى. جميع البيانات المعروضة يتم جلبها عبر قنوات مشفرة وآمنة.</p>
                <p>يتم تخزين بيانات الجلسة بشكل مشفر محلياً على جهازك لضمان عدم الحاجة لتسجيل الدخول المتكرر، ولكن يمكنك تسجيل الخروج في أي وقت لمسح هذه الجلسة.</p>
                <p>خاصية إخفاء الهواتف تضمن عدم تسرب البيانات في الأماكن العامة، ويمكنكم تفعيلها أو تعطيلها حسب الحاجة.</p>
                <p>هذا التطبيق مصمم للعمل كأداة متابعة آمنة ومغلقة، ولا يتم مشاركة بيانات الحضور أو الدرجات مع أي أطراف خارجية تحت أي ظرف.</p>
              </div>
              <button 
                onClick={() => setShowPrivacy(false)}
                className="mt-8 w-full py-3.5 bg-emerald-500 text-slate-900 font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
              >
                إغلاق النافذة
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
