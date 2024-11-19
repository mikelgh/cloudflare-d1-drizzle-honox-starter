import { showRoutes } from 'hono/dev'
import { createApp } from 'honox/server'

// 创建应用实例
const app = createApp()

// 显示路由信息
showRoutes(app)

export default app
