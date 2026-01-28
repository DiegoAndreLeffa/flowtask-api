import { ConflictRule } from '../modules/tasks/rules/conflict.rule';
import { Task } from '../modules/tasks/entities/task.entity';
import { AppError } from '../shared/errors/AppError';

describe('ConflictRule', () => {
  it('should throw error when there is a task with same time', async () => {
    const fakeRepository = {
      findByDate: jest.fn().mockResolvedValue([
        { dueTime: '10:00' },
      ]),
    } as any;

    const rule = new ConflictRule(fakeRepository);
    const task = new Task();

    task.dueDate = new Date();
    task.dueTime = '10:00';

    await expect(rule.apply(task)).rejects.toBeInstanceOf(AppError);
  });

  it('should allow task when there is no conflict', async () => {
    const fakeRepository = {
      findByDate: jest.fn().mockResolvedValue([]),
    } as any;

    const rule = new ConflictRule(fakeRepository);
    const task = new Task();

    task.dueDate = new Date();
    task.dueTime = '11:00';

    await expect(rule.apply(task)).resolves.not.toThrow();
  });
});
