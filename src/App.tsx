/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Splash } from './components/Splash';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Attendance } from './pages/Attendance';
import { Messages } from './pages/Messages';
import { Settings } from './pages/Settings';
import { Loader2 } from 'lucide-react';

const MainApp: React.FC = () => {
  const { parent, loading, error } = useAppContext();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-300">
        <Loader2 size={48} className="animate-spin text-primary mb-4" />
        <p className="font-medium animate-pulse">جاري تحميل البيانات الذكية...</p>
        <div className="mt-8 flex gap-2">
           <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0s' }}></div>
           <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
           <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    );
  }

  if (error && !parent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-300">
        <div className="bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20 backdrop-blur-md">
          {error}
        </div>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-primary hover:bg-emerald-600 transition-colors text-white rounded-lg shadow-lg shadow-primary/20">إعادة المحاولة</button>
      </div>
    );
  }

  if (!parent) {
    return <Login />;
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'attendance': return <Attendance />;
      case 'messages': return <Messages />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderTab()}
    </Layout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
