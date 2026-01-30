import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private authService = new AuthService();

  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const result = await this.authService.login({ email, password });

    return res.json(result);
  }
}

