import React, { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, Search, Plus, Download, Upload } from 'lucide-react';
import TimelineBoard from './components/TimelineBoard';
import TaskModal from './components/TaskModal';
import { Task, AppData, TaskStatus, TaskCategory } from './types';
import { INITIAL_DATA } from './constants';

const App: React.FC = () => {
  // Load initial state from localStorage if available
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('monthflow_tasks');
    return saved ? JSON.parse(saved) : INITIAL_DATA.tasks;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Auto-save whenever tasks change
  useEffect(() => {
    localStorage.setItem('monthflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Filters
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handlers
  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (task: Task) => {
    setTasks(prev => {
      const exists = prev.find(t => t.id === task.id);
      if (exists) {
        return prev.map(t => t.id === task.id ? task : t);
      }
      return [...prev, task];
    });
    setIsModalOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('이 업무 일정을 보드에서 삭제하시겠습니까?')) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
      setIsModalOpen(false);
    }
  };

  const handleDownloadJSON = () => {
    const data: AppData = { year: 2026, tasks };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MonthFlow_Schedule_2026.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.tasks && Array.isArray(json.tasks)) {
          setTasks(json.tasks);
        } else {
          alert('올바르지 않은 JSON 형식입니다.');
        }
      } catch (err) {
        alert('JSON 파싱 오류가 발생했습니다.');
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen text-slate-900 p-6 md:p-12 max-w-[1920px] mx-auto bg-slate-50/50">
      {/* Header */}
      <header className="mb-12 flex flex-col xl:flex-row xl:items-center justify-between gap-8 animate-in slide-in-from-top-6 duration-700">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-3 rounded-2xl shadow-lg shadow-blue-500/20 ring-1 ring-blue-100">
              <LayoutDashboard className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 drop-shadow-sm">
                <span className="premium-gradient-text">MonthFlow</span> 대시보드
              </h1>
            </div>
          </div>
          <p className="text-slate-500 font-medium text-lg ml-1">CKD 본사 및 영업본부 2026 연간 로드맵</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-white/60 p-2 rounded-3xl border border-white/50 backdrop-blur-md shadow-xl shadow-slate-200/50">
          <div className="relative group">
            <input
              type="text"
              placeholder="업무명 또는 담당자 검색..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none w-64 lg:w-80 transition-all text-slate-700 placeholder-slate-400 hover:bg-slate-50 hover:shadow-inner"
            />
            <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
          </div>

          <div className="w-px h-8 bg-slate-200 mx-1 hidden sm:block"></div>

          <button
            onClick={handleAddTask}
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-2xl flex items-center gap-2 font-bold shadow-lg shadow-slate-300/50 transition-all active:scale-95 hover:shadow-slate-400/50 ring-1 ring-white/20"
          >
            <Plus className="w-5 h-5" />
            <span>업무 추가</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJSON}
              className="bg-white hover:bg-slate-50 text-slate-500 p-3.5 rounded-2xl transition-all shadow-md border border-slate-200 hover:border-slate-300 active:scale-95 hover:text-slate-700"
              title="데이터 저장 (JSON)"
            >
              <Download className="w-5 h-5" />
            </button>

            <button
              onClick={handleUploadClick}
              className="bg-white hover:bg-slate-50 text-slate-500 p-3.5 rounded-2xl transition-all shadow-md border border-slate-200 hover:border-slate-300 active:scale-95 hover:text-slate-700"
              title="데이터 불러오기"
            >
              <Upload className="w-5 h-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".json"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="mb-8 flex flex-wrap items-center gap-4 animate-in slide-in-from-top-8 duration-700 delay-100">
        <div className="flex items-center gap-3 glass-panel px-5 py-2.5 rounded-2xl bg-white border border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">진행 상태</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer hover:text-blue-600 transition-colors [&>option]:bg-white [&>option]:text-slate-700"
          >
            <option value="all">모든 상태</option>
            {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-3 glass-panel px-5 py-2.5 rounded-2xl bg-white border border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">카테고리</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer hover:text-blue-600 transition-colors [&>option]:bg-white [&>option]:text-slate-700"
          >
            <option value="all">모든 카테고리</option>
            {Object.values(TaskCategory).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Main Board */}
      <TimelineBoard
        tasks={tasks}
        filterText={searchText}
        filterStatus={filterStatus}
        filterCategory={filterCategory}
        onTaskClick={handleEditTask}
      />

      {/* Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        editingTask={editingTask}
      />
    </div>
  );
};

export default App;