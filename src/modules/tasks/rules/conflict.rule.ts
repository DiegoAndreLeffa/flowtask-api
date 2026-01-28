import { TaskRule } from './task-rule.interface';
import { Task } from '../entities/task.entity';
import { TaskRepository } from '../repositories/task.repository';
import { AppError } from '../../../shared/errors/AppError';


export class ConflictRule implements TaskRule {
  constructor(private taskRepository: TaskRepository) {}

  async apply(task: Task): Promise<void> {
    const tasksOnSameDay = await this.taskRepository.findByDate(task.dueDate);

    const hasConflict = tasksOnSameDay.some(
      existingTask => existingTask.dueTime === task.dueTime
    );

    if (hasConflict) {
      throw new AppError(
        'Task conflict detected: another task is scheduled for this time',
        409
      );
    }
  }
}
