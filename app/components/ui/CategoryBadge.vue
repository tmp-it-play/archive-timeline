<template>
  <span
    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border"
    :class="colorClass"
  >
    {{ label }}
  </span>
</template>

<script setup lang="ts">
const CATEGORY_LABELS: Record<string, string> = {
  network: '네트워크',
  os: 'OS',
  db: 'DB',
  java: 'Java',
  typescript: 'TypeScript',
  data_structure: '자료구조',
  cloud_devops: '클라우드·DevOps',
}

const CATEGORY_COLORS: Record<string, string> = {
  network: 'border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20',
  os: 'border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20',
  db: 'border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20',
  java: 'border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20',
  typescript: 'border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-900/20',
  data_structure: 'border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300 bg-pink-50 dark:bg-pink-900/20',
  cloud_devops: 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800',
}

const props = defineProps<{ category: string }>()

const label = computed(() => CATEGORY_LABELS[props.category] ?? props.category)
const colorClass = computed(() => CATEGORY_COLORS[props.category] ?? 'border-neutral-200 text-neutral-600')
</script>
