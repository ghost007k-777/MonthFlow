import React, { useState, useEffect } from 'react';
import { X, Edit2, Trash2, Calendar, User, Clock, FileText, AlertTriangle } from 'lucide-react';
import { Task, TaskStatus, TaskCategory, TaskPriority, TaskType } from '../types';
import { MONTHS } from '../constants';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete: (taskId: string) => void;
  editingTask: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, onDelete, editingTask }) => {
  const [mode, setMode] = useState<'view' | 'edit'>('edit');
  const [formData, setFormData] = useState<Task>({
    id: '',
    title: '',
    startMonth: 1,
    endMonth: 1,
    owner: '',
    status: TaskStatus.SCHEDULED,
    type: TaskType.PERIODIC,
    category: TaskCategory.SAFETY,
    color: '#3b82f6',
    priority: TaskPriority.NORMAL,
    description: ''
  });

  useEffect(() => {
    if (editingTask) {
      setFormData(editingTask);
      setMode('view'); // Default to view mode when opening existing task
    } else {
      setFormData({
        id: '',
        title: '',
        startMonth: 1,
        endMonth: 1,
        owner: '',
        status: TaskStatus.SCHEDULED,
        type: TaskType.PERIODIC,
        category: TaskCategory.SAFETY,
        color: '#3b82f6',
        priority: TaskPriority.NORMAL,
        description: ''
      });
      setMode('edit'); // Default to edit mode for new task
    }
  }, [editingTask, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.endMonth < formData.startMonth) {
      alert('종료월이 시작월보다 빠를 수 없습니다.');
      return;
    }
    const taskToSave = {
      ...formData,
      id: formData.id || `T${Date.now()}`
    };
    onSave(taskToSave);
  };

  const handleChange = (field: keyof Task, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-lg px-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100/50 relative flex flex-col max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-start p-6 pb-4 border-b border-slate-100 shrink-0 relative z-10 bg-white">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {mode === 'view' ? '업무 상세 정보' : (editingTask ? '업무 수정' : '새로운 업무 추가')}
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {mode === 'view' ? '등록된 업무의 상세 내용을 확인합니다.' : '업무 일정을 등록하거나 수정합니다.'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar">
          {mode === 'view' ? (
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-sm relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 blur-xl" style={{ backgroundColor: formData.color }} />
                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 bg-white border border-slate-200 text-slate-500 shadow-sm">
                    {formData.category}
                  </span>
                  <h3 className="text-3xl font-bold text-slate-800 mb-2 leading-tight">{formData.title}</h3>
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <User className="w-4 h-4" />
                    <span>{formData.owner}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 mb-2 text-xs font-bold uppercase tracking-wider">
                    <Calendar className="w-3 h-3" /> 일정
                  </div>
                  <div className="font-bold text-slate-700">
                    {formData.startMonth}월 ~ {formData.endMonth}월
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 mb-2 text-xs font-bold uppercase tracking-wider">
                    <Clock className="w-3 h-3" /> 상태
                  </div>
                  <div className="font-bold text-slate-700">
                    {formData.status}
                  </div>
                </div>
              </div>

              {formData.description && (
                <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100/50">
                  <div className="flex items-center gap-2 text-amber-500 mb-2 text-xs font-bold uppercase tracking-wider">
                    <FileText className="w-3 h-3" /> 상세 설명
                  </div>
                  <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">
                    {formData.description}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  onClick={() => onDelete(formData.id)}
                  className="p-4 rounded-2xl border border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
                  title="삭제"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setFormData(prev => ({ ...prev, id: '', title: prev.title + ' (복사)' }));
                    setMode('edit');
                  }}
                  className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-500 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                  title="이 업무를 복사하여 새로운 업무로 등록"
                >
                  <FileText className="w-4 h-4" />
                  복사하기
                </button>
                <button
                  onClick={() => setMode('edit')}
                  className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  정보 수정
                </button>
              </div>
            </div>
          ) : (
            /* Edit Mode Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1 tracking-wider">업무명</label>
                <input
                  type="text"
                  required
                  placeholder="예: 1분기 마케팅 전략 수립"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-4 mt-1 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-bold placeholder-slate-400 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1 tracking-wider">상세 설명 (선택)</label>
                <textarea
                  rows={3}
                  placeholder="업무에 대한 상세한 내용을 입력하세요..."
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl p-4 mt-1 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium placeholder-slate-400 resize-none transition-all"
                />
              </div>

              <div className="mb-4">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1 tracking-wider">업무 유형</label>
                <div className="flex gap-3 mt-1">
                  {Object.values(TaskType).map((type) => (
                    <label
                      key={type}
                      className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData.type === type
                          ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold ring-1 ring-blue-200'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 font-medium'
                        }`}
                    >
                      <input
                        type="radio"
                        name="taskType"
                        value={type}
                        checked={formData.type === type}
                        onChange={(e) => handleChange('type', e.target.value as TaskType)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1 tracking-wider">시작월</label>
                  <select
                    value={formData.startMonth}
                    onChange={(e) => handleChange('startMonth', parseInt(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl p-4 mt-1 font-bold outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1 tracking-wider">종료월</label>
                  <select
                    value={formData.endMonth}
                    onChange={(e) => handleChange('endMonth', parseInt(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl p-4 mt-1 font-bold outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1 tracking-wider">담당자</label>
                  <input
                    type="text"
                    value={formData.owner}
                    onChange={(e) => handleChange('owner', e.target.value)}
                    placeholder="담당자 또는 팀명"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl p-4 mt-1 font-bold outline-none placeholder-slate-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1 tracking-wider">진행 상태</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value as TaskStatus)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl p-4 mt-1 font-bold outline-none cursor-pointer hover:bg-slate-100"
                  >
                    {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1 tracking-wider">카테고리</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value as TaskCategory)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl p-4 mt-1 font-bold outline-none cursor-pointer hover:bg-slate-100"
                  >
                    {Object.values(TaskCategory).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1 tracking-wider flex items-center gap-1">우선순위 <AlertTriangle className="w-3 h-3" /></label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value as TaskPriority)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl p-4 mt-1 font-bold outline-none cursor-pointer hover:bg-slate-100"
                  >
                    {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1 tracking-wider">테마 색상</label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mt-1 grid grid-cols-8 gap-2">
                  {[
                    '#ef4444', '#f97316', '#f59e0b', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
                    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#64748b'
                  ].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleChange('color', color)}
                      className={`w-6 h-6 rounded-full transition-all ${formData.color === color ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-110 hover:shadow-sm'}`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                  저장하기
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskModal;