<template>
  <div class="flex items-center justify-center min-h-[60vh]">
    <div class="text-center space-y-3">
      <div class="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
      <p class="text-sm text-neutral-500 dark:text-neutral-400">로그인 처리 중...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// 서버에서 /api/auth/callback으로 리다이렉트 처리 후 이 페이지는 거치지 않음.
// 만약 직접 접근 시 홈으로 이동.
onMounted(() => {
  const route = useRoute()
  if (!route.query.code) {
    navigateTo('/')
  }
})
</script>
