import {create} from 'zustand';
import type {Goal, Task, Id, TaskStatus} from './types';

const uid = (): Id => Math.random().toString(36).slice(2) + Date.now().toString(36);

interface State {
  goals: Goal[];
  tasks: Task[];
  addGoal: (p: Pick<Goal, 'title' | 'doneCriteria'>) => void;
  removeGoal: (goalId: Id) => void;
  addTask: (goalId: Id, title: string) => void;
  setTaskStatus: (taskId: Id, status: TaskStatus) => void;
  toggleTaskDone: (taskId: Id) => void;
}

export const useAppStore = create<State>((set) => ({
  goals: [],
  tasks: [],
  addGoal: (g) => set((s) => ({goals: [...s.goals, {id: uid(), ...g}]})),
  removeGoal: (goalId) =>
    set((s) => ({
      goals: s.goals.filter((g) => g.id !== goalId),
      tasks: s.tasks.filter((t) => t.goalId !== goalId),
    })),
  addTask: (goalId, title) =>
    set((s) => ({tasks: [...s.tasks, {id: uid(), goalId, title, status: 'Todo'}]})),
  setTaskStatus: (taskId, status) =>
    set((s) => ({tasks: s.tasks.map((t) => t.id === taskId ? {...t, status} : t)})),
  toggleTaskDone: (taskId) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === taskId ? {...t, status: t.status === 'Done' ? 'Todo' : 'Done'} : t)),
    })),
}));

