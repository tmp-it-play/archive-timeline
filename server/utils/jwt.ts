import { SignJWT, jwtVerify } from 'jose'

export interface SessionPayload {
  sub: string       // users.id (uuid)
  name: string
  studentNumber: number
}

function getKey() {
  const config = useRuntimeConfig()
  return new TextEncoder().encode(config.sessionSecret)
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(getKey())
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getKey())
    return payload as unknown as SessionPayload
  }
  catch {
    return null
  }
}
