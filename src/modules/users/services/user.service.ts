import bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { AppError } from '../../../shared/errors/AppError';
import { CreateUserDTO } from '../dtos/create-user.dto';

export class UserService {
  private userRepository = new UserRepository();

  async create({ name, email, password }: CreateUserDTO): Promise<User> {
    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      throw new AppError('User already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }
}
