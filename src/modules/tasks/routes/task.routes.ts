import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { ensureAuthenticated } from '../../../shared/middlewares/ensureAuthenticated';

const taskRoutes = Router();
const taskController = new TaskController();

taskRoutes.use(ensureAuthenticated);

taskRoutes.post('/', (req, res) => taskController.create(req, res));
taskRoutes.get('/', (req, res) => taskController.list(req, res));
taskRoutes.get('/:id', (req, res) => taskController.findById(req, res));
taskRoutes.put('/:id', (req, res) => taskController.update(req, res));
taskRoutes.delete('/:id', (req, res) => taskController.delete(req, res));

export { taskRoutes };