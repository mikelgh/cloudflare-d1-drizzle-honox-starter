// 添加一个新的字段 completedAt 来存储任务完成的日期。
import { sql } from 'drizzle-orm'
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

// 定义 todos 表的模式
export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }), // 主键，自增
  description: text('title').notNull(), // 任务描述，不能为空
  completed: integer('completed', { mode: 'boolean' }).default(false), // 任务是否完成，默认为 false
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`), // 创建时间，默认为当前时间
  completedAt: integer('completed_at', { mode: 'number', nullable: true }) // 完成时间，整数类型，可为空
})

/* 原代码

import { sql } from 'drizzle-orm'
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  description: text('title').notNull(),
  completed: integer('completed', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`)
})
 */