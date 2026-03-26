import { getDb, schema } from '../../../db'
import { eq, and, sql } from 'drizzle-orm'

function calcScore(correct: number, attempts: number): number {
  const accuracy = attempts > 0 ? correct / attempts : 0
  const attemptScore = Math.min(attempts, 300) / 300
  return Number((accuracy * 70 + attemptScore * 30).toFixed(4))
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const user = event.context.user

  const { questionId, selectedOptionId } = body as {
    questionId: string
    selectedOptionId: string
  }

  const db = getDb()

  // 정답 확인
  const [correctOption] = await db
    .select()
    .from(schema.mcqOptions)
    .where(and(
      eq(schema.mcqOptions.questionId, questionId),
      eq(schema.mcqOptions.isCorrect, true),
    ))

  if (!correctOption) {
    throw createError({ statusCode: 404, statusMessage: '문제를 찾을 수 없습니다.' })
  }

  const isCorrect = correctOption.id === selectedOptionId

  // 해설 조회
  const [question] = await db
    .select({ content: schema.questions.content, difficulty: schema.questions.difficulty, category: schema.questions.category })
    .from(schema.questions)
    .where(eq(schema.questions.id, questionId))

  // 로그인 시 기록 저장 + 랭킹 업데이트
  if (user) {
    await db.insert(schema.userMcqLogs).values({
      userId: user.sub,
      questionId,
      isCorrect,
    })

    // 전체 랭킹 업데이트
    const [totals] = await db
      .select({
        correct: sql<number>`sum(case when is_correct then 1 else 0 end)`,
        attempts: sql<number>`count(*)`,
      })
      .from(schema.userMcqLogs)
      .where(eq(schema.userMcqLogs.userId, user.sub))

    const totalCorrect = Number(totals.correct ?? 0)
    const totalAttempts = Number(totals.attempts ?? 0)
    const accuracy = totalAttempts > 0 ? totalCorrect / totalAttempts : 0
    const totalScore = calcScore(totalCorrect, totalAttempts)

    await db
      .insert(schema.userRankings)
      .values({ userId: user.sub, totalCorrect, totalAttempts, accuracy: String(accuracy), totalScore: String(totalScore) })
      .onConflictDoUpdate({
        target: schema.userRankings.userId,
        set: { totalCorrect, totalAttempts, accuracy: String(accuracy), totalScore: String(totalScore), updatedAt: new Date() },
      })

    // 카테고리별 랭킹 업데이트
    const [catTotals] = await db
      .select({
        correct: sql<number>`sum(case when ${schema.userMcqLogs.isCorrect} then 1 else 0 end)`,
        attempts: sql<number>`count(*)`,
      })
      .from(schema.userMcqLogs)
      .leftJoin(schema.questions, eq(schema.userMcqLogs.questionId, schema.questions.id))
      .where(and(
        eq(schema.userMcqLogs.userId, user.sub),
        eq(schema.questions.category, question.category),
      ))

    const catCorrect = Number(catTotals.correct ?? 0)
    const catAttempts = Number(catTotals.attempts ?? 0)
    const catAccuracy = catAttempts > 0 ? catCorrect / catAttempts : 0

    await db
      .insert(schema.userCategoryRankings)
      .values({ userId: user.sub, category: question.category, totalCorrect: catCorrect, totalAttempts: catAttempts, accuracy: String(catAccuracy) })
      .onConflictDoUpdate({
        target: [schema.userCategoryRankings.userId, schema.userCategoryRankings.category],
        set: { totalCorrect: catCorrect, totalAttempts: catAttempts, accuracy: String(catAccuracy), updatedAt: new Date() },
      })

    // 난이도별 랭킹 업데이트
    const [diffTotals] = await db
      .select({
        correct: sql<number>`sum(case when ${schema.userMcqLogs.isCorrect} then 1 else 0 end)`,
        attempts: sql<number>`count(*)`,
      })
      .from(schema.userMcqLogs)
      .leftJoin(schema.questions, eq(schema.userMcqLogs.questionId, schema.questions.id))
      .where(and(
        eq(schema.userMcqLogs.userId, user.sub),
        eq(schema.questions.difficulty, question.difficulty),
      ))

    const diffCorrect = Number(diffTotals.correct ?? 0)
    const diffAttempts = Number(diffTotals.attempts ?? 0)
    const diffAccuracy = diffAttempts > 0 ? diffCorrect / diffAttempts : 0

    await db
      .insert(schema.userDifficultyRankings)
      .values({ userId: user.sub, difficulty: question.difficulty, totalCorrect: diffCorrect, totalAttempts: diffAttempts, accuracy: String(diffAccuracy) })
      .onConflictDoUpdate({
        target: [schema.userDifficultyRankings.userId, schema.userDifficultyRankings.difficulty],
        set: { totalCorrect: diffCorrect, totalAttempts: diffAttempts, accuracy: String(diffAccuracy), updatedAt: new Date() },
      })
  }

  return {
    isCorrect,
    correctOptionId: correctOption.id,
    explanation: question.content,
  }
})
