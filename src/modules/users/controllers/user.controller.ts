import { Request, Response } from 'express';
import { UserService } from "../services/user.service";

export class UserController {
  private userService = new UserService();

  async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const user = await this.userService.create({
      name,
      email,
      password,
    });

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }
}