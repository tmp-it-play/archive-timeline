<template>
  <div class="min-h-screen bg-surface-light dark:bg-surface-dark text-ink-light dark:text-ink-dark transition-colors duration-200">
    <!-- Header -->
    <header class="border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-50 bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-sm">
      <div class="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="text-lg font-semibold tracking-tight hover:text-gold transition-colors">
          BackGSM
        </NuxtLink>

        <!-- Nav -->
        <nav class="hidden sm:flex items-center gap-6 text-sm text-neutral-500 dark:text-neutral-400">
          <NuxtLink to="/" class="hover:text-ink-light dark:hover:text-ink-dark transition-colors" active-class="text-ink-light dark:text-ink-dark font-medium">
            홈
          </NuxtLink>
          <NuxtLink to="/quiz/mcq" class="hover:text-ink-light dark:hover:text-ink-dark transition-colors" active-class="text-ink-light dark:text-ink-dark font-medium">
            사지선다
          </NuxtLink>
          <NuxtLink to="/quiz/concept" class="hover:text-ink-light dark:hover:text-ink-dark transition-colors" active-class="text-ink-light dark:text-ink-dark font-medium">
            개념·해설
          </NuxtLink>
          <NuxtLink to="/rankings" class="hover:text-ink-light dark:hover:text-ink-dark transition-colors" active-class="text-ink-light dark:text-ink-dark font-medium">
            랭킹
          </NuxtLink>
          <NuxtLink v-if="isLoggedIn" to="/mypage" class="hover:text-ink-light dark:hover:text-ink-dark transition-colors" active-class="text-ink-light dark:text-ink-dark font-medium">
            마이페이지
          </NuxtLink>
        </nav>

        <!-- Right actions -->
        <div class="flex items-center gap-3">
          <!-- Theme toggle -->
          <button
            class="w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500 dark:text-neutral-400"
            :aria-label="isDark ? '라이트 모드' : '다크 모드'"
            @click="toggle"
          >
            <span v-if="isDark" class="text-base">☀</span>
            <span v-else class="text-base">◑</span>
          </button>

          <!-- Auth -->
          <template v-if="isLoggedIn">
            <span class="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:block">{{ user?.displayName }}</span>
            <button
              class="text-xs px-3 py-1.5 border border-neutral-200 dark:border-neutral-700 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              @click="logout"
            >
              로그아웃
            </button>
          </template>
          <template v-else>
            <button
              class="text-xs px-3 py-1.5 bg-ink-light dark:bg-ink-dark text-surface-light dark:text-surface-dark rounded-md hover:opacity-80 transition-opacity"
              @click="login"
            >
              DataGSM 로그인
            </button>
          </template>
        </div>
      </div>
    </header>

    <!-- Main -->
    <main class="max-w-5xl mx-auto px-6 py-10">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { user, isLoggedIn, fetchUser, login, logout } = useAuth()
const { isDark, initTheme, toggle } = useTheme()

onMounted(async () => {
  initTheme()
  await fetchUser()
})
</script>
