import { AppData, TaskCategory, TaskPriority, TaskStatus, TaskType } from './types';

export const INITIAL_DATA: AppData = {
  year: 2026,
  tasks: [
    { id: 'T1', title: '연간 안전 교육', startMonth: 1, endMonth: 2, owner: '안전팀', status: TaskStatus.COMPLETED, type: TaskType.PERIODIC, category: TaskCategory.SAFETY, color: '#1e40af', priority: TaskPriority.NORMAL },
    { id: 'T2', title: '정기 건강 검진', startMonth: 2, endMonth: 5, owner: '보건팀', status: TaskStatus.IN_PROGRESS, type: TaskType.PERIODIC, category: TaskCategory.HEALTH, color: '#be185d', priority: TaskPriority.HIGH },
    { id: 'T3', title: '현장 안전 점검', startMonth: 3, endMonth: 7, owner: '안전팀', status: TaskStatus.IN_PROGRESS, type: TaskType.PERIODIC, category: TaskCategory.SAFETY, color: '#0369a1', priority: TaskPriority.URGENT },
    { id: 'T4', title: '보건 관리 시스템 구축', startMonth: 4, endMonth: 4, owner: '보건팀', status: TaskStatus.COMPLETED, type: TaskType.SPECIAL, category: TaskCategory.HEALTH, color: '#b91c1c', priority: TaskPriority.VERY_HIGH },
    { id: 'T5', title: '기타 운영 지원', startMonth: 6, endMonth: 10, owner: '총무팀', status: TaskStatus.SCHEDULED, type: TaskType.PERIODIC, category: TaskCategory.ETC, color: '#d97706', priority: TaskPriority.LOW },
    { id: 'T6', title: '하반기 안전 캠페인', startMonth: 8, endMonth: 12, owner: '안전팀', status: TaskStatus.SCHEDULED, type: TaskType.SPECIAL, category: TaskCategory.SAFETY, color: '#7c3aed', priority: TaskPriority.NORMAL },
    { id: 'T7', title: '연말 성과 보고', startMonth: 11, endMonth: 12, owner: '기획팀', status: TaskStatus.SCHEDULED, type: TaskType.PERIODIC, category: TaskCategory.ETC, color: '#1e293b', priority: TaskPriority.HIGH }
  ]
};

export const MONTHS = Array.from({ length: 12 }, (_, i) => `${i + 1}월`);

export const STATUS_COLORS = {
  [TaskStatus.SCHEDULED]: { bg: 'bg-slate-100', text: 'text-slate-600' },
  [TaskStatus.IN_PROGRESS]: { bg: 'bg-blue-100', text: 'text-blue-600' },
  [TaskStatus.COMPLETED]: { bg: 'bg-green-100', text: 'text-green-600' }
};