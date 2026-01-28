import { Router } from 'express';
import { taskRoutes } from './modules/tasks/routes/task.routes';

const routes = Router();

routes.use('/tasks', taskRoutes);

export { routes };
