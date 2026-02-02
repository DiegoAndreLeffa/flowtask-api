import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import { AppError } from '../../../shared/errors/AppError';
import { LoginInput, loginSchema } from '../../../shared/validators/auth.schema';
import { UserRepository } from '../../users/repositories/user.repository';


interface ILoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(data: LoginInput): Promise<ILoginResponse> {
    // 1. Validação dos dados de entrada (Fail Fast)
    const validation = loginSchema.safeParse(data);
    
    if (!validation.success) {
      const errorMessages = validation.error.issues.map(e => e.message).join('; ');
      throw new AppError(errorMessages, 400);
    }

    const { email, password } = validation.data;

    // 2. Verificar se o usuário existe
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      // Por segurança, mensagem genérica para não revelar que o email existe
      throw new AppError('E-mail ou senha incorretos', 401);
    }

    // 3. Comparar a senha enviada com o hash do banco
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError('E-mail ou senha incorretos', 401);
    }

    // 4. Gerar o Token JWT
    if (!process.env.JWT_SECRET) {
      throw new AppError('Erro interno de configuração (JWT_SECRET)', 500);
    }

    const token = sign({}, process.env.JWT_SECRET, {
      subject: user.id,
      expiresIn: '1d', // Token expira em 1 dia
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }
}