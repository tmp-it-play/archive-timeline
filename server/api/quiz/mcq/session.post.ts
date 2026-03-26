import { getDb, schema } from '../../../db'
import { eq, and, notInArray, inArray, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const user = event.context.user

  const {
    categories,
    difficulties,
    count = 10,
    allowDuplicate = true,
  } = body as {
    categories?: string[]
    difficulties?: string[]
    count?: number
    allowDuplicate?: boolean
  }

  const clampedCount = Math.min(Math.max(5, count), 50)
  const db = getDb()

  const conditions = [eq(schema.questions.type, 'mcq')]

  if (categories?.length) {
    conditions.push(inArray(schema.questions.category, categories as any[]))
  }
  if (difficulties?.length) {
    conditions.push(inArray(schema.questions.difficulty, difficulties as any[]))
  }

  // 로그인 + 중복허용 OFF
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

  // 랜덤 정렬로 n개 선택
  const questions = await db
    .select({
      id: schema.questions.id,
      title: schema.questions.title,
      difficulty: schema.questions.difficulty,
      category: schema.questions.category,
    })
    .from(schema.questions)
    .where(and(...conditions))
    .orderBy(sql`RANDOM()`)
    .limit(clampedCount)

  if (!questions.length) {
    throw createError({ statusCode: 404, statusMessage: '조건에 맞는 문제가 없습니다.' })
  }

  // 각 문제의 선택지 조회 (정답 여부는 제외하고 셔플)
  const questionIds = questions.map(q => q.id)
  const options = await db
    .select({
      id: schema.mcqOptions.id,
      questionId: schema.mcqOptions.questionId,
      content: schema.mcqOptions.content,
      orderNum: schema.mcqOptions.orderNum,
    })
    .from(schema.mcqOptions)
    .where(inArray(schema.mcqOptions.questionId, questionIds))
    .orderBy(sql`RANDOM()`)

  const optionsByQuestion = options.reduce((acc, opt) => {
    if (!acc[opt.questionId]) acc[opt.questionId] = []
    acc[opt.questionId].push({ id: opt.id, text: opt.content })
    return acc
  }, {} as Record<string, { id: string; text: string }[]>)

  const sessionId = crypto.randomUUID()

  return {
    sessionId,
    questions: questions.map(q => ({
      id: q.id,
      title: q.title,
      difficulty: q.difficulty,
      category: q.category,
      options: optionsByQuestion[q.id] ?? [],
    })),
  }
})
