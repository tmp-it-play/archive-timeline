import { getDb, schema } from '../../../db'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) return { recorded: false }

  const { questionId } = await readBody(event) as { questionId: string }
  const db = getDb()

  await db
    .insert(schema.userConceptLogs)
    .values({ userId: user.sub, questionId })
    .onConflictDoNothing()

  return { recorded: true }
})
