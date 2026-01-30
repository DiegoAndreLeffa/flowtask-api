import { ITaskRule } from './task-rule.interface';
import { Task } from '../entities/task.entity';
import { TaskRepository } from '../repositories/task.repository';

export class PriorityRule implements ITaskRule {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  /**
   * Ajusta a prioridade da tarefa dinamicamente
   * Prioridade:
   * 1 - baixa
   * 2 - média
   * 3 - alta
   * 4 - crítica
   */
  async execute(task: Task, userId: string): Promise<void> {
    let priority = task.priority ?? 1;

    /**
     * Regra 1: prazo próximo (até 24h)
     */
    if (this.isDueSoon(task)) {
      priority += 1;
    }

    /**
     * Regra 2: muitas tarefas atrasadas
     */
    const overdueCount =
      await this.taskRepository.countOverdueTasks(userId);

    if (overdueCount >= 5) {
      priority += 1;
    }

    /**
     * Limites de prioridade
     */
    if (priority > 4) priority = 4;
    if (priority < 1) priority = 1;

    task.priority = priority;
  }

  private isDueSoon(task: Task): boolean {
    if (!task.dueDate || !task.dueTime) return false;

    const now = new Date();
    const due = new Date(`${task.dueDate}T${task.dueTime}`);

    const diffInHours =
      (due.getTime() - now.getTime()) / (1000 * 60 * 60);

    return diffInHours > 0 && diffInHours <= 24;
  }
}
