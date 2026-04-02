export type Course = {
  id: string;
  title: string;
  instructor: string;
  color: string;
  notes?: string;
  createdAt?: string | null;
};

export type Task = {
  id: string;
  title: string;
  courseId?: string;
  deadline?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  details?: string;
  createdAt?: string;
};

export type StudySession = {
  id: string;
  title: string;
  duration: number;
  date: string;
  summary?: string;
  createdAt?: string;
};

export type AiPlan = {
  id: string;
  prompt: string;
  result: string;
  createdAt?: string;
};
