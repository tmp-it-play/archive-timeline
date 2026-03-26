// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
  ],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',
  runtimeConfig: {
    oauthClientId: process.env.NUXT_OAUTH_CLIENT_ID ?? '',
    oauthClientSecret: process.env.NUXT_OAUTH_CLIENT_SECRET ?? '',
    oauthRedirectUri: process.env.NUXT_OAUTH_REDIRECT_URI ?? 'http://localhost:3000/api/auth/callback',
    sessionSecret: process.env.NUXT_SESSION_SECRET ?? '',
    databaseUrl: process.env.DATABASE_URL ?? '',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL ?? 'https://backgsm.vercel.app',
    },
  },
  nitro: {
    experimental: {
      wasm: false,
    },
  },
})
