import { Task, TaskPriority } from '../entities/task.entity';

export class PriorityRule {
  async apply(task: Task): Promise<void> {
    if (!task.dueDate) {
      task.priority = TaskPriority.LOW;
      return;
    }

    const now = new Date().getTime();
    const due = task.dueDate.getTime();

    const diffInHours = (due - now) / (1000 * 60 * 60);

    if (diffInHours <= 24) {
      task.priority = TaskPriority.CRITICAL;
      return;
    }

    if (diffInHours <= 72) {
      task.priority = TaskPriority.HIGH;
      return;
    }

    task.priority = TaskPriority.LOW;
  }
}
