import { randomBytes, createHash } from 'node:crypto'

function base64url(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // PKCE code_verifier 생성 (43~128자 랜덤)
  const codeVerifier = base64url(randomBytes(64))

  // code_challenge = BASE64URL(SHA256(code_verifier))
  const codeChallenge = base64url(
    Buffer.from(createHash('sha256').update(codeVerifier).digest()),
  )

  // CSRF 방어용 state
  const state = base64url(randomBytes(16))

  // 임시 쿠키 저장 (10분)
  setCookie(event, 'pkce_verifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  })
  setCookie(event, 'oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  })

  const params = new URLSearchParams({
    client_id: config.oauthClientId,
    redirect_uri: config.oauthRedirectUri,
    response_type: 'code',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  })

  return sendRedirect(
    event,
    `https://oauth.data.hellogsm.kr/v1/oauth/authorize?${params.toString()}`,
    302,
  )
})
