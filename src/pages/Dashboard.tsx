import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  UserCircle, BookOpen, GraduationCap, CheckCircle, Wallet, 
  Lightbulb, Zap, Clock, RefreshCw 
} from 'lucide-react';
import { motion } from 'motion/react';

export const Dashboard: React.FC = () => {
  const { parent, myChildren, data, lastUpdate } = useAppContext();

  const centerName = data?.centerSettings?.name || 'سنتر المنارة';
  const centerTips = data?.centerSettings?.tips || [];

  // Find the groups for each child
  const childrenWithDetails = useMemo(() => {
    return myChildren.map(child => {
      const groups = data?.groups.filter(g => child.groupIds?.includes(g.id)) || [];
      
      // Compute attendance stats specifically for this child
      let present = 0;
      let total = 0;
      data?.attendance.forEach(att => {
        if (child.groupIds?.includes(att.groupId) && att.records && att.records[child.id]) {
          total++;
          if (att.records[child.id] === 'present') present++;
        }
      });
      const attendancePercent = total === 0 ? 0 : Math.round((present / total) * 100);

      return {
        ...child,
        groups,
        attendancePercent,
        totalSessions: total
      };
    });
  }, [myChildren, data]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="flex flex-col h-full space-y-6 pb-10">
      
      {/* Real-time Update Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between px-2"
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
          <RefreshCw size={12} className="text-emerald-400 animate-spin" />
          <span className="text-[10px] font-bold text-slate-300">
            تحديث لحظي مفعل
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-[10px]">
          <Clock size={12} />
          <span>آخر تحديث: {lastUpdate.toLocaleTimeString('ar-EG')}</span>
        </div>
      </motion.div>

      {/* Intro section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden glass-panel p-6 shadow-2xl border-t border-l border-emerald-500/20"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
        <div className="relative z-10">
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-l from-emerald-300 to-teal-100 bg-clip-text text-transparent mb-1">
             مرحباً بك في {centerName}
          </h2>
          <p className="text-slate-400 text-sm font-medium tracking-wide">
            نحن هنا لنرافقكم في رحلة تفوق أبنائكم.
          </p>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Dashboard Area */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-6"
          >
            {childrenWithDetails.length === 0 ? (
               <div className="glass-card p-10 text-center flex flex-col items-center">
                  <UserCircle size={48} className="text-slate-500 mb-4" />
                  <p className="text-slate-400 font-bold">لا يوجد أبناء مسجلين حالياً.</p>
               </div>
            ) : (
              childrenWithDetails.map((child, idx) => (
                <motion.div 
                  variants={itemVariants}
                  key={idx} 
                  className="group relative overflow-hidden glass-card p-6 border-transparent hover:border-emerald-500/30 shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10 flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 p-0.5 shadow-lg shadow-emerald-500/20">
                           <div className="w-full h-full bg-slate-900 rounded-[11px] flex items-center justify-center">
                              <UserCircle size={24} className="text-emerald-400" />
                           </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-100">{child.name}</h3>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 mt-1 bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit border border-emerald-500/20">
                            <GraduationCap size={12} />
                            كود: {child.code}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="glass-panel p-4 flex flex-col gap-1 border border-white/5">
                         <div className="flex items-center gap-2 text-slate-400">
                           <Wallet size={14} className="text-teal-400" />
                           <span className="text-xs font-bold">الرصيد المالي</span>
                         </div>
                         <div className={`text-lg font-bold flex items-baseline gap-1 ${(child.balance || 0) < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {child.balance || 0}
                            <span className="text-[10px] font-normal">جنيه</span>
                         </div>
                      </div>

                      <div className="glass-panel p-4 flex flex-col gap-1 border border-white/5">
                         <div className="flex items-center gap-2 text-slate-400">
                           <CheckCircle size={14} className="text-emerald-400" />
                           <span className="text-xs font-bold">نسبة الالتزام</span>
                         </div>
                         <div className="text-lg font-bold text-slate-100">
                            {child.attendancePercent}%
                         </div>
                      </div>
                    </div>

                    <div className="glass-panel p-4 border border-white/5">
                      <div className="flex items-center gap-2 text-slate-400 mb-3">
                        <BookOpen size={14} className="text-blue-400" />
                        <span className="text-xs font-bold">المجموعات المشترك بها</span>
                      </div>
                      {child.groups.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {child.groups.map(g => (
                            <span key={g.id} className="text-[10px] font-bold text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/50">
                              {g.name} - {g.subject}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">لا يوجد مجموعات حالياً</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>

        {/* Sidebar Info Area */}
        <div className="space-y-6">
          {/* Dynamic Tips Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 border-indigo-500/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                <Lightbulb size={20} />
              </div>
              <h3 className="font-bold text-slate-100">نصائح تربوية من {centerName}</h3>
            </div>
            <div className="space-y-4">
              {/* Dynamic logic-based tips */}
              {childrenWithDetails.map((child, i) => {
                const tips = [];
                if (child.attendancePercent < 85) {
                  tips.push(`الاهتمام بالطالب ${child.name} لتكرار غيابه مؤخراً، حيث وصلت نسبة التزامه لـ ${child.attendancePercent}% فقط.`);
                }
                if ((child.balance || 0) < 50) {
                  tips.push(`يرجى مراجعة الرصيد المالي للطالب ${child.name} لضمان استمرارية حضوره في المجموعات.`);
                }
                
                return tips.map((tip, j) => (
                  <div key={`${i}-${j}`} className="flex gap-3 bg-white/5 p-3 rounded-xl border border-white/5 animate-in fade-in slide-in-from-right-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <p className="text-[11px] text-slate-300 leading-relaxed">{tip}</p>
                  </div>
                ));
              }).flat()}

              {/* Default tips if no specific warnings */}
              {childrenWithDetails.every(c => c.attendancePercent >= 85 && (c.balance || 0) >= 50) && centerTips.slice(0, 3).map((tip, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                  <p className="text-[11px] text-slate-400 leading-relaxed">{tip}</p>
                </div>
              ))}
              
              {childrenWithDetails.length === 0 && centerTips.map((tip, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                  <p className="text-[11px] text-slate-400 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
