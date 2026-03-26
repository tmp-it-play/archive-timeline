<template>
  <div>
    <!-- 필터 설정 화면 -->
    <div v-if="phase === 'filter'" class="max-w-2xl mx-auto space-y-8">
      <div>
        <p class="text-xs font-mono text-gold uppercase tracking-[0.2em] mb-2">사지선다 모드</p>
        <h1 class="text-3xl font-semibold tracking-tight">출제 설정</h1>
        <p class="text-neutral-500 dark:text-neutral-400 mt-2 text-sm">원하는 난이도와 카테고리, 문제 수를 선택하세요.</p>
      </div>

      <QuizFilter
        v-model:difficulties="difficulties"
        v-model:categories="categories"
        v-model:count="count"
        v-model:allow-duplicate="allowDuplicate"
        :show-count="true"
      />

      <button
        class="w-full py-3 bg-ink-light dark:bg-ink-dark text-surface-light dark:text-surface-dark rounded-lg font-medium hover:opacity-80 transition-opacity disabled:opacity-40"
        :disabled="loading"
        @click="startQuiz"
      >
        {{ loading ? '불러오는 중...' : '시작하기' }}
      </button>

      <p v-if="error" class="text-sm text-red-500 text-center">{{ error }}</p>
    </div>

    <!-- 퀴즈 플레이 화면 -->
    <div v-else-if="phase === 'quiz'" class="max-w-2xl mx-auto space-y-6">
      <!-- 진행 상태 -->
      <div class="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
        <span>{{ currentIndex + 1 }} / {{ questions.length }}</span>
        <div class="flex gap-1">
          <span
            v-for="(q, i) in questions"
            :key="q.id"
            class="w-2 h-2 rounded-full"
            :class="{
              'bg-ink-light dark:bg-ink-dark': i === currentIndex,
              'bg-emerald-400': answers[q.id] === true,
              'bg-red-400': answers[q.id] === false,
              'bg-neutral-200 dark:bg-neutral-700': answers[q.id] === undefined && i !== currentIndex,
            }"
          />
        </div>
      </div>

      <!-- 문제 카드 -->
      <div class="border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 space-y-6">
        <div class="flex gap-2">
          <UiCategoryBadge :category="currentQ.category" />
          <UiDifficultyBadge :difficulty="currentQ.difficulty" />
        </div>

        <h2 class="text-xl font-semibold leading-snug">{{ currentQ.title }}</h2>

        <!-- 선택지 -->
        <div class="space-y-2.5">
          <button
            v-for="opt in currentQ.options"
            :key="opt.id"
            class="w-full text-left px-5 py-3.5 rounded-lg border text-sm transition-all"
            :class="optionClass(opt.id)"
            :disabled="answered || submittingAnswer"
            @click="selectOption(opt.id)"
          >
            {{ opt.text }}
          </button>
        </div>

        <p v-if="submittingAnswer" class="text-sm text-neutral-500 dark:text-neutral-400">
          정답을 확인하는 중...
        </p>

        <!-- 해설 (정답 후) -->
        <Transition name="fade-down">
          <div v-if="answered" class="border-t border-neutral-100 dark:border-neutral-800 pt-5">
            <p class="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-3">해설</p>
            <div class="prose prose-sm dark:prose-invert max-w-none" v-html="renderedExplanation" />
          </div>
        </Transition>
      </div>

      <!-- 다음 문제 버튼 -->
      <div v-if="answered" class="flex justify-end">
        <button
          class="px-6 py-2.5 bg-ink-light dark:bg-ink-dark text-surface-light dark:text-surface-dark rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
          @click="nextQuestion"
        >
          {{ currentIndex + 1 < questions.length ? '다음 문제 →' : '결과 보기 →' }}
        </button>
      </div>
    </div>

    <!-- 결과 화면 -->
    <div v-else-if="phase === 'result'" class="max-w-2xl mx-auto space-y-8">
      <div>
        <p class="text-xs font-mono text-gold uppercase tracking-[0.2em] mb-2">퀴즈 완료</p>
        <h1 class="text-3xl font-semibold tracking-tight">결과</h1>
      </div>

      <!-- 점수 요약 -->
      <div class="border border-neutral-200 dark:border-neutral-800 rounded-xl p-8">
        <div class="flex items-end gap-4 mb-8">
          <span class="text-6xl font-mono font-bold text-gold">{{ correctCount }}</span>
          <span class="text-2xl text-neutral-400 dark:text-neutral-500 mb-1">/ {{ questions.length }}</span>
          <span class="text-xl text-neutral-500 dark:text-neutral-400 mb-1 ml-auto">{{ Math.round((correctCount / questions.length) * 100) }}%</span>
        </div>

        <!-- 카테고리별 분포 -->
        <div class="space-y-2.5">
          <p class="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-3">카테고리별 정답률</p>
          <div
            v-for="stat in categoryStats"
            :key="stat.category"
            class="flex items-center gap-3"
          >
            <UiCategoryBadge :category="stat.category" />
            <div class="flex-1 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                class="h-full bg-gold rounded-full transition-all duration-500"
                :style="{ width: stat.total > 0 ? `${(stat.correct / stat.total) * 100}%` : '0%' }"
              />
            </div>
            <span class="text-xs font-mono text-neutral-500 dark:text-neutral-400 w-12 text-right">{{ stat.correct }}/{{ stat.total }}</span>
          </div>
        </div>
      </div>

      <!-- 다시하기 -->
      <div class="flex gap-3">
        <button
          class="flex-1 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          @click="reset"
        >
          다른 설정으로 다시하기
        </button>
        <NuxtLink
          to="/rankings"
          class="flex-1 py-3 bg-ink-light dark:bg-ink-dark text-surface-light dark:text-surface-dark rounded-lg text-sm font-medium text-center hover:opacity-80 transition-opacity"
        >
          랭킹 확인 →
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'

interface Option { id: string; text: string }
interface Question { id: string; title: string; difficulty: string; category: string; options: Option[] }

type Phase = 'filter' | 'quiz' | 'result'

const difficulties = ref(['junior', 'mid', 'senior'])
const categories = ref(['network', 'os', 'db', 'java', 'typescript', 'data_structure', 'cloud_devops'])
const count = ref(10)
const allowDuplicate = ref(false)

const phase = ref<Phase>('filter')
const loading = ref(false)
const error = ref('')
const questions = ref<Question[]>([])
const currentIndex = ref(0)
const answered = ref(false)
const submittingAnswer = ref(false)
const selectedOptionId = ref<string | null>(null)
const correctOptionId = ref<string | null>(null)
const explanation = ref('')
const answers = ref<Record<string, boolean>>({})

const currentQ = computed(() => questions.value[currentIndex.value])
const correctCount = computed(() => Object.values(answers.value).filter(Boolean).length)

const renderedExplanation = computed(() => {
  if (!explanation.value) return ''
  return marked(explanation.value) as string
})

const categoryStats = computed(() => {
  const stats: Record<string, { category: string; correct: number; total: number }> = {}
  for (const q of questions.value) {
    if (!stats[q.category]) stats[q.category] = { category: q.category, correct: 0, total: 0 }
    stats[q.category].total++
    if (answers.value[q.id]) stats[q.category].correct++
  }
  return Object.values(stats)
})

async function startQuiz() {
  loading.value = true
  error.value = ''
  try {
    const res = await $fetch<{ sessionId: string; questions: Question[] }>('/api/quiz/mcq/session', {
      method: 'POST',
      body: {
        categories: categories.value,
        difficulties: difficulties.value,
        count: count.value,
        allowDuplicate: allowDuplicate.value,
      },
    })
    questions.value = res.questions
    phase.value = 'quiz'
  }
  catch (e: any) {
    error.value = e?.data?.statusMessage ?? '문제를 불러오지 못했습니다.'
  }
  finally {
    loading.value = false
  }
}

async function selectOption(optionId: string) {
  if (answered.value || submittingAnswer.value) return
  selectedOptionId.value = optionId
  submittingAnswer.value = true
  error.value = ''

  try {
    const res = await $fetch<{ isCorrect: boolean; correctOptionId: string; explanation: string }>('/api/quiz/mcq/answer', {
      method: 'POST',
      body: { questionId: currentQ.value.id, selectedOptionId: optionId },
    })

    correctOptionId.value = res.correctOptionId
    explanation.value = res.explanation
    answers.value[currentQ.value.id] = res.isCorrect
    answered.value = true
  }
  catch (e: any) {
    selectedOptionId.value = null
    correctOptionId.value = null
    explanation.value = ''
    error.value = e?.data?.statusMessage ?? '답안을 제출하지 못했습니다.'
  }
  finally {
    submittingAnswer.value = false
  }
}

function nextQuestion() {
  if (currentIndex.value + 1 >= questions.value.length) {
    phase.value = 'result'
    return
  }
  currentIndex.value++
  answered.value = false
  submittingAnswer.value = false
  selectedOptionId.value = null
  correctOptionId.value = null
  explanation.value = ''
}

function optionClass(optId: string) {
  if (submittingAnswer.value) {
    if (optId === selectedOptionId.value) {
      return 'border-gold bg-gold/10 text-ink-light dark:text-ink-dark'
    }
    return 'border-neutral-200 dark:border-neutral-700 text-neutral-400 dark:text-neutral-500'
  }
  if (!answered.value) {
    return 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500'
  }
  if (optId === correctOptionId.value) {
    return 'border-emerald-400 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
  }
  if (optId === selectedOptionId.value) {
    return 'border-red-400 dark:border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
  }
  return 'border-neutral-100 dark:border-neutral-800 text-neutral-400 dark:text-neutral-600'
}

function reset() {
  phase.value = 'filter'
  questions.value = []
  currentIndex.value = 0
  answered.value = false
  submittingAnswer.value = false
  selectedOptionId.value = null
  correctOptionId.value = null
  explanation.value = ''
  answers.value = {}
}

useHead({ title: '사지선다 모드 — BackGSM' })
</script>

<style scoped>
.fade-down-enter-active,
.fade-down-leave-active {
  transition: all 0.3s ease;
}
.fade-down-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}
.fade-down-leave-to {
  opacity: 0;
}
</style>
