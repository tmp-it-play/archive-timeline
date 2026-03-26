import { getDb, schema } from '../../db'
import { eq, and, notInArray, inArray, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const user = event.context.user

  const categories = query.categories
    ? (query.categories as string).split(',')
    : null

  const difficulties = query.difficulties
    ? (query.difficulties as string).split(',')
    : null

  const allowDuplicate = query.allowDuplicate === 'true'
  const page = Number(query.page ?? 1)
  const limit = Number(query.limit ?? 20)
  const offset = (page - 1) * limit

  const db = getDb()

  const conditions = [eq(schema.questions.type, 'mcq')]

  if (categories?.length) {
    conditions.push(inArray(schema.questions.category, categories as any[]))
  }
  if (difficulties?.length) {
    conditions.push(inArray(schema.questions.difficulty, difficulties as any[]))
  }

  // 로그인 + 중복허용 OFF: 이미 정답 맞춘 문제 제외
  if (user && !allowDuplicate) {
    const answered = await db
      .select({ questionId: schema.userMcqLogs.questionId })
      .from(schema.userMcqLogs)
      .where(and(
        eq(schema.userMcqLogs.userId, user.sub),
        eq(schema.userMcqLogs.isCorrect, true),
      ))
    const ids = answered.map(r => r.questionId)
    if (ids.length) {
      conditions.push(notInArray(schema.questions.id, ids))
    }
  }

  const [countResult, questions] = await Promise.all([
    db.select({ count: sql<number>`count(*)` })
      .from(schema.questions)
      .where(and(...conditions)),
    db.select({
      id: schema.questions.id,
      title: schema.questions.title,
      difficulty: schema.questions.difficulty,
      category: schema.questions.category,
    })
      .from(schema.questions)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset),
  ])

  return {
    questions,
    total: Number(countResult[0]?.count ?? 0),
    page,
    limit,
  }
})
