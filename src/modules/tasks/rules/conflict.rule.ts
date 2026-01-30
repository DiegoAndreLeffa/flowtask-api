import { ITaskRule } from './task-rule.interface';
import { Task } from '../entities/task.entity';
import { TaskRepository } from '../repositories/task.repository';
import { AppError } from '../../../shared/errors/AppError';

export class ConflictRule implements ITaskRule {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  /**
   * Verifica conflito de horário para o mesmo usuário
   */
  async execute(task: Task, userId: string): Promise<void> {
    if (!task.dueDate || !task.dueTime) {
      return;
    }

    const conflictingTask =
      await this.taskRepository.findByDateAndTime({
        userId,
        dueDate: task.dueDate,
        dueTime: task.dueTime,
        ignoreTaskId: task.id,
      });

    if (conflictingTask) {
      throw new AppError(
        'There is already a task scheduled for this date and time',
        409
      );
    }
  }
}
