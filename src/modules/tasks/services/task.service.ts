import { Task } from '../entities/task.entity';
import { TaskRepository } from '../repositories/task.repository';

interface CreateTaskDTO {
  title: string;
  description?: string;
  category: string;
  dueDate: Date;
  dueTime: string;
}

export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async create(data: CreateTaskDTO): Promise<Task> {
    const task = new Task();
    Object.assign(task, data);

    return this.taskRepository.create(task);
  }
}
