import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, Phone, Lock, AlertCircle, ShieldCheck, Eye, EyeOff, CheckSquare } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Login: React.FC = () => {
  const { login } = useAppContext();
  const [phone, setPhone] = useState('');
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [oldPasscode, setOldPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setError('يرجى إدخال رقم هاتف ولي الأمر');
      return;
    }
    if (!passcode || passcode.length < 4) {
      setError('كلمة المرور يجب أن تكون 4 أحرف أو أرقام على الأقل');
      return;
    }

    setIsLoading(true);
    setError('');
    
    // Slight delay for smooth animation
    setTimeout(async () => {
      const success = await login(phone, passcode, rememberMe);
      if (!success) {
        setError('بيانات الدخول غير صحيحة، يرجى التأكد والمحاولة مرة أخرى');
        setIsLoading(false);
      }
    }, 800);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !oldPasscode || !newPasscode) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    if (newPasscode.length < 4) {
      setError('كلمة المرور الجديدة يجب أن تكون 4 أحرف أو أرقام على الأقل');
      return;
    }
    
    setIsLoading(true);
    setError('');

    // Ideally, a backend call would be made here to reset the password.
    // For this demonstration, we'll verify old credentials then simulate success.
    setTimeout(async () => {
      const success = await login(phone, oldPasscode, false); // Validate old credentials
      if (success) {
        // Pretend we updated it in DB
        alert('تم تغيير كلمة المرور بنجاح! يرجى الاستمرار في تسجيل الدخول.');
        setIsResetting(false);
        setPasscode(newPasscode);
        setIsLoading(false);
        window.location.reload(); // Hard reset to enforce relogin
      } else {
        setError('رقم الهاتف أو كلمة المرور القديمة غير صحيحة');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-900 text-slate-100">
      {/* Animated Premium Glass Backgrounds */}
      <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-teal-500/10 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md p-8 relative z-10 glass-panel shadow-[0_8px_32px_rgba(0,0,0,0.3)] border-t border-l border-white/10"
      >
        <div className="flex flex-col items-center mb-8 relative">
          <motion.div 
            initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 text-white rounded-[2rem] flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/30"
          >
            <ShieldCheck size={38} className="drop-shadow-md" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent mb-2"
          >
            تسجيل الدخول الآمن
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-slate-400 text-center text-sm font-medium"
          >
            بوابة ولي الأمر - متابعة ذكية لأبنائك
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              key="error-box"
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="mb-6 overflow-hidden"
            >
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-md flex items-center text-red-400">
                <AlertCircle size={20} className="ml-3 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </motion.div>
          )}

          {isResetting ? (
            <motion.form 
              key="reset-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleReset} 
              className="space-y-6"
            >
               <motion.div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">رقم ولي الأمر</label>
                  <div className="relative group">
                    <input 
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-4 pr-12 py-3.5 rounded-xl border border-white/5 bg-white/5 focus:bg-white/10 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-500 text-slate-100 shadow-inner"
                      placeholder="أدخل رقم الهاتف المسجل"
                      dir="ltr"
                    />
                    <Phone className="absolute right-4 top-3.5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" size={20} />
                  </div>
                </motion.div>
                <motion.div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">كلمة المرور القديمة</label>
                  <div className="relative group">
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={oldPasscode}
                      onChange={(e) => setOldPasscode(e.target.value)}
                      className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-white/5 bg-white/5 focus:bg-white/10 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-slate-500"
                      dir="ltr"
                    />
                    <Lock className="absolute right-4 top-3.5 text-slate-400 group-focus-within:text-emerald-400" size={20} />
                  </div>
                </motion.div>
                <motion.div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">كلمة المرور الجديدة</label>
                  <div className="relative group">
                    <input 
                      type={showPassword ? "text" : "password"}
                      value={newPasscode}
                      onChange={(e) => setNewPasscode(e.target.value)}
                      className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-white/5 bg-white/5 focus:bg-white/10 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-slate-500"
                      placeholder="4 أحرف أو أرقام على الأقل"
                      dir="ltr"
                    />
                    <Lock className="absolute right-4 top-3.5 text-slate-400 group-focus-within:text-emerald-400" size={20} />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-4 top-3.5 text-slate-400 hover:text-emerald-400 focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </motion.div>

                <div className="flex gap-4">
                  <motion.button 
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-900 font-bold shadow-lg shadow-emerald-500/25 transition-all outline-none"
                  >
                    {isLoading ? <span className="w-6 h-6 rounded-full border-2 border-slate-900/30 border-t-slate-900 animate-spin block mx-auto"></span> : 'تأكيد وحفظ'}
                  </motion.button>
                  <motion.button 
                    type="button"
                    onClick={() => { setIsResetting(false); setError(''); }}
                    disabled={isLoading}
                    className="flex-1 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all outline-none"
                  >
                    إلغاء
                  </motion.button>
                </div>
            </motion.form>
          ) : (
            <motion.form 
              key="login-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
          <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.6 }}
          >
            <label className="block text-sm font-semibold text-slate-300 mb-2">رقم ولي الأمر</label>
            <div className="relative group">
                <input 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-4 pr-12 py-3.5 rounded-xl border border-white/5 bg-white/5 focus:bg-white/10 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-500 text-slate-100 shadow-inner"
                  placeholder="أدخل رقم الهاتف المسجل"
                  dir="ltr"
                />
              <Phone className="absolute right-4 top-3.5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" size={20} />
            </div>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.7 }}
          >
            <label className="block text-sm font-semibold text-slate-300 mb-2">كلمة المرور</label>
            <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-white/5 bg-white/5 focus:bg-white/10 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-500 text-slate-100 shadow-inner"
                  placeholder="4 أحرف أو أرقام على الأقل"
                  dir="ltr"
                />
              <Lock className="absolute right-4 top-3.5 text-slate-400 group-focus-within:text-emerald-400 transition-colors" size={20} />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-3.5 text-slate-400 hover:text-emerald-400 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-between"
          >
            <label className="flex items-center cursor-pointer group">
              <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ml-3 ${rememberMe ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500 bg-slate-800/50 group-hover:border-emerald-400'}`}>
                {rememberMe && <CheckSquare size={14} className="text-slate-900" />}
              </div>
              <input type="checkbox" className="hidden" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
              <span className="text-sm font-medium text-slate-300 group-hover:text-emerald-100 transition-colors">تذكرني</span>
            </label>
            <button 
              type="button" 
              onClick={() => setIsResetting(true)}
              className="text-sm font-medium text-emerald-400 hover:text-emerald-300 hover:underline transition-all"
            >
              تغيير كلمة المرور؟
            </button>
          </motion.div>

          <motion.button 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.9 }}
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center py-4 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-900 font-bold shadow-lg shadow-emerald-500/25 transition-all outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer"
          >
            {isLoading ? (
              <span className="w-6 h-6 rounded-full border-2 border-slate-900/30 border-t-slate-900 animate-spin"></span>
            ) : (
              <>
                <LogIn size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                <span className="text-lg">دخول مشفر</span>
              </>
            )}
          </motion.button>
        </motion.form>
      )}
    </AnimatePresence>
      </motion.div>
    </div>
  );
};
