export default defineEventHandler((event) => {
  const user = event.context.user
  if (!user) return null
  return {
    id: user.sub,
    name: user.name,
    studentNumber: user.studentNumber,
    displayName: `${user.name}(${user.studentNumber})`,
  }
})
