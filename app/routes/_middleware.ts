import { drizzle } from 'drizzle-orm/d1'
import { createRoute } from 'honox/factory'

// 定义中间件，将数据库实例注入到上下文中
export default createRoute(async (c, next) => {
  c.set('db', drizzle(c.env.DB))
  await next()
})
