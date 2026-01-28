import { TaskRule } from './task-rule.interface';
import { Task, TaskPriority } from '../entities/task.entity';

export class PriorityRule implements TaskRule {
  async apply(task: Task): Promise<void> {
    const now = new Date();
    const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`);

    const diffInHours =
      (dueDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffInHours <= 24) {
      task.priority = TaskPriority.CRITICAL;
    } else if (diffInHours <= 72) {
      task.priority = TaskPriority.HIGH;
    }
  }
}
