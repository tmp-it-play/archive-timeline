export interface AuthUser {
  id: string
  name: string
  studentNumber: number
  displayName: string
}

export const useAuth = () => {
  const user = useState<AuthUser | null>('auth:user', () => null)
  const loading = useState<boolean>('auth:loading', () => false)

  const fetchUser = async () => {
    loading.value = true
    try {
      const data = await $fetch<AuthUser | null>('/api/auth/me')
      user.value = data
    }
    catch {
      user.value = null
    }
    finally {
      loading.value = false
    }
  }

  const logout = async () => {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    await navigateTo('/')
  }

  const login = () => {
    window.location.href = '/api/auth/login'
  }

  const isLoggedIn = computed(() => !!user.value)

  return { user, loading, isLoggedIn, fetchUser, login, logout }
}
