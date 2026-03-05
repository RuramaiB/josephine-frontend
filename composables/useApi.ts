export const useApi = () => {
    const config = useRuntimeConfig()

    // Base URL for the backend
    const baseURL = 'http://localhost:1998/api/v1'

    const call = async (url: string, options: any = {}) => {
        const authStore = useAuthStore()
        const headers = {
            ...options.headers,
            Authorization: authStore.token ? `Bearer ${authStore.token}` : undefined
        }

        try {
            return await $fetch(url, {
                baseURL,
                ...options,
                headers
            })
        } catch (error: any) {
            if (error.response?.status === 401) {
                authStore.logout()
            }
            throw error
        }
    }

    return {
        call,
        // Authentication
        login: (credentials: any) => call('/auth/authenticate', { method: 'POST', body: credentials }),
        register: (user: any) => call('/auth/register', { method: 'POST', body: user }),

        // Gwatidzo Market Data
        getMarketProducts: (category: string) => call(`/market/products?category=${category}`),
        getPriceHistory: (productId: string) => call(`/market/price-history/${productId}`),
        getMarketStats: () => call('/market/stats'),
        getHighMargins: () => call('/market/high-margins'),
        getDataSources: () => call('/market/sources'),
        reportPrice: (data: any) => call('/market/report', { method: 'POST', params: data }),
        getRegionalIndices: () => call('/market/indices'),
        updateFuel: (data: any) => call('/market/fuel/update', { method: 'POST', params: data }),

        // Admin User Management
        getUsers: () => call('/admin/users'),
        updateUserRole: (email: string, role: string) => call(`/admin/users/${email}/role`, { method: 'PATCH', body: { role } }),
        updateUserDetails: (email: string, userData: any) => call(`/admin/users/${email}`, { method: 'PUT', body: userData }),
        createTempUser: (userData: any) => call('/admin/users/temporary', { method: 'POST', body: userData }),
        triggerScrape: () => call('/admin/scraper/trigger', { method: 'POST' }),

        // Legacy/Core
        getPredictions: (productId: string) => call(`/ml/predict/${productId}`)
    }
}
