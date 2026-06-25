import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';

interface SplashProps {
  onComplete: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onComplete }) => {
  const { data } = useAppContext();
  const [centerName, setCenterName] = useState('..جاري التحميل..');
  const [logoUrl, setLogoUrl] = useState('');

  // Fetch the center info from RTDB (or use context data if available)
  useEffect(() => {
    fetch("https://center-management-legislator-default-rtdb.europe-west1.firebasedatabase.app/center_management_data/centerSettings.json")
      .then(r => r.json())
      .then(d => {
        if(d?.name) setCenterName(d.name);
        setLogoUrl(d?.logo || '/open.png');
      }).catch(err => {
         setCenterName('سنتر المنارة');
         setLogoUrl('/open.png');
      });
      
    // Wait at least a bit to show the splash before completing
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.8 } }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white"
      >
        {/* Animated Background effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[100px]" 
          />
          <motion.div 
             animate={{ 
              scale: [1, 1.3, 1],
              x: [0, -40, 0],
              y: [0, 60, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]" 
          />
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay: 0.2
          }}
          className="relative z-10 flex flex-col items-center p-8 glass-panel"
        >
          {logoUrl ? (
            <motion.img 
              initial={{ rotate: -10, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
              src={logoUrl} 
              alt="Center Logo" 
              className="w-32 h-32 object-cover rounded-3xl mb-6 shadow-2xl shadow-primary/20 border border-white/10"
              referrerPolicy="no-referrer"
            />
          ) : (
            <motion.div 
              initial={{ rotate: -10, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
              className="w-32 h-32 rounded-3xl bg-white/5 mb-6 shadow-2xl flex items-center justify-center border border-white/10"
            >
              <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent text-center mb-2"
          >
            {centerName}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-emerald-400 font-medium text-lg tracking-wide mb-8"
          >
            بوابة ولي الأمر الذكية
          </motion.p>

          {/* Elegant Loading indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="w-2 h-2 rounded-full bg-primary"
                />
              ))}
            </div>
            <p className="text-white/40 text-sm animate-pulse tracking-wider">
              نظام محمي ومدعوم بترميز متقدم
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
