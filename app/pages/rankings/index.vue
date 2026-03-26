<template>
  <div class="space-y-8">
    <div>
      <p class="text-xs font-mono text-gold uppercase tracking-[0.2em] mb-2">Leaderboard</p>
      <h1 class="text-3xl font-semibold tracking-tight">랭킹</h1>
      <p class="text-neutral-500 dark:text-neutral-400 mt-2 text-sm">DataGSM 계정으로 로그인한 학생만 랭킹에 등재됩니다.</p>
    </div>

    <!-- 탭 -->
    <div class="flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-fit">
      <button
        v-for="tab in TABS"
        :key="tab.value"
        class="px-4 py-2 text-sm rounded-md transition-all"
        :class="activeTab === tab.value
          ? 'bg-surface-light dark:bg-surface-dark text-ink-light dark:text-ink-dark shadow-sm font-medium'
          : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 카테고리/난이도 선택 (탭에 따라) -->
    <div v-if="activeTab === 'category'" class="flex flex-wrap gap-2">
      <button
        v-for="c in CATEGORIES"
        :key="c.value"
        class="px-3 py-1.5 text-sm rounded-md border transition-all"
        :class="getCategoryClass(c.value, selectedCategory === c.value)"
        @click="selectedCategory = c.value"
      >
        {{ c.label }}
      </button>
    </div>

    <div v-else-if="activeTab === 'difficulty'" class="flex gap-2">
      <button
        v-for="d in DIFFICULTIES"
        :key="d.value"
        class="px-3 py-1.5 text-sm rounded-md border transition-all"
        :class="getDifficultyClass(d.value, selectedDifficulty === d.value)"
        @click="selectedDifficulty = d.value"
      >
        {{ d.label }}
      </button>
    </div>

    <!-- 내 순위 배너 -->
    <div
      v-if="isLoggedIn && !pending"
      class="flex items-center gap-3 px-5 py-3.5 border rounded-lg"
      :class="myRank ? myRankBannerClass : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50'"
    >
      <span
        class="font-mono font-bold text-lg"
        :class="myRank ? myRankTextClass : 'text-neutral-400 dark:text-neutral-500'"
      >
        {{ myRank ? `#${myRank}` : 'Unranked' }}
      </span>
      <span class="text-sm text-neutral-600 dark:text-neutral-300">
        {{ myRank ? myRankMessage : '아직 랭킹에 등재되지 않았습니다. 문제를 풀고 첫 랭킹을 만들어보세요.' }}
      </span>
    </div>

    <!-- 랭킹 테이블 -->
    <div v-if="pending" class="text-center py-16 text-neutral-400 dark:text-neutral-500">불러오는 중...</div>
    <div v-else-if="!rankingData?.rankings?.length" class="text-center py-16 text-neutral-400 dark:text-neutral-500">
      랭킹 데이터가 없습니다.
    </div>
    <div v-else class="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
            <th class="px-5 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider w-12">순위</th>
            <th class="px-5 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">이름</th>
            <th class="px-5 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">정답률</th>
            <th class="px-5 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider hidden sm:table-cell">풀이 수</th>
            <th v-if="activeTab === 'overall'" class="px-5 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider hidden sm:table-cell">점수</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rankingData.rankings"
            :key="row.rank"
            class="border-b border-neutral-100 dark:border-neutral-800 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
          >
            <td class="px-5 py-4">
              <span
                class="font-mono font-bold"
                :class="{
                  'text-gold text-lg': row.rank === 1,
                  'text-slate-500 dark:text-slate-300 text-lg': row.rank === 2,
                  'text-amber-700 dark:text-amber-400 text-lg': row.rank === 3,
                  'text-neutral-400 dark:text-neutral-500': row.rank > 3,
                }"
              >
                {{ row.rank <= 3 ? ['🥇', '🥈', '🥉'][row.rank - 1] : `#${row.rank}` }}
              </span>
            </td>
            <td class="px-5 py-4 font-medium">{{ row.displayName }}</td>
            <td class="px-5 py-4 text-right font-mono">{{ Math.round(row.accuracy * 100) }}%</td>
            <td class="px-5 py-4 text-right text-neutral-500 dark:text-neutral-400 hidden sm:table-cell">{{ row.totalAttempts }}문제</td>
            <td v-if="activeTab === 'overall'" class="px-5 py-4 text-right font-mono text-gold hidden sm:table-cell">{{ row.score?.toFixed(1) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 페이지네이션 -->
    <div v-if="rankingData && rankingData.total > 10" class="flex justify-center gap-2">
      <button
        class="px-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-40"
        :disabled="page <= 1"
        @click="page--"
      >
        ← 이전
      </button>
      <span class="px-4 py-2 text-sm text-neutral-500 dark:text-neutral-400">
        {{ page }} / {{ Math.ceil(rankingData.total / 10) }}
      </span>
      <button
        class="px-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-40"
        :disabled="page >= Math.ceil(rankingData.total / 10)"
        @click="page++"
      >
        다음 →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const TABS = [
  { value: 'overall', label: '전체' },
  { value: 'category', label: '카테고리별' },
  { value: 'difficulty', label: '난이도별' },
]

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
    active: 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800',
    inactive: 'border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 bg-white dark:bg-transparent hover:border-neutral-300 dark:hover:border-neutral-700',
  },
  ai_dev: {
    active: 'border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-900/20',
    inactive: 'border-violet-100 dark:border-violet-900/70 text-violet-500 dark:text-violet-400 bg-white dark:bg-transparent hover:border-violet-200 dark:hover:border-violet-800',
  },
}

const { isLoggedIn } = useAuth()

const activeTab = ref('overall')
const selectedCategory = ref('network')
const selectedDifficulty = ref('junior')
const page = ref(1)

const getDifficultyClass = (difficulty: string, selected: boolean) => {
  const colors = DIFFICULTY_CLASSES[difficulty]
  if (!colors) {
    return selected
      ? 'border-ink-light dark:border-ink-dark bg-ink-light dark:bg-ink-dark text-surface-light dark:text-surface-dark'
      : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:border-neutral-400'
  }
  return selected ? colors.active : colors.inactive
}

const getCategoryClass = (category: string, selected: boolean) => {
  const colors = CATEGORY_CLASSES[category]
  if (!colors) {
    return selected
      ? 'border-ink-light dark:border-ink-dark bg-ink-light dark:bg-ink-dark text-surface-light dark:text-surface-dark'
      : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:border-neutral-400'
  }
  return selected ? colors.active : colors.inactive
}

const apiParams = computed(() => {
  const params: Record<string, string> = { type: activeTab.value, page: String(page.value) }
  if (activeTab.value === 'category') params.category = selectedCategory.value
  if (activeTab.value === 'difficulty') params.difficulty = selectedDifficulty.value
  return params
})

const { data: rankingData, pending } = await useLazyFetch('/api/rankings', {
  query: apiParams,
  watch: [apiParams],
})

const myRank = computed(() => rankingData.value?.myRank ?? null)
const myRankBannerClass = computed(() => {
  if (myRank.value === 1) return 'border-gold/40 bg-gold/5'
  if (myRank.value === 2) return 'border-slate-300/70 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40'
  if (myRank.value === 3) return 'border-amber-300/70 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30'
  return 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50'
})
const myRankTextClass = computed(() => {
  if (myRank.value === 1) return 'text-gold'
  if (myRank.value === 2) return 'text-slate-600 dark:text-slate-300'
  if (myRank.value === 3) return 'text-amber-700 dark:text-amber-400'
  return 'text-neutral-600 dark:text-neutral-300'
})
const myRankMessage = computed(() => {
  if (!myRank.value) return ''
  return `현재 ${myRank.value}위입니다.`
})

watch([activeTab, selectedCategory, selectedDifficulty], () => { page.value = 1 })

useHead({ title: '랭킹 — BackGSM' })
</script>
