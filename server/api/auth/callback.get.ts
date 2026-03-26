import { getDb, schema } from '../../db'
import { signSession } from '../../utils/jwt'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const code = query.code as string
  const state = query.state as string

  // CSRF 검증
  const savedState = getCookie(event, 'oauth_state')
  if (!savedState || savedState !== state) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid state parameter' })
  }

  const codeVerifier = getCookie(event, 'pkce_verifier')
  if (!codeVerifier) {
    throw createError({ statusCode: 400, statusMessage: 'Missing code verifier' })
  }

  // 임시 쿠키 삭제
  deleteCookie(event, 'oauth_state')
  deleteCookie(event, 'pkce_verifier')

  // 토큰 교환
  const tokenRes = await $fetch<{
    access_token: string
    refresh_token: string
    token_type: string
    expires_in: number
  }>('https://oauth.data.hellogsm.kr/v1/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      grant_type: 'authorization_code',
      code,
      client_id: config.oauthClientId,
      redirect_uri: config.oauthRedirectUri,
      code_verifier: codeVerifier,
    },
  }).catch(() => {
    throw createError({ statusCode: 401, statusMessage: 'Token exchange failed' })
  })

  // 유저 정보 조회
  const userinfo = await $fetch<{
    id: number
    email: string
    role: string
    isStudent: boolean
    student: {
      id: number
      name: string
      studentNumber: number
      grade: number
      classNum: number
      number: number
      major: string
      isLeaveSchool: boolean
    } | null
  }>('https://oauth-userinfo.data.hellogsm.kr/userinfo', {
    headers: { Authorization: `Bearer ${tokenRes.access_token}` },
  }).catch(() => {
    throw createError({ statusCode: 401, statusMessage: 'Failed to fetch user info' })
  })

  if (!userinfo.isStudent || !userinfo.student) {
    throw createError({ statusCode: 403, statusMessage: '학생만 이용할 수 있습니다.' })
  }

  const { name, studentNumber } = userinfo.student
  const datagsmId = userinfo.id

  // DB upsert
  const db = getDb()
  const [user] = await db
    .insert(schema.users)
    .values({ datagsmId, studentNumber, name })
    .onConflictDoUpdate({
      target: schema.users.datagsmId,
      set: { name, studentNumber, updatedAt: new Date() },
    })
    .returning()

  // BackGSM 세션 JWT 발급
  const token = await signSession({ sub: user.id, name, studentNumber })

  setCookie(event, 'backgsm_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30일
    path: '/',
  })

  return sendRedirect(event, '/', 302)
})
