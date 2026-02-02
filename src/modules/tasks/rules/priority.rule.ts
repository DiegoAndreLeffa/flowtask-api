import { ITaskRule } from './task-rule.interface';
import { Task, TaskPriority } from '../entities/task.entity';
import { TaskRepository } from '../repositories/task.repository';

export class PriorityRule implements ITaskRule {
  private taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async execute(task: Task, userId: string): Promise<void> {
    // 1. Mapear Enum para Número
    const priorityMap: Record<string, number> = {
      [TaskPriority.LOW]: 1,
      [TaskPriority.MEDIUM]: 2,
      [TaskPriority.HIGH]: 3,
      [TaskPriority.CRITICAL]: 4,
    };

    // 2. Mapear Número de volta para Enum
    const numberToEnum: Record<number, TaskPriority> = {
      1: TaskPriority.LOW,
      2: TaskPriority.MEDIUM,
      3: TaskPriority.HIGH,
      4: TaskPriority.CRITICAL,
    };

    let currentPriorityValue = priorityMap[task.priority] || 1;

    // Regra 1: Prazo próximo (24h)
    if (this.isDueSoon(task)) {
      currentPriorityValue += 1;
    }

    // Regra 2: Muitas tarefas atrasadas
    const overdueCount = await this.taskRepository.countOverdueTasks(userId);
    if (overdueCount >= 5) {
      currentPriorityValue += 1;
    }

    // Limites
    if (currentPriorityValue > 4) currentPriorityValue = 4;
    if (currentPriorityValue < 1) currentPriorityValue = 1;

    // Atualiza a task com o novo Enum
    task.priority = numberToEnum[currentPriorityValue];
  }

  private isDueSoon(task: Task): boolean {
    if (!task.dueDate || !task.dueTime) return false;

    const now = new Date();
    // Junta Data e Hora para comparar
    const due = new Date(`${task.dueDate}T${task.dueTime}`);

    const diffInHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

    return diffInHours > 0 && diffInHours <= 24;
  }
}