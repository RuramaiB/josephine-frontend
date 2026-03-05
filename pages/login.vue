<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden selection:bg-emerald-100 selection:text-emerald-900">
    <!-- Decorative Elements -->
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100 rounded-full blur-[120px] opacity-50"></div>
      <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-100 rounded-full blur-[120px] opacity-50"></div>
    </div>

    <div class="w-full max-w-md relative animate-in">
      <div class="text-center mb-10">
        <NuxtLink to="/" class="inline-flex items-center gap-2 mb-6 group">
          <div class="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20 group-hover:scale-110 transition-transform">
            <LucideZap class="w-7 h-7 text-white" />
          </div>
        </NuxtLink>
        <h1 class="text-4xl font-heading font-extrabold text-slate-900 tracking-tight mb-2">GPIS Login</h1>
        <p class="text-slate-500 font-medium">Access Gwatidzo Price Index System</p>
      </div>

      <div class="glass-morphism rounded-[2.5rem] p-10 border-white/40 shadow-2xl relative">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Email Address</label>
            <div class="relative group">
              <LucideMail class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
              <input
                v-model="email"
                type="email"
                required
                placeholder="admin@gwatidzo.co.zw"
                class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Password</label>
            <div class="relative group">
              <LucideLock class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
              <input
                v-model="password"
                type="password"
                required
                placeholder="••••••••"
                class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div v-if="authStore.error" class="bg-red-50 text-red-600 text-xs font-bold p-4 rounded-xl border border-red-100 flex items-center gap-3">
             <LucideAlertCircle class="w-4 h-4 shrink-0" />
             {{ authStore.error }}
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full btn-primary"
          >
            <LucideLoader2 v-if="authStore.loading" class="w-5 h-5 animate-spin mr-2" />
            {{ authStore.loading ? 'Logging in...' : 'Login to GPIS' }}
          </button>
        </form>

        <div class="mt-8 text-center px-4">
          <p class="text-sm text-slate-500 font-medium">
             First time here? <NuxtLink to="/register" class="text-emerald-600 font-bold hover:underline">Create Account</NuxtLink>
          </p>
        </div>
      </div>

      <div class="mt-8 text-center animate-in [animation-delay:200ms]">
        <NuxtLink to="/" class="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center gap-2">
           <LucideArrowLeft class="w-4 h-4" /> Back to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LucideZap, LucideMail, LucideLock, LucideLoader2, LucideAlertCircle, LucideArrowLeft } from 'lucide-vue-next'

const email = ref('')
const password = ref('')
const authStore = useAuthStore()

const handleLogin = async () => {
  try {
    await authStore.login(email.value, password.value)
  } catch (err) {
    // Error handled by store
  }
}
</script>

<style scoped>
.animate-in {
  animation: animate-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes animate-in {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
