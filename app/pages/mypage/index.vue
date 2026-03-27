<template>
  <div class="space-y-10">
    <!-- 로그인 필요 -->
    <div v-if="!isLoggedIn" class="text-center py-20 space-y-4">
      <p class="text-2xl font-semibold">로그인이 필요합니다</p>
      <p class="text-neutral-500 dark:text-neutral-400 text-sm">DataGSM 계정으로 로그인하면 마이페이지를 이용할 수 있습니다.</p>
      <button
        class="mt-4 px-6 py-3 bg-ink-light dark:bg-ink-dark text-surface-light dark:text-surface-dark rounded-lg font-medium hover:opacity-80 transition-opacity"
        @click="login"
      >
        DataGSM 로그인
      </button>
    </div>

    <template v-else-if="stats">
      <div>
        <p class="text-xs font-mono text-gold uppercase tracking-[0.2em] mb-2">My Page</p>
        <h1 class="text-3xl font-semibold tracking-tight">{{ user?.displayName }}</h1>
      </div>

      <!-- 사지선다 통계 -->
      <section>
        <h2 class="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-5">사지선다 통계</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div
            v-for="stat in MCQ_STATS"
            :key="stat.key"
            class="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5"
          >
            <p class="text-xs text-neutral-500 dark:text-neutral-400 mb-2">{{ stat.label }}</p>
            <p class="text-2xl font-mono font-bold" :class="stat.color">{{ stat.format(stats.mcq) }}</p>
          </div>
        </div>
      </section>

      <!-- 개념 통계 -->
      <section>
        <h2 class="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-5">개념·해설 통계</h2>
        <div class="grid grid-cols-3 gap-3">
          <div class="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
            <p class="text-xs text-neutral-500 dark:text-neutral-400 mb-2">전체 개념</p>
            <p class="text-2xl font-mono font-bold">{{ stats.concept.totalConcepts }}</p>
          </div>
          <div class="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
            <p class="text-xs text-neutral-500 dark:text-neutral-400 mb-2">열람한 개념</p>
            <p class="text-2xl font-mono font-bold text-gold">{{ stats.concept.viewedCount }}</p>
          </div>
          <div class="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
            <p class="text-xs text-neutral-500 dark:text-neutral-400 mb-2">미열람 개념</p>
            <p class="text-2xl font-mono font-bold text-neutral-400 dark:text-neutral-500">{{ stats.concept.unviewedCount }}</p>
          </div>
        </div>

        <!-- 개념 진행 바 -->
        <div class="mt-4 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
          <div class="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-3">
            <span>열람 진행률</span>
            <span class="font-mono">{{ stats.concept.totalConcepts > 0 ? Math.round((stats.concept.viewedCount / stats.concept.totalConcepts) * 100) : 0 }}%</span>
          </div>
          <div class="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              class="h-full bg-gold rounded-full transition-all duration-700"
              :style="{ width: stats.concept.totalConcepts > 0 ? `${(stats.concept.viewedCount / stats.concept.totalConcepts) * 100}%` : '0%' }"
            />
          </div>
        </div>
      </section>

      <!-- 카테고리별 정답률 -->
      <section>
        <h2 class="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-5">카테고리별 정답률</h2>
        <div class="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                <th class="px-5 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400">카테고리</th>
                <th class="px-5 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400">사지선다 정답률</th>
                <th class="px-5 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 hidden sm:table-cell">개념 열람</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="c in stats.categoryStats"
                :key="c.category"
                class="border-b border-neutral-100 dark:border-neutral-800 last:border-0"
              >
                <td class="px-5 py-3.5">
                  <UiCategoryBadge :category="c.category" />
                </td>
                <td class="px-5 py-3.5 text-right">
                  <span v-if="c.mcqAttempts > 0" class="font-mono">{{ Math.round(c.mcqAccuracy * 100) }}%</span>
                  <span v-else class="text-neutral-300 dark:text-neutral-600 text-xs">미풀이</span>
                </td>
                <td class="px-5 py-3.5 text-right text-neutral-500 dark:text-neutral-400 font-mono hidden sm:table-cell">
                  {{ c.conceptViewed }}/{{ c.conceptTotal }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- 진도 초기화 -->
      <section class="border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl p-6 space-y-4">
        <div>
          <h2 class="font-semibold mb-1">진도 초기화</h2>
          <p class="text-sm text-neutral-500 dark:text-neutral-400">기록을 초기화하면 이미 푼 문제/본 개념도 다시 출제됩니다.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="opt in RESET_OPTIONS"
            :key="opt.type"
            class="px-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            @click="confirmReset(opt.type)"
          >
            {{ opt.label }}
          </button>
        </div>
      </section>
    </template>

    <!-- 로딩 -->
    <div v-else class="text-center py-16 text-neutral-400 dark:text-neutral-500">불러오는 중...</div>

    <!-- 초기화 확인 모달 -->
    <div v-if="resetTarget" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm" @click="resetTarget = null" />
      <div class="relative bg-surface-light dark:bg-surface-dark border border-neutral-200 dark:border-neutral-800 rounded-xl p-8 max-w-sm w-full mx-4 shadow-xl">
        <h3 class="font-semibold mb-2">{{ RESET_OPTIONS.find(o => o.type === resetTarget)?.label }}</h3>
        <p class="text-sm text-neutral-500 dark:text-neutral-400 mb-3">이 작업은 되돌릴 수 없습니다. 정말 초기화하시겠습니까?</p>
        <div
          v-if="resetTarget === 'mcq' || resetTarget === 'all'"
          class="flex items-start gap-2 px-3 py-2.5 mb-6 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
        >
          <span class="text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0">⚠</span>
          <p class="text-xs text-red-600 dark:text-red-400 leading-relaxed">
            사지선다 기록이 초기화되면 <strong>랭킹 점수와 순위도 함께 삭제</strong>됩니다.
          </p>
        </div>
        <div v-else class="mb-6" />
        <div class="flex gap-3">
          <button
            class="flex-1 py-2.5 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            @click="resetTarget = null"
          >
            취소
          </button>
          <button
            class="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
            :disabled="resetting"
            @click="doReset"
          >
            {{ resetting ? '초기화 중...' : '초기화' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, isLoggedIn, login } = useAuth()

const RESET_OPTIONS = [
  { type: 'mcq', label: '사지선다 기록 초기화' },
  { type: 'concept', label: '개념 열람 기록 초기화' },
  { type: 'all', label: '전체 초기화' },
]

const MCQ_STATS = [
  { key: 'totalAttempts', label: '총 풀이 수', color: '', format: (m: any) => m.totalAttempts },
  { key: 'correctCount', label: '맞은 수', color: 'text-emerald-600 dark:text-emerald-400', format: (m: any) => m.correctCount },
  { key: 'incorrectCount', label: '틀린 수', color: 'text-red-500 dark:text-red-400', format: (m: any) => m.incorrectCount },
  { key: 'unsolvedCount', label: '미풀이', color: 'text-neutral-400 dark:text-neutral-500', format: (m: any) => m.unsolvedCount },
  { key: 'accuracy', label: '정답률', color: 'text-gold', format: (m: any) => `${Math.round(m.accuracy * 100)}%` },
  { key: 'incorrectRate', label: '오답률', color: 'text-red-400 dark:text-red-500', format: (m: any) => `${Math.round(m.incorrectRate * 100)}%` },
]

const { data: stats, refresh } = await useLazyFetch('/api/mypage/stats')

const resetTarget = ref<string | null>(null)
const resetting = ref(false)

function confirmReset(type: string) {
  resetTarget.value = type
}

async function doReset() {
  if (!resetTarget.value) return
  resetting.value = true
  try {
    await $fetch(`/api/mypage/progress?type=${resetTarget.value}`, { method: 'DELETE' })
    await refresh()
    resetTarget.value = null
  }
  catch {}
  finally {
    resetting.value = false
  }
}

useHead({ title: '마이페이지 — BackGSM' })
</script>
