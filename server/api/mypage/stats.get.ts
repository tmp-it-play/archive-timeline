import { getDb, schema } from '../../db'
import { eq, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: '로그인이 필요합니다.' })
  }

  const db = getDb()

  // MCQ 통계
  const [mcqStats] = await db
    .select({
      totalAttempts: sql<number>`count(*)`,
      correctCount: sql<number>`sum(case when is_correct then 1 else 0 end)`,
    })
    .from(schema.userMcqLogs)
    .where(eq(schema.userMcqLogs.userId, user.sub))

  const totalAttempts = Number(mcqStats?.totalAttempts ?? 0)
  const correctCount = Number(mcqStats?.correctCount ?? 0)
  const incorrectCount = totalAttempts - correctCount
  const accuracy = totalAttempts > 0 ? correctCount / totalAttempts : 0
  const incorrectRate = totalAttempts > 0 ? incorrectCount / totalAttempts : 0

  // 전체 MCQ 수
  const [mcqTotal] = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.questions)
    .where(eq(schema.questions.type, 'mcq'))

  // 개념 통계
  const [conceptTotal] = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.questions)
    .where(eq(schema.questions.type, 'concept'))

  const [conceptViewed] = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.userConceptLogs)
    .where(eq(schema.userConceptLogs.userId, user.sub))

  const totalMcq = Number(mcqTotal?.count ?? 0)
  const totalConcepts = Number(conceptTotal?.count ?? 0)
  const viewedCount = Number(conceptViewed?.count ?? 0)

  // 카테고리별 통계
  const categoryStats = await db
    .select({
      category: schema.questions.category,
      correct: sql<number>`sum(case when ${schema.userMcqLogs.isCorrect} then 1 else 0 end)`,
      attempts: sql<number>`count(${schema.userMcqLogs.id})`,
    })
    .from(schema.questions)
    .leftJoin(
      schema.userMcqLogs,
      sql`${schema.userMcqLogs.questionId} = ${schema.questions.id} and ${schema.userMcqLogs.userId} = ${user.sub}`,
    )
    .where(eq(schema.questions.type, 'mcq'))
    .groupBy(schema.questions.category)

  const conceptCategoryStats = await db
    .select({
      category: schema.questions.category,
      total: sql<number>`count(*)`,
      viewed: sql<number>`count(${schema.userConceptLogs.id})`,
    })
    .from(schema.questions)
    .leftJoin(
      schema.userConceptLogs,
      sql`${schema.userConceptLogs.questionId} = ${schema.questions.id} and ${schema.userConceptLogs.userId} = ${user.sub}`,
    )
    .where(eq(schema.questions.type, 'concept'))
    .groupBy(schema.questions.category)

  const conceptMap = Object.fromEntries(
    conceptCategoryStats.map(c => [c.category, c]),
  )

  return {
    mcq: {
      totalAttempts,
      correctCount,
      incorrectCount,
      unsolvedCount: Math.max(0, totalMcq - correctCount),
      accuracy: Number(accuracy.toFixed(4)),
      incorrectRate: Number(incorrectRate.toFixed(4)),
    },
    concept: {
      totalConcepts,
      viewedCount,
      unviewedCount: Math.max(0, totalConcepts - viewedCount),
    },
    categoryStats: categoryStats.map(c => ({
      category: c.category,
      mcqCorrect: Number(c.correct ?? 0),
      mcqAttempts: Number(c.attempts ?? 0),
      mcqAccuracy: Number(c.attempts) > 0 ? Number(c.correct) / Number(c.attempts) : 0,
      conceptViewed: Number(conceptMap[c.category]?.viewed ?? 0),
      conceptTotal: Number(conceptMap[c.category]?.total ?? 0),
    })),
  }
})
