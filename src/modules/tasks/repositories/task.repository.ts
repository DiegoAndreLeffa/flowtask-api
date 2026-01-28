import { Repository, DataSource } from 'typeorm';
import { Task } from '../entities/task.entity';

export class TaskRepository {
  private ormRepository: Repository<Task>;

  constructor(dataSource: DataSource) {
    this.ormRepository = dataSource.getRepository(Task);
  }

  async create(task: Task): Promise<Task> {
    return this.ormRepository.save(task);
  }

  async findByDate(date: Date): Promise<Task[]> {
    return this.ormRepository.find({
      where: { dueDate: date },
    });
  }
}
