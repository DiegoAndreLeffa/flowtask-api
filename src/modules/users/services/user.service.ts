import bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { AppError } from '../../../shared/errors/AppError';
import { CreateUserInput, createUserSchema } from '../../../shared/validators/user.schema';



export class UserService {
  private userRepository = new UserRepository();

  async create(data: CreateUserInput): Promise<User> {
    
    const validationResult = createUserSchema.safeParse(data);

    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues
        .map((err) => err.message)
        .join('; ');
      
      throw new AppError(errorMessages, 400);
    }

    const { name, email, password } = validationResult.data;

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