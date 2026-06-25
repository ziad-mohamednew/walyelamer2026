export interface Teacher {
  id: string;
  name: string;
  phone: string;
  passcode: string;
  subject: string;
}

export interface ParentSession {
  phone: string;
  name?: string; // Optional: We can derive context or just use phone
}

export interface Student {
  id: string;
  name: string;
  phone: string;
  parentPhone: string;
  parentPasscode?: string;
  code: string;
  groupIds: string[];
  teacherIds: string[];
  status: string;
  stage?: string;
  balance?: number;
}

export interface Group {
  id: string;
  name: string;
  subject: string;
  teacherId: string;
  price: number;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  groupId: string;
  records: Record<string, 'present' | 'absent' | 'excused'>;
}

export interface WhatsAppLog {
  id: string;
  studentId: string;
  studentName: string;
  parentPhone: string;
  message: string;
  timestamp: string;
  status: string;
}

export interface ParentMessage {
  id: string;
  parentId: string;
  parentName: string;
  phone: string;
  message: string;
  timestamp: string;
  isNew: boolean;
}

export interface CenterSettings {
  name: string;
  logo: string;
  phone: string;
  academicStages?: string[];
  tips?: string[];
}

export interface AppData {
  teachers: Teacher[];
  students: Student[];
  groups: Group[];
  attendance: AttendanceRecord[];
  whatsAppLogs: WhatsAppLog[];
  messages: ParentMessage[];
  centerSettings?: CenterSettings;
}
