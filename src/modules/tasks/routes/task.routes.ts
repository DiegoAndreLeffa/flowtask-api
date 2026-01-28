import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';

const taskRoutes = Router();
const controller = new TaskController();

taskRoutes.post('/', controller.create);

export { taskRoutes };
