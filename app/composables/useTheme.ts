export const useTheme = () => {
  const isDark = useState<boolean>('theme:dark', () => false)

  const initTheme = () => {
    if (import.meta.client) {
      const stored = localStorage.getItem('backgsm-theme')
      isDark.value = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)
      applyTheme()
    }
  }

  const applyTheme = () => {
    if (import.meta.client) {
      if (isDark.value) {
        document.documentElement.classList.add('dark')
      }
      else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  const toggle = () => {
    isDark.value = !isDark.value
    if (import.meta.client) {
      localStorage.setItem('backgsm-theme', isDark.value ? 'dark' : 'light')
    }
    applyTheme()
  }

  return { isDark, initTheme, toggle }
}
