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

  /**
   * Criar tarefa com execução de regras de negócio
   */
  async create(data: CreateTaskDTO): Promise<Task> {
    const task = this.taskRepository.create({
      ...data,
      status: TaskStatus.PENDING,
    });

    /**
     * Executa regras:
     * - Conflito de horário
     * - Cálculo de prioridade dinâmica
     */
    await this.rulesEngine.execute(task, data.userId);

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
  async findById({ taskId, userId }: FindTaskDTO): Promise<Task> {
    const task = await this.taskRepository.findById(taskId);

    if (!task || task.userId !== userId) {
      throw new AppError('Task not found', 404);
    }

    return task;
  }

  /**
   * Atualizar tarefa
   */
  async update({ taskId, userId, data }: UpdateTaskDTO): Promise<Task> {
    const task = await this.findById({ taskId, userId });

    Object.assign(task, data);

    /**
     * Reexecuta regras caso datas/prioridade mudem
     */
    await this.rulesEngine.execute(task, userId);

    return this.taskRepository.save(task);
  }

  /**
   * Remover tarefa
   */
  async delete({ taskId, userId }: FindTaskDTO): Promise<void> {
    const task = await this.findById({ taskId, userId });

    await this.taskRepository.remove(task);
  }
}
