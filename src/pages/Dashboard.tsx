import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { UserCircle, BookOpen, GraduationCap, CheckCircle, Wallet, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export const Dashboard: React.FC = () => {
  const { parent, myChildren, data } = useAppContext();

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
    <div className="flex flex-col h-full space-y-8 pb-10">
      
      {/* Intro section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden glass-panel p-8 shadow-2xl border-t border-l border-emerald-500/20"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-l from-emerald-300 to-teal-100 bg-clip-text text-transparent mb-2">
            مرحباً بك في نظام المتابعة الذكي
          </h2>
          <p className="text-slate-400 font-medium tracking-wide">
            يمكنك من هنا متابعة أبنائك بشكل مفصل ودقيق لحظة بلحظة.
          </p>
        </div>
      </motion.div>
      
      {/* Children list */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10"
      >
        {childrenWithDetails.length === 0 && (
           <div className="col-span-full glass-card p-10 text-center flex flex-col items-center">
              <UserCircle size={48} className="text-slate-500 mb-4" />
              <p className="text-slate-400 font-bold">لا يوجد أبناء مسجلين حالياً، يرجى مراجعة إدارة السنتر.</p>
           </div>
        )}

        {childrenWithDetails.map((child, idx) => (
          <motion.div 
            variants={itemVariants}
            key={idx} 
            className="group relative overflow-hidden glass-card p-6 border-transparent hover:border-emerald-500/30 shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_32px_rgba(16,185,129,0.15)] bg-slate-800/40"
          >
            {/* Ambient hover effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex flex-col gap-5">
              {/* Header: Name and avatar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 p-0.5 shadow-lg shadow-emerald-500/20">
                     <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                        <UserCircle size={28} className="text-emerald-400" />
                     </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-100">{child.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mt-1 bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit">
                      <GraduationCap size={14} />
                      كود: {child.code}
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-emerald-500/20 via-slate-700/50 to-transparent" />

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Financial Balance */}
                <div className="glass-panel p-4 flex flex-col gap-2 border border-white/5 bg-slate-900/50">
                   <div className="flex items-center gap-2 text-slate-400">
                     <Wallet size={16} className="text-teal-400" />
                     <span className="text-sm font-semibold">الرصيد المالي</span>
                   </div>
                   <div className={`text-xl font-bold flex items-baseline gap-1 ${(child.balance || 0) < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {child.balance || 0}
                      <span className="text-xs font-normal">جنيه</span>
                   </div>
                </div>

                {/* Attendance rate */}
                <div className="glass-panel p-4 flex flex-col gap-2 border border-white/5 bg-slate-900/50">
                   <div className="flex items-center gap-2 text-slate-400">
                     <CheckCircle size={16} className="text-emerald-400" />
                     <span className="text-sm font-semibold">نسبة الالتزام</span>
                   </div>
                   <div className="flex items-end gap-2">
                     <div className="text-xl font-bold text-slate-100">
                        {child.attendancePercent}%
                     </div>
                     <div className="text-xs text-slate-500 mb-1">
                        من {child.totalSessions} حصة
                     </div>
                   </div>
                </div>
              </div>

              {/* Groups Enrolled */}
              <div className="glass-panel p-4 border border-white/5 bg-slate-900/50">
                <div className="flex items-center gap-2 text-slate-400 mb-3">
                  <BookOpen size={16} className="text-blue-400" />
                  <span className="text-sm font-semibold">المجموعات المشترك بها</span>
                </div>
                {child.groups.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {child.groups.map(g => (
                      <span key={g.id} className="text-xs font-bold text-slate-200 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700/50">
                        {g.name} - {g.subject}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-500">لا يوجد مجموعات حالياً</span>
                )}
              </div>
              
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
