import { getDb, schema } from '../../db'
import { eq, desc, sql, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const user = event.context.user

  const type = (query.type as string) ?? 'overall'
  const category = query.category as string | undefined
  const difficulty = query.difficulty as string | undefined
  const page = Number(query.page ?? 1)
  const limit = 10
  const offset = (page - 1) * limit

  const db = getDb()

  let rankings: { userId: string; accuracy: string; totalAttempts: number; totalCorrect: number; totalScore?: string }[] = []
  let total = 0

  if (type === 'overall') {
    const [countRes, rows] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(schema.userRankings),
      db.select().from(schema.userRankings).orderBy(desc(schema.userRankings.totalScore)).limit(limit).offset(offset),
    ])
    total = Number(countRes[0]?.count ?? 0)
    rankings = rows.map(r => ({
      userId: r.userId,
      accuracy: r.accuracy,
      totalAttempts: r.totalAttempts,
      totalCorrect: r.totalCorrect,
      totalScore: r.totalScore,
    }))
  }
  else if (type === 'category' && category) {
    const [countRes, rows] = await Promise.all([
      db.select({ count: sql<number>`count(*)` })
        .from(schema.userCategoryRankings)
        .where(eq(schema.userCategoryRankings.category, category as any)),
      db.select().from(schema.userCategoryRankings)
        .where(eq(schema.userCategoryRankings.category, category as any))
        .orderBy(desc(schema.userCategoryRankings.accuracy))
        .limit(limit).offset(offset),
    ])
    total = Number(countRes[0]?.count ?? 0)
    rankings = rows.map(r => ({
      userId: r.userId,
      accuracy: r.accuracy,
      totalAttempts: r.totalAttempts,
      totalCorrect: r.totalCorrect,
    }))
  }
  else if (type === 'difficulty' && difficulty) {
    const [countRes, rows] = await Promise.all([
      db.select({ count: sql<number>`count(*)` })
        .from(schema.userDifficultyRankings)
        .where(eq(schema.userDifficultyRankings.difficulty, difficulty as any)),
      db.select().from(schema.userDifficultyRankings)
        .where(eq(schema.userDifficultyRankings.difficulty, difficulty as any))
        .orderBy(desc(schema.userDifficultyRankings.accuracy))
        .limit(limit).offset(offset),
    ])
    total = Number(countRes[0]?.count ?? 0)
    rankings = rows.map(r => ({
      userId: r.userId,
      accuracy: r.accuracy,
      totalAttempts: r.totalAttempts,
      totalCorrect: r.totalCorrect,
    }))
  }

  // 유저 이름 조회
  const userIds = rankings.map(r => r.userId)
  const usersData = userIds.length
    ? await db.select({ id: schema.users.id, name: schema.users.name, studentNumber: schema.users.studentNumber })
        .from(schema.users)
        .where(sql`${schema.users.id} = ANY(${userIds})`)
    : []

  const userMap = Object.fromEntries(usersData.map(u => [u.id, u]))

  // 내 순위 계산 (로그인 시)
  let myRank: number | null = null
  if (user) {
    if (type === 'overall') {
      const [myRankRes] = await db
        .select({ rank: sql<number>`rank() over (order by total_score desc)` })
        .from(schema.userRankings)
        .where(eq(schema.userRankings.userId, user.sub))
      myRank = Number(myRankRes?.rank ?? null) || null
    }
  }

  return {
    rankings: rankings.map((r, i) => {
      const u = userMap[r.userId]
      return {
        rank: offset + i + 1,
        displayName: u ? `${u.name}(${u.studentNumber})` : '알 수 없음',
        accuracy: Number(r.accuracy),
        totalAttempts: r.totalAttempts,
        totalCorrect: r.totalCorrect,
        score: r.totalScore ? Number(r.totalScore) : undefined,
      }
    }),
    total,
    page,
    myRank,
  }
})
