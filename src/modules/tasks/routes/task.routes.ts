import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { ensureAuthenticated } from '../../../shared/middlewares/ensureAuthenticated';

const taskRoutes = Router();
const controller = new TaskController();

taskRoutes.use(ensureAuthenticated);
taskRoutes.post('/', controller.create);

export { taskRoutes };
