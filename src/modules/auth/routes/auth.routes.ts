import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const authRoutes = Router();
const controller = new AuthController();

authRoutes.post('/login', controller.login);

export { authRoutes };

