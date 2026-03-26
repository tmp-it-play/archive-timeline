export default defineEventHandler((event) => {
  deleteCookie(event, 'backgsm_session', { path: '/' })
  return { success: true }
})
