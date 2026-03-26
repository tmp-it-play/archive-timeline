<template>
  <div class="text-center py-24 space-y-4">
    <p class="text-6xl font-mono font-bold text-gold">404</p>
    <h1 class="text-2xl font-semibold">페이지를 찾을 수 없습니다</h1>
    <p class="text-neutral-500 dark:text-neutral-400 text-sm">요청하신 페이지가 존재하지 않습니다.</p>
    <NuxtLink
      to="/"
      class="inline-block mt-4 px-6 py-3 bg-ink-light dark:bg-ink-dark text-surface-light dark:text-surface-dark rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
    >
      홈으로 돌아가기
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
useHead({ title: '404 — BackGSM' })
</script>
