import { Repository } from 'typeorm';
import { Task, TaskStatus } from '../entities/task.entity';
import { AppDataSource } from '../../../database/data-source';

export class TaskRepository {
  private ormRepository: Repository<Task>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Task);
  }

  create(data: Partial<Task>): Task {
    return this.ormRepository.create(data);
  }

  async save(task: Task): Promise<Task> {
    return this.ormRepository.save(task);
  }

  async findByUser(userId: string): Promise<Task[]> {
    return this.ormRepository.find({
      where: { userId },
      order: { dueDate: 'ASC'},
    });
  }

  async findById(id: string): Promise<Task | null> {
    return this.ormRepository.findOne({ where: { id } });
  }

  async remove(task: Task): Promise<void> {
    await this.ormRepository.remove(task);
  }

  async findByDateAndTime({
    userId,
    dueDate,
    ignoreTaskId,
  }: {
    userId: string;
    dueDate: string;
    dueTime: string;
    ignoreTaskId?: string;
  }): Promise<Task | null> {
    const query = this.ormRepository
      .createQueryBuilder('task')
      .where('task.userId = :userId', { userId })
      .andWhere('task.dueDate = :dueDate', { dueDate })

    if (ignoreTaskId) {
      query.andWhere('task.id != :ignoreTaskId', { ignoreTaskId });
    }

    return query.getOne();
  }

  async countOverdueTasks(userId: string): Promise<number> {
    const now = new Date().toISOString().split('T')[0];

    return this.ormRepository.count({
      where: {
        userId,
        dueDate: now,
        status: TaskStatus.PENDING,
      },
    });
  }
}
