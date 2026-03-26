import { getDb, schema } from '../../db'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: '로그인이 필요합니다.' })
  }

  const query = getQuery(event)
  const type = (query.type as string) ?? 'all'

  const db = getDb()

  if (type === 'mcq' || type === 'all') {
    await db.delete(schema.userMcqLogs).where(eq(schema.userMcqLogs.userId, user.sub))
    // 랭킹 초기화
    await db.delete(schema.userRankings).where(eq(schema.userRankings.userId, user.sub))
    await db.delete(schema.userCategoryRankings).where(eq(schema.userCategoryRankings.userId, user.sub))
    await db.delete(schema.userDifficultyRankings).where(eq(schema.userDifficultyRankings.userId, user.sub))
  }

  if (type === 'concept' || type === 'all') {
    await db.delete(schema.userConceptLogs).where(eq(schema.userConceptLogs.userId, user.sub))
  }

  return { success: true, type }
})
