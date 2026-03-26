import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  bigint,
  numeric,
  timestamp,
  pgEnum,
  unique,
} from 'drizzle-orm/pg-core'

export const difficultyEnum = pgEnum('difficulty', ['junior', 'mid', 'senior'])
export const categoryEnum = pgEnum('category', [
  'cloud_devops',
  'data_structure',
  'network',
  'os',
  'db',
  'java',
  'typescript',
])
export const questionTypeEnum = pgEnum('question_type', ['concept', 'mcq'])

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  datagsmId: bigint('datagsm_id', { mode: 'number' }).notNull().unique(),
  studentNumber: integer('student_number').notNull(),
  name: varchar('name', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const questions = pgTable('questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 500 }).notNull(),
  content: text('content').notNull(),
  difficulty: difficultyEnum('difficulty').notNull(),
  category: categoryEnum('category').notNull(),
  type: questionTypeEnum('type').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const mcqOptions = pgTable('mcq_options', {
  id: uuid('id').primaryKey().defaultRandom(),
  questionId: uuid('question_id').notNull().references(() => questions.id, { onDelete: 'cascade' }),
  content: varchar('content', { length: 500 }).notNull(),
  isCorrect: boolean('is_correct').notNull().default(false),
  orderNum: integer('order_num').notNull(),
})

export const userMcqLogs = pgTable('user_mcq_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  questionId: uuid('question_id').notNull().references(() => questions.id, { onDelete: 'cascade' }),
  isCorrect: boolean('is_correct').notNull(),
  answeredAt: timestamp('answered_at').notNull().defaultNow(),
})

export const userConceptLogs = pgTable('user_concept_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  questionId: uuid('question_id').notNull().references(() => questions.id, { onDelete: 'cascade' }),
  viewedAt: timestamp('viewed_at').notNull().defaultNow(),
}, (t) => [unique().on(t.userId, t.questionId)])

export const userRankings = pgTable('user_rankings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  totalScore: numeric('total_score', { precision: 10, scale: 4 }).notNull().default('0'),
  totalCorrect: integer('total_correct').notNull().default(0),
  totalAttempts: integer('total_attempts').notNull().default(0),
  accuracy: numeric('accuracy', { precision: 5, scale: 4 }).notNull().default('0'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const userCategoryRankings = pgTable('user_category_rankings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  category: categoryEnum('category').notNull(),
  totalCorrect: integer('total_correct').notNull().default(0),
  totalAttempts: integer('total_attempts').notNull().default(0),
  accuracy: numeric('accuracy', { precision: 5, scale: 4 }).notNull().default('0'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => [unique().on(t.userId, t.category)])

export const userDifficultyRankings = pgTable('user_difficulty_rankings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  difficulty: difficultyEnum('difficulty').notNull(),
  totalCorrect: integer('total_correct').notNull().default(0),
  totalAttempts: integer('total_attempts').notNull().default(0),
  accuracy: numeric('accuracy', { precision: 5, scale: 4 }).notNull().default('0'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (t) => [unique().on(t.userId, t.difficulty)])

export type User = typeof users.$inferSelect
export type Question = typeof questions.$inferSelect
export type McqOption = typeof mcqOptions.$inferSelect
export type UserMcqLog = typeof userMcqLogs.$inferSelect
export type UserConceptLog = typeof userConceptLogs.$inferSelect
