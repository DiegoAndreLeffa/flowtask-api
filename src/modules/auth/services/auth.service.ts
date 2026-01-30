import { AppError } from '../../../shared/errors/AppError';
import { createTaskSchema, updateTaskSchema } from '../../../shared/validators/task.schema';
import { Task, TaskStatus } from '../../tasks/entities/task.entity';
import { TaskRepository } from '../../tasks/repositories/task.repository';
import { TaskRulesEngine } from '../../tasks/rules/task-rules.engine';

interface FindTaskParams {
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

  /**
   * Criar tarefa
   * @param userId ID do usuário autenticado
   * @param data Dados do corpo da requisição (input)
   */
  async create(userId: string, data: typeof createTaskSchema): Promise<Task> {
    const validation = createTaskSchema.safeParse(data);

    if (!validation.success) {
      const errorMessages = validation.error.issues.map(e => e.message).join('; ');
      throw new AppError(errorMessages, 400);
    }

    const validatedData = validation.data;

    const task = this.taskRepository.create({
      ...validatedData,
      userId, 
      status: TaskStatus.PENDING,
      priority: validatedData.priority!, 
    });

    /**
     * Executa regras:
     * - Conflito de horário
     * - Cálculo de prioridade dinâmica
     */
    await this.rulesEngine.execute(task, userId);

    return this.taskRepository.save(task);
  }

  /**
   * Listar tarefas do usuário
   */
  async listByUser(userId: string): Promise<Task[]> {
    return this.taskRepository.findByUser(userId);
  }

  /**
   * Buscar tarefa por ID garantindo ownership
   */
  async findById({ taskId, userId }: FindTaskParams): Promise<Task> {
    const task = await this.taskRepository.findById(taskId);

    if (!task || task.userId !== userId) {
      throw new AppError('Task not found', 404);
    }

    return task;
  }

  /**
   * Atualizar tarefa
   */
  async update(taskId: string, userId: string, data: typeof updateTaskSchema): Promise<Task> {
    const validation = updateTaskSchema.safeParse(data);

    if (!validation.success) {
      const errorMessages = validation.error.issues.map(e => e.message).join('; ');
      throw new AppError(errorMessages, 400);
    }

    const validatedData = validation.data;

    const task = await this.findById({ taskId, userId });

    Object.assign(task, validatedData);

    /**
     * Reexecuta regras caso datas/prioridade mudem
     */
    await this.rulesEngine.execute(task, userId);

    return this.taskRepository.save(task);
  }

  /**
   * Remover tarefa
   */
  async delete({ taskId, userId }: FindTaskParams): Promise<void> {
    const task = await this.findById({ taskId, userId });
    await this.taskRepository.remove(task);
  }
}