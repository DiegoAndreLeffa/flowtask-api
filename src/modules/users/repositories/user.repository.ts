import { Repository } from 'typeorm';
import { AppDataSource } from '../../../database/data-source';
import { User } from '../entities/user.entity';

export class UserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(User);
  }

  create(data: Partial<User>): User {
    return this.ormRepository.create(data);
  }

  save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.ormRepository.findOne({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return this.ormRepository.findOne({ where: { id } });
  }
}
