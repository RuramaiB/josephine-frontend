import { defineStore } from 'pinia'

interface User {
    email: string
    role: 'ADMIN' | 'USER' | 'OFFICER' | 'MANAGER'
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        token: null as string | null,
        loading: false,
        error: null as string | null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.role === 'ADMIN',
        isAdminOrManager: (state) => state.user?.role === 'ADMIN' || state.user?.role === 'MANAGER',
    },

    actions: {
        async login(email: string, password: string) {
            const api = useApi()
            this.loading = true
            this.error = null
            try {
                const response = await api.call('/auth/authenticate', {
                    method: 'POST',
                    body: { email, password }
                }) as any

                this.token = response.access_token
                this.user = {
                    email: response.email,
                    role: response.role
                }

                navigateTo('/dashboard')
            } catch (err: any) {
                this.error = err.data?.message || 'Authentication failed'
                throw err
            } finally {
                this.loading = false
            }
        },

        async register(userData: any) {
            const api = useApi()
            this.loading = true
            this.error = null
            try {
                const response = await api.call('/auth/register', {
                    method: 'POST',
                    body: userData
                }) as any

                this.token = response.access_token
                this.user = {
                    email: response.email,
                    role: response.role
                }

                navigateTo('/dashboard')
            } catch (err: any) {
                this.error = err.data?.message || 'Registration failed'
                throw err
            } finally {
                this.loading = false
            }
        },

        logout() {
            this.user = null
            this.token = null
            navigateTo('/')
        }
    },
    persist: true
})
