import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null

export function getDb() {
  if (_db) return _db
  const config = useRuntimeConfig()
  const sql = neon(config.databaseUrl)
  _db = drizzle(sql, { schema })
  return _db
}

export { schema }
