import { getDb, schema } from '../../../db'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID가 필요합니다.' })

  const db = getDb()
  const [question] = await db
    .select({ id: schema.questions.id, title: schema.questions.title, content: schema.questions.content, category: schema.questions.category, difficulty: schema.questions.difficulty })
    .from(schema.questions)
    .where(and(eq(schema.questions.id, id), eq(schema.questions.type, 'concept')))

  if (!question) throw createError({ statusCode: 404, statusMessage: '개념을 찾을 수 없습니다.' })
  return question
})
