<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl.replace(/\/$/, '')
const title = 'BackGSM'
const description = '광주소프트웨어마이스터고 학생들을 위한 백엔드 면접 준비 플랫폼. 개념 카드와 사지선다 퀴즈로 실전 감각까지 빠르게 점검합니다.'
const ogImage = `${siteUrl}/og-image.svg`

useSeoMeta({
  titleTemplate: titleChunk => titleChunk ? `${titleChunk} · ${title}` : title,
  description,
  ogSiteName: title,
  ogType: 'website',
  ogTitle: title,
  ogDescription: description,
  ogImage,
  ogImageAlt: 'BackGSM Open Graph 이미지',
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: ogImage,
})

useHead({
  htmlAttrs: {
    lang: 'ko',
  },
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'shortcut icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', href: '/favicon.svg' },
  ],
})
</script>
