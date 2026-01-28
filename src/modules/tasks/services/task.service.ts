import { Task } from '../entities/task.entity';
import { TaskRepository } from '../repositories/task.repository';
import { TaskRulesEngine } from '../rules/task-rules.engine';
import { ConflictRule } from '../rules/conflict.rule';
import { PriorityRule } from '../rules/priority.rule';

interface CreateTaskDTO {
  title: string;
  description?: string;
  category: string;
  dueDate: Date;
  dueTime: string;
}

export class TaskService {
  constructor(private taskRepository: TaskRepository) {}

  async create(data: CreateTaskDTO): Promise<Task> {
    const task = new Task();
    Object.assign(task, data);

    const rulesEngine = new TaskRulesEngine([
      new ConflictRule(this.taskRepository),
      new PriorityRule(),
    ]);

    await rulesEngine.apply(task);

    return this.taskRepository.create(task);
  }
}
