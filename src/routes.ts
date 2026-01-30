import { Router } from 'express';

import { authRoutes } from './modules/auth/routes/auth.routes';
import { taskRoutes } from './modules/tasks/routes/task.routes';
import { userRoutes } from './modules/users/routes/user.routes';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/users', userRoutes);
routes.use('/tasks', taskRoutes);


export { routes };
