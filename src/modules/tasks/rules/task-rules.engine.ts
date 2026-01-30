import { Task } from '../entities/task.entity';
import { ITaskRule } from './task-rule.interface';
import { ConflictRule } from './conflict.rule';
import { PriorityRule } from './priority.rule';

export class TaskRulesEngine {
  private rules: ITaskRule[];

  constructor() {
    this.rules = [
      new ConflictRule(),
      new PriorityRule(),
    ];
  }

  /**
   * Executa todas as regras de negócio da task
   * A ordem importa!
   */
  async execute(task: Task, userId: string): Promise<void> {
    for (const rule of this.rules) {
      await rule.execute(task, userId);
    }
  }
}
