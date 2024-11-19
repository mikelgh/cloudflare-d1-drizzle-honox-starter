import { eq } from 'drizzle-orm'
import { createRoute } from 'honox/factory'
import { todos } from '@/schema'

// 定义清除已完成任务的路由
export const POST = createRoute(async (c) => {
  await c.var.db.delete(todos).where(eq(todos.completed, true))
  return c.redirect('/')
})
