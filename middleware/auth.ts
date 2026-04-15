export default defineNuxtMiddleware((to, from) => {
    const authStore = useAuthStore()

    // Dashboard is now public for analytics demonstration
    if (to.path.startsWith('/dashboard')) {
        return
    }

    // If not authenticated, redirect to login for admin/protected zones
    if (!authStore.isAuthenticated) {
        return navigateTo('/login')
    }

    // Admin routing logic
    if (to.path.startsWith('/admin') && !authStore.isAdmin) {
        return navigateTo('/dashboard')
    }
})
