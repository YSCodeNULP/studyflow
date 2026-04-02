export type Course = {
  id: string;
  title: string;
  instructor: string;
  notes: string;
  color: string;
  createdAt?: unknown;
};

export type Task = {
  id: string;
  title: string;
  courseId?: string;
  details?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
  deadline?: string;
  createdAt?: unknown;
};

export type StudySession = {
  id: string;
  title: string;
  duration: string;
  date: string;
  summary?: string;
  createdAt?: unknown;
};

export type AIPlan = {
  id: string;
  prompt: string;
  result: string;
  createdAt?: unknown;
};
