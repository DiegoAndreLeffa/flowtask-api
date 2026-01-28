import { Request, Response } from 'express';
import { AppDataSource } from '../../../database/data-source';
import { TaskService } from '../services/task.service';
import { TaskRepository } from '../repositories/task.repository';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    const taskRepository = new TaskRepository(AppDataSource);
    this.taskService = new TaskService(taskRepository);

    this.create = this.create.bind(this);
  }

  async create(req: Request, res: Response): Promise<Response> {
    const task = await this.taskService.create(req.body);
    return res.status(201).json(task);
  }
}
