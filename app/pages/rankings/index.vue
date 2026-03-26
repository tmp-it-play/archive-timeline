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
        :class="selectedCategory === c.value
          ? 'border-ink-light dark:border-ink-dark bg-ink-light dark:bg-ink-dark text-surface-light dark:text-surface-dark'
          : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:border-neutral-400'"
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
        :class="selectedDifficulty === d.value
          ? 'border-ink-light dark:border-ink-dark bg-ink-light dark:bg-ink-dark text-surface-light dark:text-surface-dark'
          : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:border-neutral-400'"
        @click="selectedDifficulty = d.value"
      >
        {{ d.label }}
      </button>
    </div>

    <!-- 내 순위 배너 -->
    <div v-if="myRank && isLoggedIn" class="flex items-center gap-3 px-5 py-3.5 border border-gold/40 bg-gold/5 rounded-lg">
      <span class="text-gold font-mono font-bold text-lg">#{{ myRank }}</span>
      <span class="text-sm">현재 내 순위</span>
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
                  'text-neutral-400 dark:text-neutral-500': row.rank > 3,
                  'text-neutral-600 dark:text-neutral-300': row.rank === 2 || row.rank === 3,
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
  { value: 'java', label: 'Java' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'data_structure', label: '자료구조' },
  { value: 'cloud_devops', label: '클라우드·DevOps' },
]

const DIFFICULTIES = [
  { value: 'junior', label: '초급' },
  { value: 'mid', label: '중급' },
  { value: 'senior', label: '고급' },
]

const { isLoggedIn } = useAuth()

const activeTab = ref('overall')
const selectedCategory = ref('network')
const selectedDifficulty = ref('junior')
const page = ref(1)

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

watch([activeTab, selectedCategory, selectedDifficulty], () => { page.value = 1 })

useHead({ title: '랭킹 — BackGSM' })
</script>
