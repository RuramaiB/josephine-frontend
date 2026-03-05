<template>
  <NuxtLayout name="dashboard">
    <template #header-title>User Protocol Management</template>

    <div class="animate-in space-y-10">
      <!-- Top Actions -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h2 class="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">Active Directory</h2>
           <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Global Authorization Registry</p>
        </div>
        <button class="bg-slate-900 text-white px-8 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2">
          <LucideUserPlus class="w-5 h-5" /> Provision New Protocol
        </button>
      </div>

      <!-- User List -->
      <div class="glass-morphism rounded-[2.5rem] border-emerald-100/20 shadow-2xl shadow-emerald-900/5 bg-white overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-100 px-8">
                <th v-for="col in ['Protocol Identity', 'Access Level', 'System Status', 'Last Activity', 'Actions']" :key="col" class="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{{ col }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="i in 5" :key="i" class="group hover:bg-emerald-50/30 transition-colors">
                <td class="px-8 py-6">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center font-bold text-slate-900 group-hover:bg-emerald-100 transition-colors">
                      {{ ['A', 'M', 'O', 'R', 'J'][i-1] }}
                    </div>
                    <div>
                      <div class="text-sm font-bold text-slate-900">{{ ['Admin User', 'Manager Alpha', 'Officer Beta', 'Researcher Gamma', 'Josephine Core'][i-1] }}</div>
                      <div class="text-xs text-slate-400">{{ ['admin', 'manager', 'officer', 'user', 'system'][i-1] }}@josephine.com</div>
                    </div>
                  </div>
                </td>
                <td class="px-8 py-6">
                   <div class="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest">
                      {{ ['ADMIN', 'MANAGER', 'OFFICER', 'MANAGER', 'ADMIN'][i-1] }}
                   </div>
                </td>
                <td class="px-8 py-6">
                   <div class="flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                      <span class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Authorized</span>
                   </div>
                </td>
                <td class="px-8 py-6">
                   <span class="text-xs font-medium text-slate-500">{{ i }} HOUR{{ i > 1 ? 'S' : '' }} AGO</span>
                </td>
                <td class="px-8 py-6 text-right">
                  <div class="flex items-center gap-2 justify-end">
                     <button class="p-2 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl text-slate-400 transition-all active:scale-90">
                       <LucideShield class="w-5 h-5" />
                     </button>
                     <button class="p-2 hover:bg-rose-50 hover:text-rose-600 rounded-xl text-slate-400 transition-all active:scale-90">
                       <LucideTrash2 class="w-5 h-5" />
                     </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- System Stats Info -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div class="p-8 bg-slate-900 rounded-[2.5rem] text-white flex gap-6 items-center border border-white/5">
            <div class="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center shrink-0">
               <LucideLock class="w-8 h-8 text-emerald-500" />
            </div>
            <div>
               <h3 class="text-lg font-bold">Security Standard Protocol</h3>
               <p class="text-slate-400 text-sm leading-relaxed">All administrative actions are logged with AES-256 encryption and biometric verification hash.</p>
            </div>
         </div>
         <div class="p-8 bg-emerald-600 rounded-[2.5rem] text-white flex gap-6 items-center shadow-2xl shadow-emerald-900/20">
            <div class="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
               <LucideActivity class="w-8 h-8 text-white" />
            </div>
            <div>
               <h3 class="text-lg font-bold">Real-time Session Monitoring</h3>
               <p class="text-emerald-50/70 text-sm leading-relaxed">Active protocols are continuously monitored for unauthorized behavioral patterns.</p>
            </div>
         </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { UserPlus, Shield, Trash2, Lock, Activity } from 'lucide-vue-next'
</script>
