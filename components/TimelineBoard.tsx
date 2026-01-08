import React, { useMemo } from 'react';
import { User } from 'lucide-react';
import { Task, RenderTask, TaskStatus, TaskCategory, TaskPriority } from '../types';
import { MONTHS, STATUS_COLORS } from '../constants';

interface TimelineBoardProps {
  tasks: Task[];
  filterText: string;
  filterStatus: string;
  filterCategory: string;
  onTaskClick: (task: Task) => void;
}

const TimelineBoard: React.FC<TimelineBoardProps> = ({
  tasks,
  filterText,
  filterStatus,
  filterCategory,
  onTaskClick
}) => {
  // Logic to process tasks: filter and assign lanes (rows) to prevent overlap
  const processedTasks = useMemo(() => {
    // 1. Filter
    const filtered = tasks.filter(t => {
      const matchText =
        t.title.toLowerCase().includes(filterText.toLowerCase()) ||
        t.owner.toLowerCase().includes(filterText.toLowerCase());
      const matchStatus = filterStatus === 'all' || t.status === filterStatus;
      const matchCategory = filterCategory === 'all' || t.category === filterCategory;
      return matchText && matchStatus && matchCategory;
    });

    // 2. Define priority order (lower number = higher priority)
    const priorityOrder: Record<TaskPriority, number> = {
      [TaskPriority.URGENT]: 1,
      [TaskPriority.VERY_HIGH]: 2,
      [TaskPriority.HIGH]: 3,
      [TaskPriority.NORMAL]: 4,
      [TaskPriority.LOW]: 5,
    };

    // 3. Sort by priority first, then by start month
    filtered.sort((a, b) => {
      const priorityA = priorityOrder[a.priority] || 4;
      const priorityB = priorityOrder[b.priority] || 4;
      if (priorityA !== priorityB) return priorityA - priorityB;
      return a.startMonth - b.startMonth || (b.endMonth - a.endMonth);
    });

    // 3. Lane assignment algorithm
    const lanes: Task[][] = [];
    const result: RenderTask[] = [];

    filtered.forEach(task => {
      let assignedLane = 0;
      while (true) {
        const laneTasks = lanes[assignedLane];
        // Check if this task overlaps with any task in the current lane
        const hasConflict = laneTasks && laneTasks.some(existing =>
          !(task.endMonth < existing.startMonth || task.startMonth > existing.endMonth)
        );

        if (!hasConflict) break;
        assignedLane++;
      }

      if (!lanes[assignedLane]) lanes[assignedLane] = [];
      lanes[assignedLane].push(task);
      result.push({ ...task, _lane: assignedLane });
    });

    return result;
  }, [tasks, filterText, filterStatus, filterCategory]);

  return (
    <div className="w-full timeline-wrapper custom-scrollbar rounded-3xl border border-slate-200 bg-white/50 backdrop-blur-md overflow-hidden shadow-2xl shadow-slate-200/50">
      <div className="min-w-[1000px] relative">
        {/* Month Headers */}
        <div className="grid grid-cols-12 sticky top-0 z-30">
          {MONTHS.map(month => (
            <div key={month} className="bg-white/90 backdrop-blur-md text-slate-600 py-4 text-center font-bold text-sm tracking-wider border-r border-slate-100 border-b border-slate-100 last:border-r-0 uppercase shadow-sm">
              {month}
            </div>
          ))}
        </div>

        {/* Timeline Grid */}
        <div className="relative min-h-[600px] grid grid-cols-12 bg-slate-50/50">
          {/* Vertical Grid Lines */}
          <div className="absolute inset-0 grid grid-cols-12 pointer-events-none z-0">
            {MONTHS.map(month => (
              <div key={month} className="border-r border-slate-200/50 h-full w-full" />
            ))}
          </div>

          {/* Tasks Layer */}
          <div className="col-span-12 relative z-10 py-6 grid grid-cols-12 auto-rows-[90px] gap-y-3 px-2">
            {processedTasks.map(task => {
              const getStatusColor = (s: string) => {
                switch (s) {
                  case TaskStatus.COMPLETED: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
                  case TaskStatus.IN_PROGRESS: return 'bg-blue-50 text-blue-600 border-blue-100';
                  default: return 'bg-slate-50 text-slate-500 border-slate-100';
                }
              };
              const statusClass = getStatusColor(task.status);

              return (
                <div
                  key={task.id}
                  onClick={() => onTaskClick(task)}
                  className="group relative mx-1 pt-0.5 pb-2 px-2 glass-card rounded-2xl shadow-sm border border-slate-300 cursor-pointer transition-all duration-300 bg-white flex flex-col h-full z-10 hover:z-50"
                  style={{
                    gridColumnStart: task.startMonth,
                    gridColumnEnd: task.endMonth + 1,
                    gridRowStart: task._lane + 1,
                  }}
                >
                  <div className="absolute top-0 left-0 bottom-0 w-1.5 rounded-l-2xl" style={{ backgroundColor: task.color }} />

                  {/* Normal Content (Visible by default, hidden on hover) */}
                  <div className="flex flex-col h-full justify-between relative z-10 group-hover:opacity-0 transition-opacity duration-200">
                    <div className="flex items-center justify-between pl-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${statusClass}`}>
                        {task.status}
                      </span>
                    </div>

                    <div className="font-bold text-slate-900 text-sm leading-tight pl-3 pr-2 line-clamp-2" title={task.title}>
                      {task.title}
                    </div>

                    <div className="flex items-center gap-1.5 pl-3 text-slate-500">
                      <User className="w-3 h-3" />
                      <span className="text-xs font-medium truncate">{task.owner}</span>
                    </div>
                  </div>

                  {/* Popover Card (Visible on hover) */}
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 w-[110%] min-w-[200px] bg-white rounded-2xl shadow-xl border border-slate-100 p-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 scale-95 group-hover:scale-100 z-50 flex flex-col gap-3
                      ${task.startMonth === 1 ? 'left-0 translate-x-0 origin-left' :
                        task.endMonth === 12 ? 'right-0 translate-x-0 origin-right' :
                          'left-1/2 -translate-x-1/2 origin-center'}`}
                  >
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 rounded-l-2xl" style={{ backgroundColor: task.color }} />

                    <div className="pl-3 flex justify-between items-start">
                      <div className="flex gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${statusClass}`}>
                          {task.status}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase bg-slate-100 px-2 py-0.5 rounded-full">
                          {task.category}
                        </span>
                      </div>
                    </div>

                    <div className="pl-3">
                      <h4 className="font-bold text-slate-900 text-lg leading-tight mb-1">{task.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <User className="w-3 h-3" />
                        <span>{task.owner}</span>
                        <span className="text-slate-300">|</span>
                        <span className="font-mono">
                          {task.startMonth === task.endMonth ? `${task.startMonth}월` : `${task.startMonth}-${task.endMonth}월`}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                        {task.description || '상세 설명이 없습니다.'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineBoard;