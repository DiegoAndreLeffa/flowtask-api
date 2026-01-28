import { TaskRule } from './task-rule.interface';
import { Task } from '../entities/task.entity';

export class TaskRulesEngine {
  constructor(private rules: TaskRule[]) {}

  async apply(task: Task): Promise<void> {
    for (const rule of this.rules) {
      await rule.apply(task);
    }
  }
}
