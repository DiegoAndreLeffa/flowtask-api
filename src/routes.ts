import { Router } from 'express';

import { authRoutes } from './modules/auth/routes/auth.routes';
import { taskRoutes } from './modules/tasks/routes/task.routes';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/tasks', taskRoutes);

export { routes };
