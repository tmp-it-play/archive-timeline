import { verifySession } from '../utils/jwt'

export default defineEventHandler(async (event) => {
  const path = event.path
  // auth 라우트는 미들웨어 제외
  if (path.startsWith('/api/auth/')) return

  const cookieHeader = getCookie(event, 'backgsm_session')
  if (!cookieHeader) {
    event.context.user = null
    return
  }

  const payload = await verifySession(cookieHeader)
  event.context.user = payload ?? null
})
