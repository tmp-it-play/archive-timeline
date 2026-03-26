<template>
  <div>
    <!-- 필터 설정 -->
    <div v-if="phase === 'filter'" class="max-w-2xl mx-auto space-y-8">
      <div>
        <p class="text-xs font-mono text-gold uppercase tracking-[0.2em] mb-2">개념·해설 모드</p>
        <h1 class="text-3xl font-semibold tracking-tight">출제 설정</h1>
        <p class="text-neutral-500 dark:text-neutral-400 mt-2 text-sm">카드를 뒤집어 개념을 확인하고 해설로 이해를 다집니다.</p>
      </div>

      <QuizFilter
        v-model:difficulties="difficulties"
        v-model:categories="categories"
        v-model:allow-duplicate="allowDuplicate"
        :show-count="false"
      />

      <button
        class="w-full py-3 bg-ink-light dark:bg-ink-dark text-surface-light dark:text-surface-dark rounded-lg font-medium hover:opacity-80 transition-opacity disabled:opacity-40"
        :disabled="loading"
        @click="loadConcepts"
      >
        {{ loading ? '불러오는 중...' : '시작하기' }}
      </button>

      <p v-if="error" class="text-sm text-red-500 text-center">{{ error }}</p>
    </div>

    <!-- 카드 플립 모드 -->
    <div v-else-if="phase === 'play'" class="max-w-2xl mx-auto space-y-6">
      <!-- 진행 상태 -->
      <div class="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
        <span>{{ currentIndex + 1 }} / {{ concepts.length }}</span>
        <div class="flex gap-2">
          <UiCategoryBadge :category="currentConcept.category" />
          <UiDifficultyBadge :difficulty="currentConcept.difficulty" />
        </div>
      </div>

      <!-- 카드 -->
      <div class="card-container" style="height: 400px;">
        <div
          class="card-inner w-full h-full cursor-pointer"
          :class="{ flipped: isFlipped }"
          @click="flip"
        >
          <!-- 앞면: 개념 제목 -->
          <div class="card-front absolute inset-0 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 flex flex-col justify-center items-center text-center bg-surface-light dark:bg-surface-dark">
            <p class="text-xs font-mono text-gold uppercase tracking-[0.2em] mb-6">개념</p>
            <h2 class="text-2xl font-semibold leading-snug">{{ currentConcept.title }}</h2>
            <p class="text-xs text-neutral-400 dark:text-neutral-500 mt-8">클릭하여 해설 보기</p>
          </div>

          <!-- 뒷면: 해설 -->
          <div class="card-back absolute inset-0 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 flex flex-col bg-surface-light dark:bg-surface-dark overflow-y-auto">
            <p class="text-xs font-mono text-gold uppercase tracking-[0.2em] mb-4">해설</p>
            <div class="prose prose-sm dark:prose-invert max-w-none flex-1" v-html="renderedContent" />
          </div>
        </div>
      </div>

      <!-- 네비게이션 -->
      <div class="flex gap-3">
        <button
          class="flex-1 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-40"
          :disabled="currentIndex === 0"
          @click="prev"
        >
          ← 이전
        </button>
        <button
          class="flex-1 py-2.5 bg-ink-light dark:bg-ink-dark text-surface-light dark:text-surface-dark rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
          @click="next"
        >
          {{ currentIndex + 1 < concepts.length ? '다음 →' : '완료' }}
        </button>
      </div>

      <!-- 설정으로 돌아가기 -->
      <button
        class="w-full text-sm text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
        @click="phase = 'filter'"
      >
        설정으로 돌아가기
      </button>
    </div>

    <!-- 완료 화면 -->
    <div v-else-if="phase === 'done'" class="max-w-2xl mx-auto text-center space-y-6 py-16">
      <p class="text-xs font-mono text-gold uppercase tracking-[0.2em]">완료</p>
      <h2 class="text-3xl font-semibold">모든 개념을 확인했습니다.</h2>
      <p class="text-neutral-500 dark:text-neutral-400">{{ concepts.length }}개의 개념을 살펴보았습니다.</p>
      <div class="flex gap-3 justify-center">
        <button
          class="px-6 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          @click="reset"
        >
          다시하기
        </button>
        <NuxtLink
          to="/mypage"
          class="px-6 py-3 bg-ink-light dark:bg-ink-dark text-surface-light dark:text-surface-dark rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
        >
          마이페이지 →
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'

interface Concept {
  id: string
  title: string
  category: string
  difficulty: string
  content?: string
}

type Phase = 'filter' | 'play' | 'done'

const difficulties = ref(['junior', 'mid', 'senior'])
const categories = ref(['network', 'os', 'db', 'java', 'typescript', 'data_structure', 'cloud_devops'])
const allowDuplicate = ref(false)

const phase = ref<Phase>('filter')
const loading = ref(false)
const error = ref('')
const concepts = ref<Concept[]>([])
const currentIndex = ref(0)
const isFlipped = ref(false)
const viewedSet = ref(new Set<string>())

const currentConcept = computed(() => concepts.value[currentIndex.value])

const renderedContent = computed(() => {
  if (!currentConcept.value?.content) return ''
  return marked(currentConcept.value.content) as string
})

async function loadConcepts() {
  loading.value = true
  error.value = ''
  try {
    const params = new URLSearchParams({
      categories: categories.value.join(','),
      difficulties: difficulties.value.join(','),
      allowDuplicate: String(allowDuplicate.value),
      limit: '100',
    })
    const res = await $fetch<{ questions: Concept[] }>(`/api/questions/concept?${params}`)
    if (!res.questions.length) {
      error.value = '조건에 맞는 개념이 없습니다.'
      return
    }
    // 셔플
    concepts.value = [...res.questions].sort(() => Math.random() - 0.5)
    phase.value = 'play'
  }
  catch {
    error.value = '개념을 불러오지 못했습니다.'
  }
  finally {
    loading.value = false
  }
}

// 개념 상세 내용 lazy load
async function loadConceptDetail(id: string) {
  const idx = concepts.value.findIndex(c => c.id === id)
  if (idx < 0 || concepts.value[idx].content) return
  try {
    const res = await $fetch<{ content: string }>(`/api/questions/concept/${id}`)
    concepts.value[idx] = { ...concepts.value[idx], content: res.content }
  }
  catch {}
}

function flip() {
  isFlipped.value = !isFlipped.value
  if (isFlipped.value && !viewedSet.value.has(currentConcept.value.id)) {
    viewedSet.value.add(currentConcept.value.id)
    // 서버에 열람 기록
    $fetch('/api/quiz/concept/view', {
      method: 'POST',
      body: { questionId: currentConcept.value.id },
    })
  }
}

async function next() {
  if (currentIndex.value + 1 >= concepts.value.length) {
    phase.value = 'done'
    return
  }
  currentIndex.value++
  isFlipped.value = false
  await loadConceptDetail(concepts.value[currentIndex.value].id)
}

function prev() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    isFlipped.value = false
  }
}

function reset() {
  phase.value = 'filter'
  concepts.value = []
  currentIndex.value = 0
  isFlipped.value = false
  viewedSet.value = new Set()
}

watch(currentIndex, async (newIdx) => {
  if (newIdx + 1 < concepts.value.length) {
    await loadConceptDetail(concepts.value[newIdx + 1].id)
  }
})

onMounted(async () => {
  if (concepts.value.length > 0) {
    await loadConceptDetail(concepts.value[0].id)
  }
})

useHead({ title: '개념·해설 모드 — BackGSM' })
</script>
