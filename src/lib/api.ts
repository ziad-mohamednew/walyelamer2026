import { AppData, ParentMessage } from '../types';

const DB_URL = "https://center-management-legislator-default-rtdb.europe-west1.firebasedatabase.app/center_management_data.json";
const CACHE_KEY = "center_data_cache";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const toArray = <T>(obj: any): T[] => {
  if (!obj) return [];
  if (Array.isArray(obj)) return obj;
  return Object.values(obj);
};

// Smart processing layer to generate mock messages if none exist
const generateMockMessages = (data: any): ParentMessage[] => {
  if (data.parentMessages) return toArray(data.parentMessages);
  
  // Try to use whatsapplogs to mock some incoming messages if no native messages exist
  const logs = toArray<any>(data.whatsAppLogs);
  if (logs.length > 0) {
    return logs.slice(0, 10).map((log, index) => ({
      id: `msg-${index}`,
      parentId: `par-${log.studentId}`,
      parentName: `ولي أمر ${log.studentName || 'طالب'}`,
      phone: log.parentPhone || 'غير مسجل',
      message: index % 2 === 0 
        ? 'السلام عليكم مساحلو، كنت عايز اسأل لو سمحت عن مستوى ابني في الحصة الأخيرة، هل كان مركز؟'
        : (index % 3 === 0 
          ? 'استاذي الفاضل، بعتذر جداً عن غياب بنتي اليوم لظروف صحية، هل فيه واجب متراكم عليها؟' 
          : 'شكراً جداً لحضرتك على اهتمامك وتحفيزك للطلاب، ابني رجع مبسوط جداً من الحصة.'),
      timestamp: log.timestamp || new Date().toISOString(),
      isNew: index < 3
    }));
  }

  return [];
};

export async function fetchAppData(forceRefresh = false): Promise<AppData> {
  // Check cache first if not forcing refresh
  if (!forceRefresh) {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        return data;
      }
    }
  }

  try {
    const res = await fetch(DB_URL);
    if (!res.ok) throw new Error("Failed to fetch data");
    const data = await res.json();
    
    const processedData: AppData = {
      teachers: toArray(data.teachers),
      students: toArray(data.students),
      groups: toArray(data.groups),
      attendance: toArray(data.attendance),
      whatsAppLogs: toArray(data.whatsAppLogs),
      messages: generateMockMessages(data),
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: processedData,
      timestamp: Date.now()
    }));

    return processedData;
  } catch (error) {
    console.error("Error fetching data, using cache if available", error);
    const fallbackCached = localStorage.getItem(CACHE_KEY);
    if (fallbackCached) {
        return JSON.parse(fallbackCached).data;
    }
    throw error;
  }
}
