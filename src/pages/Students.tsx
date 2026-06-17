import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Search, Filter, Phone, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const Students: React.FC = () => {
  const { myStudents, myGroups, data } = useAppContext();
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const studentsWithStats = useMemo(() => {
    return myStudents.map(student => {
      let present = 0;
      let absent = 0;
      
      const records = data?.attendance.filter(a => myGroups.some(g => g.id === a.groupId)) || [];
      records.forEach(r => {
        if (r.records && r.records[student.id]) {
          if (r.records[student.id] === 'present') present++;
          else if (r.records[student.id] === 'absent') absent++;
        }
      });

      const total = present + absent;
      const commitment = total === 0 ? 0 : Math.round((present / total) * 100);

      // Find primary group for display
      const groupName = myGroups.find(g => Array.isArray(student.groupIds) && student.groupIds.includes(g.id))?.name || 'غير محدد';

      return {
        ...student,
        present,
        absent,
        commitment,
        groupName
      };
    });
  }, [myStudents, myGroups, data]);

  const filteredStudents = useMemo(() => {
    let result = studentsWithStats;
    if (search) {
      result = result.filter(s => 
        (s.name && s.name.includes(search)) || 
        (s.phone && s.phone.includes(search))
      );
    }
    if (groupFilter !== 'all') {
      result = result.filter(s => Array.isArray(s.groupIds) && s.groupIds.includes(groupFilter));
    }
    // Sort by name
    return result.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'ar'));
  }, [studentsWithStats, search, groupFilter]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 flex flex-col h-full text-[#e9edef]">
      {/* Header Actions */}
      <div className="bg-[#111b21] border border-[#2a3942] rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center z-10 shadow-sm">
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="ابحث بالاسم أو رقم الهاتف..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-[#2a3942] bg-[#202c33] focus:ring-1 focus:ring-[#00a884] focus:border-[#00a884] outline-none transition-all placeholder:text-[#8696a0] text-[#e9edef]"
          />
          <Search className="absolute right-3.5 top-3 text-[#8696a0]" size={18} />
        </div>
        
        <div className="relative w-full md:w-64">
          <select 
            value={groupFilter}
            onChange={e => setGroupFilter(e.target.value)}
            className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-[#2a3942] bg-[#202c33] focus:ring-1 focus:ring-[#00a884] focus:border-[#00a884] outline-none transition-all appearance-none text-[#e9edef]"
          >
            <option value="all">جميع المجموعات</option>
            {myGroups.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
          <Filter className="absolute right-3.5 top-3 text-[#8696a0] pointer-events-none" size={18} />
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-[#111b21] border border-[#2a3942] rounded-2xl flex-1 flex flex-col overflow-hidden shadow-sm">
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto flex-1">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-[#202c33]">
                <th className="py-3 px-4 font-semibold text-[#8696a0] text-[0.9rem] text-right">اسم الطالب</th>
                <th className="py-3 px-4 font-semibold text-[#8696a0] text-[0.9rem] text-right">المجموعة</th>
                <th className="py-3 px-4 font-semibold text-[#8696a0] text-[0.9rem] text-right">رقم الهاتف</th>
                <th className="py-3 px-4 font-semibold text-[#8696a0] text-[0.9rem] text-center">حضور</th>
                <th className="py-3 px-4 font-semibold text-[#8696a0] text-[0.9rem] text-center">غياب</th>
                <th className="py-3 px-4 font-semibold text-[#8696a0] text-[0.9rem] text-center">الالتزام</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((s, idx) => (
                <tr key={s.id} className="border-b border-[#2a3942] hover:bg-[#202c33] transition-colors text-[0.9rem]">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#00a884]/20 text-[#00a884] flex items-center justify-center font-bold text-xs shrink-0">
                        {s.name.charAt(0)}
                      </div>
                      <span className="font-medium whitespace-nowrap text-[#e9edef]">{s.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#8696a0] text-[0.9rem]">{s.groupName}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-[#8696a0] text-[0.9rem] font-mono" dir="ltr">
                      {s.phone}
                      <Phone size={14} className="text-[#8696a0]" />
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center justify-center min-w-8 py-[4px] px-[8px] rounded-[6px] bg-[#00a884]/20 text-[#00a884] text-[0.75rem] font-bold">
                      {s.present}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center justify-center min-w-8 py-[4px] px-[8px] rounded-[6px] bg-[#f15c6d]/20 text-[#f15c6d] text-[0.75rem] font-bold">
                      {s.absent}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-2 bg-[#2a3942] rounded-full overflow-hidden shrink-0">
                        <div 
                          className={cn("h-full rounded-full transition-all duration-500", 
                            s.commitment >= 80 ? "bg-[#00a884]" : s.commitment >= 50 ? "bg-[#f59e0b]" : "bg-[#f15c6d]"
                          )}
                          style={{ width: `${s.commitment}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold w-8 text-center text-[#e9edef]">{s.commitment}%</span>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#8696a0]">لا يوجد بيانات مطابقة للبحث</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden flex-1 overflow-y-auto p-4 space-y-4">
          {paginatedStudents.length === 0 ? (
            <div className="text-center text-[#8696a0] mt-8">لا يوجد بيانات مطابقة للبحث</div>
          ) : (
            paginatedStudents.map((s, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={s.id} 
                className="glass-card p-4 flex flex-col gap-3"
              >
                <div className="flex justify-between items-center pb-3 border-b border-[var(--card-border)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#00a884]/20 text-[#00a884] flex items-center justify-center font-bold text-sm shrink-0">
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-[1rem] m-0">{s.name}</h3>
                      <p className="text-[var(--foreground)] opacity-70 text-sm m-0 mt-0.5">{s.groupName}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="opacity-70">رقم الهاتف:</span>
                  <div className="flex items-center gap-2 font-mono" dir="ltr">
                    {s.phone}
                    <Phone size={14} className="opacity-70" />
                  </div>
                </div>

                <div className="flex justify-between gap-2 mt-1">
                  <div className="flex flex-col items-center p-2 rounded-lg flex-1 bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(255,255,255,0.05)]">
                    <span className="text-xs opacity-70 mb-1">حضور</span>
                    <span className="text-[#00a884] font-bold">{s.present}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-lg flex-1 bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(255,255,255,0.05)]">
                    <span className="text-xs opacity-70 mb-1">غياب</span>
                    <span className="text-[#f15c6d] font-bold">{s.absent}</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-lg flex-1 bg-[rgba(0,0,0,0.1)] dark:bg-[rgba(255,255,255,0.05)]">
                    <span className="text-xs opacity-70 mb-1">الالتزام</span>
                    <span className={cn("font-bold", s.commitment >= 80 ? "text-[#00a884]" : s.commitment >= 50 ? "text-[#f59e0b]" : "text-[#f15c6d]")}>
                      {s.commitment}%
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
        
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#2a3942] flex items-center justify-between bg-[#202c33]">
            <span className="text-sm text-[#8696a0]">
              الصفحة {currentPage} من {totalPages}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-[#2a3942] hover:bg-[#2a3942] disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed text-[#e9edef]"
              >
                <ChevronRight size={18} />
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-[#2a3942] hover:bg-[#2a3942] disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed text-[#e9edef]"
              >
                <ChevronLeft size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
