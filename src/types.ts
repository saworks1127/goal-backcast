export type Id = string;
export type TaskStatus = 'Todo' | 'Doing' | 'Done';

export interface Goal {
  id: Id;
  title: string;
  doneCriteria: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: Id;
  goalId: Id;
  title: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}