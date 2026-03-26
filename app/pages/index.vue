<template>
  <div class="space-y-16">
    <!-- Hero -->
    <section class="pt-8 pb-4">
      <div class="max-w-2xl">
        <p class="text-xs font-mono text-gold uppercase tracking-[0.2em] mb-4">Backend Interview Prep</p>
        <h1 class="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.15] mb-6">
          면접, 개념부터<br>실전까지.
        </h1>
        <p class="text-neutral-500 dark:text-neutral-400 text-lg leading-relaxed">
          백엔드 개발자 면접에서 자주 나오는 개념과 문제를 모았습니다.<br class="hidden sm:block">
          개념 카드로 이해하고, 사지선다로 실력을 검증하세요.
        </p>
      </div>
    </section>

    <!-- Mode cards -->
    <section class="grid sm:grid-cols-2 gap-4">
      <!-- MCQ card -->
      <NuxtLink
        to="/quiz/mcq"
        class="group p-8 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-neutral-400 dark:hover:border-neutral-600 transition-all hover:shadow-sm"
      >
        <div class="flex items-start justify-between mb-6">
          <span class="text-2xl font-mono font-bold text-gold">01</span>
          <span class="text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-400 dark:group-hover:text-neutral-500 transition-colors">→</span>
        </div>
        <h2 class="text-xl font-semibold mb-2">사지선다 모드</h2>
        <p class="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
          실전 면접처럼 4지선다 문제를 풀고<br>랭킹에 도전하세요.
        </p>
        <div class="mt-6 flex flex-wrap gap-1.5">
          <span class="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-500 dark:text-neutral-400">랭킹 시스템</span>
          <span class="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-500 dark:text-neutral-400">문제 수 조절</span>
          <span class="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-500 dark:text-neutral-400">즉시 해설</span>
        </div>
      </NuxtLink>

      <!-- Concept card -->
      <NuxtLink
        to="/quiz/concept"
        class="group p-8 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-neutral-400 dark:hover:border-neutral-600 transition-all hover:shadow-sm"
      >
        <div class="flex items-start justify-between mb-6">
          <span class="text-2xl font-mono font-bold text-gold">02</span>
          <span class="text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-400 dark:group-hover:text-neutral-500 transition-colors">→</span>
        </div>
        <h2 class="text-xl font-semibold mb-2">개념·해설 모드</h2>
        <p class="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
          카드를 뒤집어 개념을 확인하고<br>깊이 있는 해설로 이해를 다지세요.
        </p>
        <div class="mt-6 flex flex-wrap gap-1.5">
          <span class="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-500 dark:text-neutral-400">카드 플립</span>
          <span class="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-500 dark:text-neutral-400">마크다운 해설</span>
          <span class="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-neutral-500 dark:text-neutral-400">열람 기록</span>
        </div>
      </NuxtLink>
    </section>

    <!-- Categories overview -->
    <section>
      <p class="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-widest mb-5">수록 분야</p>
      <div class="flex flex-wrap gap-2">
        <UiCategoryBadge v-for="cat in CATEGORIES" :key="cat" :category="cat" />
      </div>
    </section>

    <!-- Login CTA (비로그인 시) -->
    <section v-if="!isLoggedIn" class="border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl p-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 class="font-semibold mb-1">더 많은 기능이 필요하신가요?</h3>
          <p class="text-sm text-neutral-500 dark:text-neutral-400">
            DataGSM 계정으로 로그인하면 랭킹, 중복방지, 진도 관리를 이용할 수 있습니다.
          </p>
        </div>
        <button
          class="shrink-0 px-5 py-2.5 bg-ink-light dark:bg-ink-dark text-surface-light dark:text-surface-dark rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
          @click="login"
        >
          DataGSM 로그인
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const CATEGORIES = ['network', 'os', 'db', 'java', 'typescript', 'data_structure', 'cloud_devops']

const { isLoggedIn, login } = useAuth()

useHead({ title: 'BackGSM — 백엔드 면접 준비' })
</script>
