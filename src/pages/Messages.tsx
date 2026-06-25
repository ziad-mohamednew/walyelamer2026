import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { MessageCircle, BellRing, Clock, UserCircle, BellOff } from 'lucide-react';
import { motion } from 'motion/react';

export const Messages: React.FC = () => {
  const { data, myChildren } = useAppContext();

  // Filter WhatsAppLogs for the parent's children
  const myAlerts = useMemo(() => {
    if (!data?.whatsAppLogs) return [];
    
    // Create a set of child IDs for O(1) lookup
    const myChildrenIds = new Set(myChildren.map(c => c.id));
    
    // Filter alerts and sort descending
    return data.whatsAppLogs
      .filter(log => myChildrenIds.has(log.studentId))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [data, myChildren]);

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
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-500/10 rounded-full blur-[60px]" />
        
        <div className="p-3 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 text-teal-400 rounded-xl shadow-inner border border-teal-500/20 relative z-10">
          <BellRing size={28} className="animate-pulse" />
        </div>
        <div className="relative z-10 text-center md:text-right">
           <h2 className="text-2xl font-bold bg-gradient-to-l from-slate-100 to-slate-400 bg-clip-text text-transparent">الإشعارات والتنبيهات</h2>
           <p className="text-sm font-medium text-teal-400 mt-1">سجل كامل بجميع الإشعارات والرسائل الواردة من إدارة السنتر</p>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {myAlerts.length > 0 ? myAlerts.map(alert => {
          let cardBorder = "border-white/5 hover:border-teal-500/30";
          let iconColor = "text-teal-400";
          let bgGradient = "from-teal-500/5";

          if (alert.message.includes('غياب')) {
            cardBorder = "border-red-500/30 hover:border-red-500/50";
            iconColor = "text-red-400";
            bgGradient = "from-red-500/10";
          } else if (alert.message.includes('عذر')) {
            cardBorder = "border-amber-500/30 hover:border-amber-500/50";
            iconColor = "text-amber-400";
            bgGradient = "from-amber-500/10";
          } else if (alert.message.includes('حضور')) {
            cardBorder = "border-emerald-500/30 hover:border-emerald-500/50";
            iconColor = "text-emerald-400";
            bgGradient = "from-emerald-500/10";
          }

          return (
          <motion.div 
            variants={itemVariants} 
            key={alert.id}
            className={`glass-card p-5 border ${cardBorder} transition-all flex flex-col gap-4 relative overflow-hidden group`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} to-transparent opacity-50 group-hover:opacity-100 transition-opacity`} />
            
            <div className="flex justify-between items-start relative z-10">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/5">
                    <UserCircle size={20} className={iconColor} />
                 </div>
                 <div>
                    <h3 className="font-bold text-slate-200">{alert.studentName}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <Clock size={12} />
                      {new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(alert.timestamp))}
                    </p>
                 </div>
              </div>
            </div>

            <div className="relative z-10 mt-2 bg-white/5 p-4 rounded-xl border border-white/5 text-sm leading-relaxed text-slate-300">
               <MessageCircle size={16} className={`${iconColor} absolute top-4 left-4 opacity-20`} />
               <p className="whitespace-pre-wrap">{alert.message}</p>
            </div>
          </motion.div>
        )}) : (
          <motion.div variants={itemVariants} className="col-span-full glass-panel p-12 flex flex-col items-center justify-center border border-white/5 text-slate-500">
             <BellOff size={48} className="mb-4 opacity-50 text-slate-400" />
             <p className="text-lg font-bold text-slate-400">لا توجد تنبيهات مسجلة</p>
             <p className="text-sm mt-2">لم تقم الإدارة بإرسال أية تنبيهات أو رسائل خاصة بأبنائك حتى الآن.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
