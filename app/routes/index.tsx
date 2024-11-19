import { createInsertSchema } from 'drizzle-zod'
import { createRoute } from 'honox/factory'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { todos } from '@/schema'

// 定义首页路由
export default createRoute(async (c) => {
  // 从数据库中获取所有任务
  const results = await c.var.db.select().from(todos).all()

  // 渲染页面
  return c.render(
    <>
      <div class="bg-white md:shadow p-4">
        <div class="flex items-center mb-4">
          <h1 class="flex-1 font-bold text-xl">
            当前有 {results.length} 个任务
          </h1>
          <form method="POST" action={`/todos/clear_completed`}>
            <button class="text-blue-600 hover:underline" type="submit">
              清空已完成任务
            </button>
          </form>
        </div>

        {results.length == 0 ? <p class="text-gray-600">还没有任务，请在下方创建一个。</p> : null}

        <ul>
          {results.map((todo) => (
            <li>
              <form method="POST" action={`/todos/${todo.id}/toggle`}>
                <input
                  type="checkbox"
                  name="completed"
                  checked={todo.completed ?? false}
                  // @ts-ignore
                  onChange="this.form.submit()"
                />{' '}
                {todo.description}
                <span class="text-gray-500 text-sm">
                  {' '}
                  (创建时间: {new Date(todo.createdAt).toLocaleString()})
                </span>
                {todo.completed && todo.completedAt ? (
                  <span class="text-gray-500 text-sm">
                    {' '}
                    (完成时间: {new Date(todo.completedAt * 1000).toLocaleString()})
                  </span>
                ) : null}
              </form>
            </li>
          ))}
        </ul>
      </div>

      <div class="rounded bg-white shadow">
        <form class="flex-1 flex space-y-4" method="post">
          <input
            type="text"
            name="description"
            class="p-4 w-full"
            placeholder="📝 写一个新任务，按回车键提交"
            autofocus
            autocomplete="off"
          />
        </form>
      </div>
    </>
  )
})

// 定义插入任务的模式
const insertSchema = createInsertSchema(todos, {
  id: z.undefined()
})

// 定义 POST 路由，用于添加新任务
export const POST = createRoute(zValidator('form', insertSchema), async (c) => {
  const data = c.req.valid('form')
  await c.var.db.insert(todos).values(data)
  return c.redirect('/')
})
