import { PriorityRule } from '../modules/tasks/rules/priority.rule';
import { Task, TaskPriority } from '../modules/tasks/entities/task.entity';

describe('PriorityRule', () => {
  it('should set priority to CRITICAL when task is due in less than 24 hours', async () => {
    const rule = new PriorityRule();
    const task = new Task();

    const now = new Date();
    const dueDate = new Date(now.getTime() + 1000 * 60 * 60 * 5); // 5h

    task.dueDate = new Date(dueDate.toDateString());
    task.dueTime = dueDate.toTimeString().slice(0, 5);
    task.priority = TaskPriority.LOW;

    await rule.apply(task);

    expect(task.priority).toBe(TaskPriority.CRITICAL);
  });

  it('should set priority to HIGH when task is due in less than 72 hours', async () => {
    const rule = new PriorityRule();
    const task = new Task();

    const now = new Date();
    const dueDate = new Date(now.getTime() + 1000 * 60 * 60 * 48); // 48h

    task.dueDate = new Date(dueDate.toDateString());
    task.dueTime = dueDate.toTimeString().slice(0, 5);

    await rule.apply(task);

    expect(task.priority).toBe(TaskPriority.HIGH);
  });
});
