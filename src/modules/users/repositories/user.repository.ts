import { Repository } from 'typeorm';
import { AppDataSource } from '../../../database/data-source';
import { User } from '../entities/user.entity';

export class UserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(User);
  }

  create(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.ormRepository.findOne({ where: { email } });
  }
}
