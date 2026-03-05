export default defineNuxtMiddleware((to, from) => {
    const authStore = useAuthStore()

    // If not authenticated, redirect to login
    if (!authStore.isAuthenticated) {
        return navigateTo('/login')
    }

    // Admin routing logic
    if (to.path.startsWith('/admin') && !authStore.isAdmin) {
        return navigateTo('/dashboard')
    }
})
