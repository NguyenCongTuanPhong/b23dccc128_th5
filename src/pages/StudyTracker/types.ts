import { Dayjs } from 'dayjs';

// Interface cho môn học
export interface Subject {
  id: number;
  name: string;
}

// Interface cho buổi học
export interface StudySession {
  id: number;
  subjectId: number;
  date: string;
  duration: number;
  content: string;
  notes: string;
}

// Interface cho mục tiêu học tập
export interface StudyGoal {
  subjectId: number;
  targetHours: number;
}

// Interface cho session đang chỉnh sửa
export interface EditingSession {
  id?: number;
  subjectId: number;
  date: Dayjs;
  duration: number;
  content: string;
  notes: string;
}

// Props interfaces cho các components

export interface SubjectManagementProps {
  subjects: Subject[];
  onAddSubject: (name: string) => void;
  onEditSubject: (id: number, name: string) => void;
  onDeleteSubject: (id: number) => void;
}

export interface StudyProgressProps {
  sessions: StudySession[];
  subjects: Subject[];
  onAddSession: () => void;
  onEditSession: (session: StudySession) => void;
  onDeleteSession: (id: number) => void;
}

export interface StudyGoalsProps {
  subjects: Subject[];
  goals: StudyGoal[];
  sessions: StudySession[];
  onSetGoal: (goal: StudyGoal) => void;
}

// Interface cho Modal Session
export interface SessionModalProps {
  visible: boolean;
  editingSession: EditingSession;
  subjects: Subject[];
  onCancel: () => void;
  onOk: () => void;
  setEditingSession: (session: EditingSession) => void;
}

// Interface cho response từ API (nếu có)
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Enum cho trạng thái loading (nếu cần)
export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

// Interface cho filters (nếu cần)
export interface StudySessionFilters {
  subjectId?: number;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}

// Interface cho thống kê (nếu cần)
export interface StudyStatistics {
  totalHours: number;
  totalSessions: number;
  averageHoursPerSession: number;
  subjectStats: {
    subjectId: number;
    totalHours: number;
    completionPercentage: number;
  }[];
}