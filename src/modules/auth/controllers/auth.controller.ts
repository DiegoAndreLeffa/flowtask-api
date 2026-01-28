import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UserRepository } from '../../users/repositories/user.repository';
import { UserService } from '../../users/services/user.service';

export class AuthController {
  async register(req: Request, res: Response): Promise<Response> {
    const service = new UserService(new UserRepository());
    const user = await service.register(req.body);

    return res.status(201).json(user);
  }

  async login(req: Request, res: Response): Promise<Response> {
    const service = new AuthService(new UserRepository());
    const result = await service.login(req.body.email, req.body.password);

    return res.json(result);
  }
}
