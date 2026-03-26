<template>
  <span
    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border"
    :class="colorClass"
  >
    {{ label }}
  </span>
</template>

<script setup lang="ts">
const DIFFICULTY_LABELS: Record<string, string> = {
  junior: '초급',
  mid: '중급',
  senior: '고급',
}

const DIFFICULTY_COLORS: Record<string, string> = {
  junior: 'border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/20',
  mid: 'border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20',
  senior: 'border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20',
}

const props = defineProps<{ difficulty: string }>()

const label = computed(() => DIFFICULTY_LABELS[props.difficulty] ?? props.difficulty)
const colorClass = computed(() => DIFFICULTY_COLORS[props.difficulty] ?? 'border-neutral-200 text-neutral-600')
</script>
