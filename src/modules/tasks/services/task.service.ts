import { TaskRepository } from '../repositories/task.repository';
import { Task, TaskPriority, TaskStatus } from '../entities/task.entity';
import { TaskRulesEngine } from '../rules/task-rules.engine';
import { AppError } from '../../../shared/errors/AppError';

interface CreateTaskDTO {
  userId: string;
  title: string;
  description?: string;
  category?: string;
  priority: TaskPriority;
  dueDate: string;
  dueTime?: string;
  status?: TaskStatus;
}

interface UpdateTaskDTO {
  taskId: string;
  userId: string;
  data: Partial<Omit<CreateTaskDTO, 'userId'>>;
}

interface FindTaskDTO {
  taskId: string;
  userId: string;
}

export class TaskService {
  private taskRepository: TaskRepository;
  private rulesEngine: TaskRulesEngine;

  constructor() {
    this.taskRepository = new TaskRepository();
    this.rulesEngine = new TaskRulesEngine();
  }

  async create(data: CreateTaskDTO): Promise<Task> {
    const task = this.taskRepository.create({
      ...data,
      status: TaskStatus.PENDING,
    });

    await this.rulesEngine.execute(task, data.userId);

    return this.taskRepository.save(task);
  }

  async listByUser(userId: string): Promise<Task[]> {
    return this.taskRepository.findByUser(userId);
  }

  async findById({ taskId, userId }: FindTaskDTO): Promise<Task> {
    const task = await this.taskRepository.findById(taskId);
    if (!task || task.userId !== userId) {
      throw new AppError('Task not found', 404);
    }
    return task;
  }

  async update({ taskId, userId, data }: UpdateTaskDTO): Promise<Task> {
    const task = await this.findById({ taskId, userId });
    Object.assign(task, data);
    await this.rulesEngine.execute(task, userId);
    return this.taskRepository.save(task);
  }

  async delete({ taskId, userId }: FindTaskDTO): Promise<void> {
    const task = await this.findById({ taskId, userId });
    await this.taskRepository.remove(task);
  }
}