import { Task } from '../entities/task.entity';

export interface ITaskRule {
  execute(task: Task, userId: string): Promise<void>;
}
