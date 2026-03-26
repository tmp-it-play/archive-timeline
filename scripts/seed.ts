#!/usr/bin/env tsx
import { existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import { join, relative, extname, basename } from 'node:path'
import matter from 'gray-matter'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from '../server/db/schema'

async function loadEnvFile() {
  const envPath = join(process.cwd(), '.env')
  if (!existsSync(envPath)) return

  const raw = await readFile(envPath, 'utf-8')
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex < 0) continue

    const key = trimmed.slice(0, separatorIndex).trim()
    if (!key || process.env[key] !== undefined) continue

    let value = trimmed.slice(separatorIndex + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"'))
      || (value.startsWith('\'') && value.endsWith('\''))
    ) {
      value = value.slice(1, -1)
    }

    process.env[key] = value
  }
}

await loadEnvFile()

const DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  console.error('DATABASE_URL 환경변수가 필요합니다. 프로젝트 루트의 .env 또는 셸 환경변수에 설정하세요.')
  process.exit(1)
}

const sql = neon(DATABASE_URL)
const db = drizzle(sql, { schema })

const CONTENT_DIR = join(process.cwd(), 'content')

const CATEGORY_MAP: Record<string, string> = {
  'cloud-devops': 'cloud_devops',
  'cloud_devops': 'cloud_devops',
  'data-structure': 'data_structure',
  'data_structure': 'data_structure',
  'network': 'network',
  'os': 'os',
  'db': 'db',
  'java': 'java',
  'typescript': 'typescript',
}

async function findMdFiles(dir: string): Promise<string[]> {
  const files: string[] = []
  try {
    const entries = await readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        files.push(...await findMdFiles(fullPath))
      }
      else if (entry.isFile() && extname(entry.name) === '.md') {
        files.push(fullPath)
      }
    }
  }
  catch {
    // 디렉토리 없으면 스킵
  }
  return files
}

async function seed() {
  console.log('🌱 BackGSM Seed 시작...')

  const mcqFiles = await findMdFiles(join(CONTENT_DIR, 'mcq'))
  const conceptFiles = await findMdFiles(join(CONTENT_DIR, 'concept'))
  const allFiles = [...mcqFiles, ...conceptFiles]

  console.log(`📄 파일 ${allFiles.length}개 발견`)

  let inserted = 0
  let updated = 0
  let errors = 0

  for (const filePath of allFiles) {
    try {
      const raw = await readFile(filePath, 'utf-8')
      const { data: fm, content } = matter(raw)

      if (!fm.id || !fm.title || !fm.difficulty || !fm.category || !fm.type) {
        console.warn(`⚠️  필수 frontmatter 누락: ${filePath}`)
        continue
      }

      const category = CATEGORY_MAP[fm.category]
      if (!category) {
        console.warn(`⚠️  알 수 없는 카테고리: ${fm.category} (${filePath})`)
        continue
      }

      const slug = fm.id as string
      const questionData = {
        slug,
        title: fm.title as string,
        content: content.trim(),
        difficulty: fm.difficulty as 'junior' | 'mid' | 'senior',
        category: category as any,
        type: fm.type as 'concept' | 'mcq',
      }

      const [question] = await db
        .insert(schema.questions)
        .values(questionData)
        .onConflictDoUpdate({
          target: schema.questions.slug,
          set: {
            title: questionData.title,
            content: questionData.content,
            difficulty: questionData.difficulty,
            category: questionData.category,
            updatedAt: new Date(),
          },
        })
        .returning()

      if (fm.type === 'mcq' && Array.isArray(fm.options)) {
        // 기존 옵션 삭제 후 재삽입
        const { eq } = await import('drizzle-orm')
        await db.delete(schema.mcqOptions).where(eq(schema.mcqOptions.questionId, question.id))

        const options = fm.options as Array<{ text: string; correct: boolean }>
        for (let i = 0; i < options.length; i++) {
          await db.insert(schema.mcqOptions).values({
            questionId: question.id,
            content: options[i].text,
            isCorrect: options[i].correct === true,
            orderNum: i + 1,
          })
        }
      }

      inserted++
    }
    catch (err) {
      console.error(`❌ 오류: ${filePath}`, err)
      errors++
    }
  }

  console.log(`✅ 완료: ${inserted}개 처리, 오류 ${errors}개`)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
