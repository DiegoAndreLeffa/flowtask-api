import { Request, Response } from 'express';

import { TaskService } from '../services/task.service';

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  /**
   * POST /tasks
   * Criar uma nova tarefa
   */
  async create(req: Request, res: Response): Promise<Response> {
    const userId = req.user.id;
    const {
      title,
      description,
      category,
      priority,
      dueDate,
      dueTime,
    } = req.body;

    const task = await this.taskService.create({
      userId,
      title,
      description,
      category,
      priority,
      dueDate,
    });

    return res.status(201).json(task);
  }

  /**
   * GET /tasks
   * Listar tarefas do usuário autenticado
   */
  async list(req: Request, res: Response): Promise<Response> {
    const userId = req.user.id;

    const tasks = await this.taskService.listByUser(userId);

    return res.json(tasks);
  }

  /**
   * GET /tasks/:id
   * Buscar tarefa por ID
   */
  async findById(req: Request, res: Response): Promise<Response> {
    const userId = req.user.id;
    const { id } = req.params as { id: string };

    const task = await this.taskService.findById({
      taskId: id,
      userId,
    });

    return res.json(task);
  }

  /**
   * PUT /tasks/:id
   * Atualizar tarefa
   */
  async update(req: Request, res: Response): Promise<Response> {
    const userId = req.user.id;
    const { id } = req.params as { id: string };

    const task = await this.taskService.update({
      taskId: id,
      userId,
      data: req.body,
    });

    return res.json(task);
  }

  /**
   * DELETE /tasks/:id
   * Remover tarefa
   */
  async delete(req: Request, res: Response): Promise<Response> {
    const userId = req.user.id;
    const { id } = req.params as { id: string };

    await this.taskService.delete({
      taskId: id,
      userId,
    });

    return res.status(204).send();
  }
}
