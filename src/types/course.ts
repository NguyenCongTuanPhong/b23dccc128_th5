export enum CourseStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  PAUSED = 'PAUSED'
}

export interface Course {
  id: string;
  name: string;
  instructor: string;
  studentCount: number;
  description: string;
  status: CourseStatus;
}

export interface CourseFormData {
  name: string;
  instructor: string;
  studentCount: number;
  description: string;
  status: CourseStatus;
}

export interface CourseFilter {
  instructor?: string;
  status?: CourseStatus;
  searchText?: string;
} 