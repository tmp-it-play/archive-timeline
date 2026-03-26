import { verifySession } from '../utils/jwt'

export default defineEventHandler(async (event) => {
  const path = event.path
  // OAuth 플로우 전용 라우트만 제외 (/api/auth/me는 세션 검증 필요)
  if (path === '/api/auth/login' || path === '/api/auth/callback' || path === '/api/auth/logout') return

  const cookieHeader = getCookie(event, 'backgsm_session')
  if (!cookieHeader) {
    event.context.user = null
    return
  }

  const payload = await verifySession(cookieHeader)
  event.context.user = payload ?? null
})
