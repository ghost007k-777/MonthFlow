export enum TaskStatus {
  SCHEDULED = '예정',
  IN_PROGRESS = '진행',
  COMPLETED = '완료'
}

export enum TaskCategory {
  SAFETY = '안전',
  HEALTH = '보건',
  ETC = '기타'
}

export enum TaskPriority {
  URGENT = '빠르게 처리 필요',
  VERY_HIGH = '매우 중요',
  HIGH = '중요',
  NORMAL = '적정',
  LOW = '천천히'
}

export interface Task {
  id: string;
  title: string;
  startMonth: number;
  endMonth: number;
  owner: string;
  status: TaskStatus;
  category: TaskCategory;
  color: string;
  priority: TaskPriority;
  description?: string;
  _lane?: number; // Internal use for timeline layout
}

export interface AppData {
  year: number;
  tasks: Task[];
}

// Helper type for rendering, adds the visual lane index
export interface RenderTask extends Task {
  _lane: number;
}