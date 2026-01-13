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

  const getStatusColor = (s: string) => {
    switch (s) {
      case TaskStatus.SCHEDULED: return 'bg-slate-50 border-slate-200';
      case TaskStatus.IN_PROGRESS: return 'bg-blue-50 border-blue-200';
      case TaskStatus.COMPLETED: return 'bg-emerald-50 border-emerald-200';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  const getStatusBadgeColor = (s: string) => {
    switch (s) {
      case TaskStatus.SCHEDULED: return 'bg-slate-100 text-slate-600 border-slate-200';
      case TaskStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-600 border-blue-200';
      case TaskStatus.COMPLETED: return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getPriorityBadge = (p: TaskPriority) => {
    if (p === TaskPriority.URGENT) return <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded animate-pulse">긴급</span>;
    if (p === TaskPriority.VERY_HIGH || p === TaskPriority.HIGH) return <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">중요</span>;
    return null;
  };

  const renderSection = (title: string, processedTasks: RenderTask[], minHeight: string = "200px") => (
    <div className="mb-0">
      {/* Section Header */}
      <div className="sticky left-0 right-0 z-20 bg-slate-100/95 backdrop-blur-sm border-y border-slate-300 px-6 py-2">
        <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
          {title === '주기적인 업무' ? '🔄' : '✨'} {title}
        </h3>
      </div>

      {/* Timeline Grid */}
      <div className="relative grid grid-cols-12 bg-white/50" style={{ minHeight }}>
        {/* Vertical Grid Lines - Darker */}
        <div className="absolute inset-0 grid grid-cols-12 pointer-events-none z-0">
          {MONTHS.map(month => (
            <div key={month} className="border-r border-slate-300 h-full w-full" />
          ))}
        </div>

        {/* Tasks Layer */}
        <div className="col-span-12 relative z-10 py-4 grid grid-cols-12 auto-rows-[80px] gap-y-2 px-1">
          {processedTasks.map(task => {
            // Determine transform origin based on position
            const getTransformOrigin = () => {
              if (task.startMonth <= 2) return 'origin-left';
              if (task.endMonth >= 11) return 'origin-right';
              return 'origin-center';
            };

            return (
              <div
                key={task.id}
                onClick={() => onTaskClick(task)}
                className={`relative group cursor-pointer mx-0.5 p-3 rounded-xl border transition-all duration-300 
                  hover:scale-[1.15] hover:z-50 hover:shadow-2xl hover:p-4 ${getTransformOrigin()} ${getStatusColor(task.status)}`}
                style={{
                  gridColumnStart: task.startMonth,
                  gridColumnEnd: task.endMonth + 1,
                  gridRowStart: task._lane + 1,
                }}
              >
                {/* Color Bar */}
                <div className="absolute top-0 left-0 bottom-0 w-1.5 rounded-l-xl" style={{ backgroundColor: task.color }} />

                {/* Content - grows on hover */}
                <div className="flex flex-col h-full pl-2 overflow-hidden">
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className={`text-[8px] group-hover:text-[10px] transition-all px-1 py-0.5 rounded font-bold border ${getStatusBadgeColor(task.status)}`}>
                      {task.status}
                    </span>
                    {getPriorityBadge(task.priority)}
                  </div>
                  <h4 className="font-bold text-slate-800 text-[11px] group-hover:text-sm transition-all leading-tight flex-1">
                    {task.title}
                  </h4>
                  <div className="mt-auto">
                    <span className="text-[9px] group-hover:text-xs transition-all text-slate-500 block truncate">
                      👤 {task.owner}
                    </span>
                    <span className="text-[8px] group-hover:text-[10px] transition-all text-slate-400 font-mono hidden group-hover:block mt-0.5">
                      📅 {task.startMonth === task.endMonth ? `${task.startMonth}월` : `${task.startMonth}~${task.endMonth}월`}
                    </span>
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
    <div className="w-full timeline-wrapper rounded-3xl border border-slate-200 bg-white/50 backdrop-blur-md shadow-2xl shadow-slate-200/50 overflow-hidden">
      <div className="max-h-[70vh] overflow-y-auto overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] relative">
          {/* Month Headers - Sticky */}
          <div className="grid grid-cols-12 sticky top-0 z-40 shadow-md">
            {MONTHS.map(month => (
              <div key={month} className="bg-white text-slate-700 py-3 text-center font-bold text-sm tracking-wider border-r border-slate-300 border-b-2 border-b-slate-300 last:border-r-0 uppercase">
                {month}
              </div>
            ))}
          </div>

          {/* Periodic Tasks Section */}
          {renderSection('주기적인 업무', periodicData.result, "280px")}

          {/* Special Tasks Section */}
          {renderSection('특별 업무', specialData.result, "180px")}
        </div>
      </div>
    </div>
  );
};

export default TimelineBoard;