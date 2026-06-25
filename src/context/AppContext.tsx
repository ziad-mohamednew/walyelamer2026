import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { AppData, Group, Student, ParentSession } from '../types';
import { fetchAppData } from '../lib/api';

interface AppContextType {
  data: AppData | null;
  parent: ParentSession | null;
  loading: boolean;
  error: string | null;
  login: (phone: string, passcode: string, remember: boolean) => Promise<boolean>;
  logout: () => void;
  myChildren: Student[];
  showPhone: boolean;
  setShowPhone: (val: boolean) => void;
  hasSeenHint: boolean;
  setHasSeenHint: (val: boolean) => void;
  lastUpdate: Date;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [data, setData] = useState<AppData | null>(null);
  const [parent, setParent] = useState<ParentSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showPhone, setShowPhone] = useState<boolean>(localStorage.getItem('show_phone') === 'true');
  const [hasSeenHint, setHasSeenHint] = useState<boolean>(localStorage.getItem('has_seen_hint') === 'true');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    localStorage.setItem('show_phone', String(showPhone));
  }, [showPhone]);

  useEffect(() => {
    localStorage.setItem('has_seen_hint', String(hasSeenHint));
  }, [hasSeenHint]);

  useEffect(() => {
    // Load initial data and session
    const init = async () => {
      try {
        setLoading(true);
        const fetchedData = await fetchAppData();
        setData(fetchedData);
        
        // Check session
        const savedPhone = localStorage.getItem('parent_session');
        if (savedPhone) {
          setParent({ phone: savedPhone });
        }
      } catch (err) {
        setError('تعذر تحميل البيانات. يرجى التحقق من اتصالك بالإنترنت.');
      } finally {
        setLoading(false);
      }
    };
    init();

    // Firebase Realtime Listener
    import('firebase/app').then(({ initializeApp }) => {
      import('firebase/database').then(({ getDatabase, ref, onValue }) => {
        try {
          const app = initializeApp({
            databaseURL: "https://center-management-legislator-default-rtdb.europe-west1.firebasedatabase.app/"
          }, "ParentApp");
          const db = getDatabase(app);
          const dataRef = ref(db, 'center_management_data');
          
          onValue(dataRef, (snapshot) => {
            if (snapshot.exists()) {
              const rawData = snapshot.val();
              // Small helper to transform objects to arrays
              const toArray = (obj: any) => {
                if (!obj) return [];
                if (Array.isArray(obj)) return obj;
                return Object.values(obj);
              };

              const processedData = {
                teachers: toArray(rawData.teachers),
                students: toArray(rawData.students),
                groups: toArray(rawData.groups),
                attendance: toArray(rawData.attendance),
                whatsAppLogs: toArray(rawData.whatsAppLogs),
                messages: [], // Or handle messages appropriately
                centerSettings: rawData.centerSettings || {
                  name: "سنتر المنارة",
                  logo: "/open.png",
                  phone: "01000000000",
                  tips: [
                    "المتابعة اليومية سر النجاح والتفوق.",
                    "تنظيم الوقت يساعد الطالب على التحصيل بشكل أفضل.",
                    "التواصل المستمر مع المعلمين يحل المشكلات مبكراً.",
                    "البيئة الهادئة في المنزل تدعم التركيز الدراسي."
                  ]
                }
              };
              
              setData(processedData);
              setLastUpdate(new Date());
            }
          });
        } catch(e) {
          console.error("Firebase listener error", e);
        }
      });
    });

  }, []);

  const login = async (phone: string, passcode: string, remember: boolean): Promise<boolean> => {
    if (!data) return false;
    
    // Find any student whose parentPhone and parentPasscode matches
    const hasChild = data.students.some(
      s => String(s.parentPhone) === String(phone) && String(s.parentPasscode) === String(passcode)
    );
    
    if (hasChild) {
      setParent({ phone });
      if (remember) {
        localStorage.setItem('parent_session', phone);
      } else {
        sessionStorage.setItem('parent_session', phone); // Optional support for non-remembered
        localStorage.setItem('parent_session', phone); // Simple for now
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setParent(null);
    localStorage.removeItem('parent_session');
    sessionStorage.removeItem('parent_session');
  };

  const myChildren = useMemo(() => {
    if (!parent || !data) return [];
    return data.students.filter(s => String(s.parentPhone) === String(parent.phone));
  }, [data, parent]);

  return (
    <AppContext.Provider value={{ 
      data, parent, loading, error, login, logout, myChildren, 
      showPhone, setShowPhone, hasSeenHint, setHasSeenHint, lastUpdate 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
