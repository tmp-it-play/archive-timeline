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
          :class="selectedDifficulties.includes(d.value)
            ? 'border-ink-light dark:border-ink-dark bg-ink-light dark:bg-ink-dark text-surface-light dark:text-surface-dark'
            : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-500'"
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
          :class="selectedCategories.includes(c.value)
            ? 'border-ink-light dark:border-ink-dark bg-ink-light dark:bg-ink-dark text-surface-light dark:text-surface-dark'
            : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-500'"
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
        class="relative w-10 h-6 rounded-full transition-colors"
        :class="allowDuplicate ? 'bg-gold' : 'bg-neutral-200 dark:bg-neutral-700'"
        @click="allowDuplicate = !allowDuplicate"
      >
        <span
          class="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
          :class="allowDuplicate ? 'translate-x-4' : 'translate-x-0.5'"
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

const CATEGORIES = [
  { value: 'network', label: '네트워크' },
  { value: 'os', label: 'OS' },
  { value: 'db', label: 'DB' },
  { value: 'java', label: 'Java' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'data_structure', label: '자료구조' },
  { value: 'cloud_devops', label: '클라우드·DevOps' },
]

defineProps<{
  showCount?: boolean
}>()

const { isLoggedIn } = useAuth()

const selectedDifficulties = defineModel<string[]>('difficulties', {
  default: () => ['junior', 'mid', 'senior'],
})
const selectedCategories = defineModel<string[]>('categories', {
  default: () => ['network', 'os', 'db', 'java', 'typescript', 'data_structure', 'cloud_devops'],
})
const count = defineModel<number>('count', { default: 10 })
const allowDuplicate = defineModel<boolean>('allowDuplicate', { default: false })

const toggleDifficulty = (val: string) => {
  const idx = selectedDifficulties.value.indexOf(val)
  if (idx >= 0) {
    if (selectedDifficulties.value.length > 1) {
      selectedDifficulties.value = selectedDifficulties.value.filter(d => d !== val)
    }
  }
  else {
    selectedDifficulties.value = [...selectedDifficulties.value, val]
  }
}

const toggleCategory = (val: string) => {
  const idx = selectedCategories.value.indexOf(val)
  if (idx >= 0) {
    if (selectedCategories.value.length > 1) {
      selectedCategories.value = selectedCategories.value.filter(c => c !== val)
    }
  }
  else {
    selectedCategories.value = [...selectedCategories.value, val]
  }
}
</script>
