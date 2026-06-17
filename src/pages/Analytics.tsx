import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { BrainCircuit, Trophy, AlertTriangle, TrendingUp, Sparkles } from 'lucide-react';

export const Analytics: React.FC = () => {
  const { myStudents, myGroups, data } = useAppContext();

  const insights = useMemo(() => {
    if (!myStudents.length || !myGroups.length) return null;

    let bestGroup = myGroups[0];
    let highestCommitment = 0;
    
    // Group analysis
    myGroups.forEach(g => {
      let p = 0;
      let a = 0;
      const records = data?.attendance.filter(rec => rec.groupId === g.id) || [];
      records.forEach(r => Object.values(r.records || {}).forEach(st => {
        if(st === 'present') p++; else if(st === 'absent') a++;
      }));
      const comm = (p+a) > 0 ? (p/(p+a)) : 0;
      if (comm >= highestCommitment) {
        highestCommitment = comm;
        bestGroup = g;
      }
    });

    // Student analysis
    let bestStudent = myStudents[0];
    let mostAbsentStudent = myStudents[0];
    let highestP = -1;
    let highestA = -1;
    let totalP = 0, totalA = 0;

    myStudents.forEach(s => {
      let p = 0;
      let a = 0;
      const records = data?.attendance.filter(rec => myGroups.some(g => g.id === rec.groupId)) || [];
      records.forEach(r => {
        if(r.records && r.records[s.id] === 'present') p++;
        if(r.records && r.records[s.id] === 'absent') a++;
      });
      totalP += p; totalA += a;

      if(p > highestP) { highestP = p; bestStudent = s; }
      if(a > highestA) { highestA = a; mostAbsentStudent = s; }
    });

    const averageCommitment = (totalP+totalA) > 0 ? Math.round((totalP/(totalP+totalA)) * 100) : 0;

    return {
      bestGroup,
      bestStudent,
      mostAbsentStudent,
      highestA,
      highestP,
      averageCommitment,
      highestCommitment: Math.round(highestCommitment * 100)
    };
  }, [myStudents, myGroups, data]);

  if (!insights) return <div className="p-8 text-center text-slate-500">لا توجد بيانات كافية للتحليل</div>;

  return (
    <div className="space-y-6 text-[#e9edef]">
      <div className="bg-[#111b21] border border-[#2a3942] rounded-2xl p-4 flex items-center gap-3 border-b-[3px] border-b-[#00a884] mb-4 shadow-sm">
        <div className="p-2 bg-[#f59e0b]/20 text-[#f59e0b] rounded-lg">
          <BrainCircuit size={24} />
        </div>
        <h2 className="text-xl font-bold text-[#e9edef] m-0">ملخص الأداء والذكاء التحليلي</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric Cards */}
        <div className="bg-[#111b21] border border-[#2a3942] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[#00a884] mb-2">
            <Trophy size={18} />
            <h3 className="font-semibold text-sm text-[#8696a0]">أفضل مجموعة</h3>
          </div>
          <p className="text-lg font-bold mt-2 truncate text-[#e9edef]">{insights.bestGroup.name}</p>
          <p className="text-[#8696a0] text-xs mt-1">بنسبة التزام {insights.highestCommitment}%</p>
        </div>

        <div className="bg-[#111b21] border border-[#2a3942] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[#00a884] mb-2">
            <TrendingUp size={18} />
            <h3 className="font-semibold text-sm text-[#8696a0]">أكثر الطلاب حضوراً</h3>
          </div>
          <p className="text-lg font-bold mt-2 truncate text-[#e9edef]">{insights.bestStudent.name}</p>
          <p className="text-[#8696a0] text-xs mt-1">حضر {insights.highestP} مرات</p>
        </div>

        <div className="bg-[#111b21] border border-[#2a3942] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[#f15c6d] mb-2">
            <AlertTriangle size={18} />
            <h3 className="font-semibold text-sm text-[#8696a0]">أكثر الطلاب غياباً</h3>
          </div>
          <p className="text-lg font-bold mt-2 truncate text-[#e9edef]">{insights.mostAbsentStudent.name}</p>
          <p className="text-[#8696a0] text-xs mt-1">غاب {insights.highestA} مرات</p>
        </div>

        <div className="bg-[#111b21] border border-[#2a3942] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[#f59e0b] mb-2">
            <BarChart3 size={18} />
            <h3 className="font-semibold text-sm text-[#8696a0]">متوسط الالتزام العام</h3>
          </div>
          <p className="text-3xl font-bold mt-2 text-[#f59e0b]">{insights.averageCommitment}%</p>
          <div className="w-full h-1.5 bg-[#202c33] rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-[#f59e0b] rounded-full" style={{ width: `${insights.averageCommitment}%` }}></div>
          </div>
        </div>
      </div>

      <div className="bg-[#111b21] border border-[#2a3942] rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-[#e9edef]">
          <Sparkles className="text-[#f59e0b]" />
          توصيات تلقائية للمدرس
        </h3>
        
        <ul className="space-y-4">
          <li className="flex gap-4 p-4 rounded-xl bg-[#202c33] border border-[#2a3942]">
            <div className="p-2 rounded-full bg-[#f15c6d]/20 text-[#f15c6d] shrink-0 h-fit">
              <AlertTriangle size={16} />
            </div>
            <div>
              <h4 className="font-semibold text-[#e9edef]">متابعة الطالب {insights.mostAbsentStudent.name}</h4>
              <p className="text-sm text-[#8696a0] mt-1">
                سجل هذا الطالب أعلى نسبة غياب هذا الشهر. يُنصح بالتواصل الفوري مع ولي الأمر على الرقم المحمول الخاص به.
              </p>
            </div>
          </li>
          
          <li className="flex gap-4 p-4 rounded-xl bg-[#202c33] border border-[#2a3942]">
            <div className="p-2 rounded-full bg-[#00a884]/20 text-[#00a884] shrink-0 h-fit">
              <Trophy size={16} />
            </div>
            <div>
              <h4 className="font-semibold text-[#e9edef]">تكريم الطالب {insights.bestStudent.name}</h4>
              <p className="text-sm text-[#8696a0] mt-1">
                هذا الطالب يظهر التزاماً ممتازاً بالحضور. يمكن إرسال رسالة شكر لولي الأمر أو تقديم مكافأة تشجيعية لتحفيزه.
              </p>
            </div>
          </li>

          {insights.averageCommitment < 75 && (
            <li className="flex gap-4 p-4 rounded-xl bg-[#202c33] border border-[#2a3942]">
              <div className="p-2 rounded-full bg-[#f59e0b]/20 text-[#f59e0b] shrink-0 h-fit">
                <BrainCircuit size={16} />
              </div>
              <div>
                <h4 className="font-semibold text-[#e9edef]">تحسين نسبة الالتزام العامة</h4>
                <p className="text-sm text-[#8696a0] mt-1">
                  نسبة الحضور الإجمالية أقل من المتوقع. يُنصح بمراجعة جداول المجموعات والتأكد من عدم وجود تعارض مع ظروف الطلاب.
                </p>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

// Also importing BarChart3 below incase it missed it
import { BarChart3 } from 'lucide-react';
