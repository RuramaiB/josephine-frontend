<template>
  <NuxtLayout name="dashboard">
    <template #header-title>User Profile</template>

    <div class="animate-in space-y-8 max-w-4xl">
      <div class="glass-morphism rounded-[2.5rem] p-10 border-emerald-100/20">
        <div class="flex flex-col md:flex-row gap-10 items-center md:items-start">
          <div class="w-32 h-32 rounded-full bg-emerald-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-emerald-500/20 border-4 border-white">
            {{ authStore.user?.email?.[0]?.toUpperCase() }}
          </div>
          
          <div class="flex-grow space-y-6 text-center md:text-left">
            <div>
              <h2 class="text-3xl font-heading font-extrabold text-slate-900 tracking-tight">{{ authStore.user?.email }}</h2>
              <p class="text-sm font-bold text-emerald-600 uppercase tracking-[0.2em] mt-1">{{ authStore.user?.role }} Protocol</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
               <div class="space-y-1">
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Status</span>
                  <p class="text-sm font-bold text-slate-900 flex items-center gap-2 justify-center md:justify-start">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Authorized & Active
                  </p>
               </div>
               <div class="space-y-1">
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Member Since</span>
                  <p class="text-sm font-bold text-slate-900">February 2026</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div class="glass-morphism rounded-[2.5rem] p-10 border-emerald-100/20 hover:bg-emerald-50/20 transition-colors">
            <LucideShield class="w-8 h-8 text-emerald-600 mb-6" />
            <h3 class="text-lg font-bold text-slate-900 mb-2">Security Credentials</h3>
            <p class="text-slate-500 text-sm leading-relaxed mb-6">Manage your password and two-factor authentication settings to keep your account secure.</p>
            <button class="text-xs font-bold text-emerald-600 hover:emerald-700 underline underline-offset-4 tracking-widest uppercase">Update Security</button>
         </div>
         <div class="glass-morphism rounded-[2.5rem] p-10 border-emerald-100/20 hover:bg-slate-50 transition-colors">
            <LucideBell class="w-8 h-8 text-slate-400 mb-6" />
            <h3 class="text-lg font-bold text-slate-900 mb-2">Notification Preferences</h3>
            <p class="text-slate-500 text-sm leading-relaxed mb-6">Configure how and when you receive alerts regarding price anomalies and system updates.</p>
            <button class="text-xs font-bold text-slate-400 hover:text-slate-600 underline underline-offset-4 tracking-widest uppercase">Manage Alerts</button>
         </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { LucideShield, LucideBell } from 'lucide-vue-next'
const authStore = useAuthStore()
</script>

<style scoped>
.animate-in {
  animation: animate-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes animate-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
