import { Router } from 'express';

import { TaskController } from '../controllers/task.controller';
import { ensureAuthenticated } from '../../../shared/middlewares/ensureAuthenticated';

const taskRoutes = Router();
const taskController = new TaskController();

/**
 * Todas as rotas de tasks são protegidas
 */
taskRoutes.use(ensureAuthenticated);

/**
 * Criar tarefa
 * POST /tasks
 */
taskRoutes.post('/', taskController.create);

/**
 * Listar tarefas do usuário autenticado
 * GET /tasks
 */
taskRoutes.get('/', taskController.list);

/**
 * Buscar tarefa por ID
 * GET /tasks/:id
 */
taskRoutes.get('/:id', taskController.findById);

/**
 * Atualizar tarefa
 * PUT /tasks/:id
 */
taskRoutes.put('/:id', taskController.update);

/**
 * Remover tarefa
 * DELETE /tasks/:id
 */
taskRoutes.delete('/:id', taskController.delete);

export { taskRoutes };
