import { eq, sql } from 'drizzle-orm'
import { createRoute } from 'honox/factory'
import z from 'zod'
import { zValidator } from '@hono/zod-validator'
import { todos } from '@/schema'

// 定义切换任务完成状态的路由
export const POST = createRoute(
  zValidator(
    'param',
    z.object({
      id: z.string()
    })
  ),
  async (c) => {
    const { id: idParam } = c.req.valid('param')
    const id = Number(idParam)

    // 从数据库中获取任务
    const results = await c.var.db.select().from(todos).where(eq(todos.id, id))

    const todo = results[0]

    if (!todo) {
      return c.text('Todo not found', 404)
    }

    // 设置完成时间
    const completedAt = todo.completed ? null : sql`(strftime('%s', 'now'))`

    // 更新任务状态
    await c.var.db.update(todos).set({ completed: !todo.completed, completedAt }).where(eq(todos.id, id))
    return c.redirect('/')
  }
)
