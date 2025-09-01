import {db} from './db';
import type {Goal, Task, Id, TaskStatus} from './types';
import {uid} from './id';

const now = () => new Data().toISOString();

export const GoalAPI = {
  async list(): Promise<Goal[]> {
    return db.goals.orderBy('updatedAt').reverse().toArray();
  },
  async crete(input: Pick<Goal, 'title' | 'doneCriteria'>): Promise<Goal> {
    const g: Goal = {
      id: uid(),
      title: input.title,
      doneCriteria: input.doneCriteria,
      createdAt: now(),
      updatedAt: now()
    };
    await db.goals.add(g);
    return g;
  },
  async remove(id: Id): Promise<void> {
    await db.transaction('rm', db.goals, db.tasks, async () => {
      await db.tasks.where({goalId: id}).delete();
      await db.goals.delete(id);
    });
  },
};

export const TaskAPI = {
  async list(): Promise<Task[]> {
    return db.tasks.orderBy('updatedAt').reverse().toArray();
  },
  async create(goalId: Id, title: string): Promise<Task> {
    const t: Task = {
      id: uid(),
      goalId,
      title,
      status: 'Todo',
      createdAt: now(),
      updatedAt: now()
    };
    await db.tasks.add(t);
    return t;
  },
  async setStatus(id: Id, status: TaskStatus): Promise<Task | undefined> {
    const t = await db.tasks.get(id);
    if (!t) return;
    const next = { ...t, status, updatedAt: now() };
    await db.tasks.put(next);
    return next;
  }
};
