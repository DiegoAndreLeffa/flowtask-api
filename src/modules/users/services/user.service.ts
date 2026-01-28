import bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { AppError } from '../../../shared/errors/AppError';
import { CreateUserDTO } from '../dtos/create-user.dto';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async register(data: CreateUserDTO): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError('Email already in use', 409);
    }

    const user = new User();
    user.name = data.name;
    user.email = data.email;
    user.password = await bcrypt.hash(data.password, 8);

    return this.userRepository.create(user);
  }
}
