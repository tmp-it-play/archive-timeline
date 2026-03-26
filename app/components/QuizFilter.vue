<template>
  <div class="space-y-6">
    <!-- 난이도 선택 -->
    <div>
      <p class="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-3">난이도</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="d in DIFFICULTIES"
          :key="d.value"
          class="px-3 py-1.5 text-sm rounded-md border transition-all"
          :class="getDifficultyClass(d.value, selectedDifficulties.includes(d.value))"
          @click="toggleDifficulty(d.value)"
        >
          {{ d.label }}
        </button>
      </div>
    </div>

    <!-- 카테고리 선택 -->
    <div>
      <p class="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-3">카테고리</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="c in CATEGORIES"
          :key="c.value"
          class="px-3 py-1.5 text-sm rounded-md border transition-all"
          :class="getCategoryClass(c.value, selectedCategories.includes(c.value))"
          @click="toggleCategory(c.value)"
        >
          {{ c.label }}
        </button>
      </div>
    </div>

    <!-- 문제 수 (MCQ 전용) -->
    <div v-if="showCount">
      <div class="flex items-center justify-between mb-3">
        <p class="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">문제 수</p>
        <span class="text-sm font-mono font-semibold text-gold">{{ count }}개</span>
      </div>
      <input
        v-model="count"
        type="range"
        min="5"
        max="50"
        step="1"
        class="w-full accent-gold"
      >
      <div class="flex justify-between text-xs text-neutral-400 dark:text-neutral-500 mt-1">
        <span>5</span>
        <span>50</span>
      </div>
    </div>

    <!-- 중복허용 토글 (로그인 시) -->
    <div v-if="isLoggedIn" class="flex items-center justify-between py-3 border-t border-neutral-100 dark:border-neutral-800">
      <div>
        <p class="text-sm font-medium">중복 허용</p>
        <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          {{ showCount ? '이미 맞춘 문제도 출제' : '이미 본 개념도 포함' }}
        </p>
      </div>
      <button
        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
        :class="allowDuplicate ? 'bg-gold' : 'bg-neutral-200 dark:bg-neutral-700'"
        @click="allowDuplicate = !allowDuplicate"
      >
        <span
          class="block h-5 w-5 rounded-full bg-white shadow transition-transform"
          :class="allowDuplicate ? 'translate-x-[1.375rem]' : 'translate-x-0.5'"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const DIFFICULTIES = [
  { value: 'junior', label: '초급' },
  { value: 'mid', label: '중급' },
  { value: 'senior', label: '고급' },
]

const DIFFICULTY_CLASSES: Record<string, { active: string; inactive: string }> = {
  junior: {
    active: 'border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20',
    inactive: 'border-emerald-100 dark:border-emerald-900/70 text-emerald-500 dark:text-emerald-400 bg-white dark:bg-transparent hover:border-emerald-200 dark:hover:border-emerald-800',
  },
  mid: {
    active: 'border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20',
    inactive: 'border-amber-100 dark:border-amber-900/70 text-amber-500 dark:text-amber-400 bg-white dark:bg-transparent hover:border-amber-200 dark:hover:border-amber-800',
  },
  senior: {
    active: 'border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20',
    inactive: 'border-red-100 dark:border-red-900/70 text-red-500 dark:text-red-400 bg-white dark:bg-transparent hover:border-red-200 dark:hover:border-red-800',
  },
}

const CATEGORIES = [
  { value: 'network', label: '네트워크' },
  { value: 'os', label: 'OS' },
  { value: 'db', label: 'DB' },
  { value: 'java', label: 'JVM·Spring' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'data_structure', label: '자료구조' },
  { value: 'cloud_devops', label: '클라우드·DevOps' },
  { value: 'ai_dev', label: 'LLM·AI 개발' },
]

const CATEGORY_CLASSES: Record<string, { active: string; inactive: string }> = {
  network: {
    active: 'border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20',
    inactive: 'border-blue-100 dark:border-blue-900/70 text-blue-500 dark:text-blue-400 bg-white dark:bg-transparent hover:border-blue-200 dark:hover:border-blue-800',
  },
  os: {
    active: 'border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20',
    inactive: 'border-purple-100 dark:border-purple-900/70 text-purple-500 dark:text-purple-400 bg-white dark:bg-transparent hover:border-purple-200 dark:hover:border-purple-800',
  },
  db: {
    active: 'border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20',
    inactive: 'border-green-100 dark:border-green-900/70 text-green-500 dark:text-green-400 bg-white dark:bg-transparent hover:border-green-200 dark:hover:border-green-800',
  },
  java: {
    active: 'border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20',
    inactive: 'border-orange-100 dark:border-orange-900/70 text-orange-500 dark:text-orange-400 bg-white dark:bg-transparent hover:border-orange-200 dark:hover:border-orange-800',
  },
  typescript: {
    active: 'border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-900/20',
    inactive: 'border-sky-100 dark:border-sky-900/70 text-sky-500 dark:text-sky-400 bg-white dark:bg-transparent hover:border-sky-200 dark:hover:border-sky-800',
  },
  data_structure: {
    active: 'border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300 bg-pink-50 dark:bg-pink-900/20',
    inactive: 'border-pink-100 dark:border-pink-900/70 text-pink-500 dark:text-pink-400 bg-white dark:bg-transparent hover:border-pink-200 dark:hover:border-pink-800',
  },
  cloud_devops: {
    active: 'border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/20',
    inactive: 'border-teal-100 dark:border-teal-900/70 text-teal-500 dark:text-teal-400 bg-white dark:bg-transparent hover:border-teal-200 dark:hover:border-teal-800',
  },
  ai_dev: {
    active: 'border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-900/20',
    inactive: 'border-violet-100 dark:border-violet-900/70 text-violet-500 dark:text-violet-400 bg-white dark:bg-transparent hover:border-violet-200 dark:hover:border-violet-800',
  },
}

defineProps<{
  showCount?: boolean
}>()

const { isLoggedIn } = useAuth()

const selectedDifficulties = defineModel<string[]>('difficulties', {
  default: () => [],
})
const selectedCategories = defineModel<string[]>('categories', {
  default: () => [],
})
const count = defineModel<number>('count', { default: 10 })
const allowDuplicate = defineModel<boolean>('allowDuplicate', { default: false })

const getDifficultyClass = (difficulty: string, selected: boolean) => {
  const colors = DIFFICULTY_CLASSES[difficulty]
  if (!colors) {
    return selected
      ? 'border-ink-light dark:border-ink-dark bg-ink-light dark:bg-ink-dark text-surface-light dark:text-surface-dark'
      : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-500'
  }
  return selected ? colors.active : colors.inactive
}

const getCategoryClass = (category: string, selected: boolean) => {
  const colors = CATEGORY_CLASSES[category]
  if (!colors) {
    return selected
      ? 'border-ink-light dark:border-ink-dark bg-ink-light dark:bg-ink-dark text-surface-light dark:text-surface-dark'
      : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-500'
  }
  return selected ? colors.active : colors.inactive
}

const toggleDifficulty = (val: string) => {
  const idx = selectedDifficulties.value.indexOf(val)
  if (idx >= 0) {
    selectedDifficulties.value = selectedDifficulties.value.filter(d => d !== val)
  }
  else {
    selectedDifficulties.value = [...selectedDifficulties.value, val]
  }
}

const toggleCategory = (val: string) => {
  const idx = selectedCategories.value.indexOf(val)
  if (idx >= 0) {
    selectedCategories.value = selectedCategories.value.filter(c => c !== val)
  }
  else {
    selectedCategories.value = [...selectedCategories.value, val]
  }
}
</script>
