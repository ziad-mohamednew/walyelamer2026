import React, { useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CalendarCheck, ClipboardList, CheckCircle, XCircle, AlertCircle, AlertTriangle, Presentation, PieChart } from 'lucide-react';
import { motion } from 'motion/react';

const COLORS = ['#10b981', '#f43f5e', '#f59e0b']; // Present, Absent, Excused

export const Attendance: React.FC = () => {
  const { myChildren, data } = useAppContext();
  const [filterStudent, setFilterStudent] = useState<string>('all');

  const { pieData, tableData } = useMemo(() => {
    let present = 0;
    let absent = 0;
    let excused = 0;
    const flatRecords: any[] = [];

    const relevantGroups = new Set<string>();
    myChildren.forEach(child => {
      child.groupIds?.forEach(gid => relevantGroups.add(gid));
    });

    const records = data?.attendance.filter(a => relevantGroups.has(a.groupId)) || [];

    records.forEach(r => {
      const g = data?.groups.find(g => g.id === r.groupId);
      if (!g) return;

      Object.entries(r.records || {}).forEach(([studentId, status]) => {
        const student = myChildren.find(s => s.id === studentId);
        
        // Only process the parent's actual kids
        if (student) {
          flatRecords.push({
            id: `${r.id}-${studentId}`,
            date: r.date,
            groupName: g.name,
            subject: g.subject,
            studentName: student.name,
            studentId: student.id,
            status
          });

          if (status === 'present') present++;
          else if (status === 'absent') absent++;
          else if (status === 'excused') excused++;
        }
      });
    });

    flatRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const pData = [
      { name: 'حاضر', value: present },
      { name: 'غائب', value: absent },
      { name: 'عذر', value: excused },
    ].filter(d => d.value > 0);

    return { pieData: pData, tableData: flatRecords };
  }, [myChildren, data]);

  const filteredTableData = useMemo(() => {
    if (filterStudent === 'all') return tableData;
    return tableData.filter(r => r.studentId === filterStudent);
  }, [tableData, filterStudent]);

  return (
    <div className="space-y-6 pb-10 text-slate-100 mix-blend-plus-lighter relative z-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel border-t border-l border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.15)] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[60px]" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 rounded-xl shadow-inner border border-emerald-500/20">
            <Presentation size={28} />
          </div>
          <div>
             <h2 className="text-2xl font-bold bg-gradient-to-l from-slate-100 to-slate-400 bg-clip-text text-transparent">سجل المتابعة اليومي</h2>
             <p className="text-sm font-medium text-emerald-400 mt-1">تتبع دقيق لحضور وغياب أبنائك</p>
          </div>
        </div>

        <div className="relative z-10 w-full md:w-auto">
          <select 
            className="w-full md:w-auto px-5 py-3 border border-white/10 rounded-xl bg-slate-900/80 text-slate-200 focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all cursor-pointer shadow-inner backdrop-blur-md font-medium"
            value={filterStudent}
            onChange={(e) => setFilterStudent(e.target.value)}
          >
            <option value="all">كل الأبناء</option>
            {myChildren.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="lg:col-span-1 glass-card p-6 flex flex-col items-center justify-center border border-white/5 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-200 relative z-10">
            <PieChart size={20} className="text-emerald-400" />
            نسبة الالتزام الإجمالية
          </h3>
          <div className="w-full h-64 relative z-10">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={6}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', backdropFilter: 'blur(10px)' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: '20px' }} />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <AlertTriangle size={32} className="mb-2 opacity-50" />
                    <p>لا توجد بيانات متاحة بعد</p>
                </div>
            )}
          </div>
        </motion.div>

        {/* Detailed Table */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.1 }}
           className="lg:col-span-2 glass-panel p-6 border border-white/5"
        >
          <div className="flex items-center gap-3 mb-6">
            <ClipboardList size={22} className="text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-200">التفاصيل اليومية</h3>
          </div>
          
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/50 shadow-inner">
            <table className="w-full text-right border-collapse min-w-[600px]">
               <thead>
                 <tr className="bg-slate-800/80 border-b border-white/5 text-slate-400 text-sm">
                   <th className="p-4 font-bold">التاريخ</th>
                   <th className="p-4 font-bold">الابن</th>
                   <th className="p-4 font-bold">المجموعة</th>
                   <th className="p-4 font-bold text-center">حالة الحضور</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {filteredTableData.length > 0 ? filteredTableData.map(record => (
                   <tr key={record.id} className="hover:bg-slate-800/60 transition-colors group">
                     <td className="p-4 text-slate-200 font-medium">
                       {new Intl.DateTimeFormat('ar-EG', { dateStyle: 'medium' }).format(new Date(record.date))}
                     </td>
                     <td className="p-4 font-bold text-emerald-100 group-hover:text-emerald-300 transition-colors">
                        {record.studentName}
                     </td>
                     <td className="p-4">
                       <span className="inline-block px-3 py-1.5 bg-slate-900 text-slate-300 rounded-lg text-xs font-semibold border border-white/5 shadow-inner">
                         {record.groupName} - {record.subject}
                       </span>
                     </td>
                     <td className="p-4 flex justify-center">
                       {record.status === 'present' && (
                         <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-xl border border-emerald-500/20 shadow-[0_2px_10px_rgba(16,185,129,0.1)]">
                           <CheckCircle size={14} /> حاضـر
                         </span>
                       )}
                       {record.status === 'absent' && (
                         <span className="flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-500/10 px-4 py-1.5 rounded-xl border border-rose-500/20 shadow-[0_2px_10px_rgba(244,63,94,0.1)]">
                           <XCircle size={14} /> غائب
                         </span>
                       )}
                       {record.status === 'excused' && (
                         <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-4 py-1.5 rounded-xl border border-amber-500/20 shadow-[0_2px_10px_rgba(245,158,11,0.1)]">
                           <AlertCircle size={14} /> عـذر
                         </span>
                       )}
                     </td>
                   </tr>
                 )) : (
                   <tr>
                     <td colSpan={4} className="p-12 text-center text-slate-500 font-medium">
                       <div className="flex flex-col items-center justify-center">
                          <ClipboardList size={40} className="mb-3 opacity-20" />
                          <p>لا توجد تفاصيل حضور {filterStudent !== 'all' && 'لهذا الابن'}</p>
                       </div>
                     </td>
                   </tr>
                 )}
               </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
