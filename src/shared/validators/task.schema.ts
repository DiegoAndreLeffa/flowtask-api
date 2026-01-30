import { z } from 'zod';
import { TaskPriority } from '../../modules/tasks/entities/task.entity';


export const createTaskSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  category: z.string().optional(),
  priority: z.enum(TaskPriority).optional(),
  dueDate: z.string("Data de vencimento inválida"),
});

export const updateTaskSchema = createTaskSchema.partial();
