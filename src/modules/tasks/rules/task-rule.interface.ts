import { Task } from '../entities/task.entity';

export interface TaskRule {
  apply(task: Task, context?: any): Promise<void>;
}
