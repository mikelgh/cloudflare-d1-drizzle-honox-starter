import { eq } from 'drizzle-orm'
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

    // 获取任务
    const results = await c.var.db.select().from(todos).where(eq(todos.id, id))
    const todo = results[0]

    if (!todo) {
      return c.text('任务未找到', 404)
    }

    // 设置完成时间为当前时间戳（秒）
    const completedAt = todo.completed ? null : Math.floor(Date.now() / 1000)

    // 更新任务状态
    await c.var.db.update(todos).set({ completed: !todo.completed, completedAt }).where(eq(todos.id, id))
    return c.redirect('/')
  }
)
