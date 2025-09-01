import Dexie, {Table} from 'dexie';
import type {Goal, Task} from './types.ts';

class AppDB extends Dexie {
  goals!: Table<Goal, string>;
  tasks!: Table<Task, string>;

  constructor() {
    super('goal-backcast-db');
    this.version(1).stores({
      goals: 'id, title, updatedAt',
      tasks: 'id, goalId, status, updatedAt',
    })
  }
}

export const db = new AppDB();

