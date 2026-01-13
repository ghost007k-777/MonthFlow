import React, { useMemo } from 'react';
import { User } from 'lucide-react';
import { Task, RenderTask, TaskStatus, TaskCategory, TaskPriority, TaskType } from '../types';
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
  // Helper function to process tasks and assign lanes
  const processTasks = (targetTasks: Task[]) => {
    // 1. Filter
    const filtered = targetTasks.filter(t => {
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

    // 4. Lane assignment algorithm
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

    return { result, laneCount: lanes.length };
  };

  const periodicData = useMemo(() => processTasks(tasks.filter(t => t.type === TaskType.PERIODIC || !t.type)), [tasks, filterText, filterStatus, filterCategory]);
  const specialData = useMemo(() => processTasks(tasks.filter(t => t.type === TaskType.SPECIAL)), [tasks, filterText, filterStatus, filterCategory]);

  const renderSection = (title: string, processedTasks: RenderTask[], minHeight: string = "200px") => (
    <div className="mb-0">
      {/* Section Header */}
      <div className="sticky left-0 right-0 z-20 bg-slate-50/95 backdrop-blur-sm border-y border-slate-200 px-6 py-2">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
          {title === '주기적인 업무' ? '🔄' : '✨'} {title}
        </h3>
      </div>

      {/* Timeline Grid */}
      <div className="relative grid grid-cols-12 bg-white/50" style={{ minHeight }}>
        {/* Vertical Grid Lines */}
        <div className="absolute inset-0 grid grid-cols-12 pointer-events-none z-0">
          {MONTHS.map(month => (
            <div key={month} className="border-r border-slate-100/80 h-full w-full" />
          ))}
        </div>

        {/* Tasks Layer */}
        <div className="col-span-12 relative z-10 py-6 grid grid-cols-12 auto-rows-[90px] gap-y-3 px-2">
          {processedTasks.map(task => {
            const getStatusColor = (s: string) => {
              switch (s) {
                case TaskStatus.SCHEDULED: return 'bg-slate-50 border-slate-200';
                case TaskStatus.IN_PROGRESS: return 'bg-blue-50 border-blue-200';
                case TaskStatus.COMPLETED: return 'bg-emerald-50 border-emerald-200';
                default: return 'bg-slate-50 border-slate-200';
              }
            };

            const getPriorityBadge = (p: TaskPriority) => {
              if (p === TaskPriority.URGENT) return <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded ml-2 animate-pulse">긴급</span>;
              if (p === TaskPriority.VERY_HIGH || p === TaskPriority.HIGH) return <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded ml-2">중요</span>;
              return null;
            };

            return (
              <div
                key={task.id}
                onClick={() => onTaskClick(task)}
                className={`relative group cursor-pointer p-4 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01] ${getStatusColor(task.status)}`}
                style={{
                  gridColumnStart: task.startMonth,
                  gridColumnEnd: task.endMonth + 1,
                  gridRowStart: task._lane + 1,
                }}
              >
                <div className={`absolute top-0 left-0 bottom-0 w-1.5 rounded-l-2xl`} style={{ backgroundColor: task.color }} />

                <div className="flex flex-col h-full justify-between pl-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{task.category}</span>
                      {getPriorityBadge(task.priority)}
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2" title={task.title}>{task.title}</h4>
                  </div>

                  <div className="flex items-center gap-1.5 mt-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm`} style={{ backgroundColor: task.color }}>
                      {task.owner[0]}
                    </div>
                    <span className="text-xs font-bold text-slate-500 truncate">{task.owner}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full timeline-wrapper custom-scrollbar rounded-3xl border border-slate-200 bg-white/50 backdrop-blur-md overflow-x-auto shadow-2xl shadow-slate-200/50">
      <div className="min-w-[1000px] relative">
        {/* Month Headers */}
        <div className="grid grid-cols-12 sticky top-0 z-30 shadow-sm">
          {MONTHS.map(month => (
            <div key={month} className="bg-white/95 backdrop-blur-md text-slate-600 py-4 text-center font-bold text-sm tracking-wider border-r border-slate-100 border-b border-slate-100 last:border-r-0 uppercase">
              {month}
            </div>
          ))}
        </div>

        {/* Periodic Tasks Section */}
        {renderSection('주기적인 업무', periodicData.result, "300px")}

        {/* Special Tasks Section */}
        {renderSection('특별 업무', specialData.result, "200px")}
      </div>
    </div>
  );
};

export default TimelineBoard;