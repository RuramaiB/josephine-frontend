<template>
  <NuxtLayout name="dashboard">
    <template #header-title>System Settings</template>

    <div class="animate-in space-y-10 max-w-4xl">
      <div class="glass-morphism rounded-[2.5rem] p-10 border-emerald-100/20 bg-white">
        <h2 class="text-2xl font-heading font-extrabold text-slate-900 tracking-tight mb-8">Interface & Experience</h2>
        
        <div class="space-y-8">
           <div class="flex items-center justify-between py-4 border-b border-slate-50">
              <div>
                 <p class="text-sm font-bold text-slate-900">High Contrast Mode</p>
                 <p class="text-xs text-slate-500 mt-1">Enhance visibility for critical market data charts.</p>
              </div>
              <div class="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer group">
                 <div class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all group-hover:scale-110"></div>
              </div>
           </div>

           <div class="flex items-center justify-between py-4 border-b border-slate-50">
              <div>
                 <p class="text-sm font-bold text-slate-900">Real-time Stream</p>
                 <p class="text-xs text-slate-500 mt-1">Toggle live WebSocket updates for price tracking.</p>
              </div>
              <div class="w-12 h-6 bg-emerald-600 rounded-full relative cursor-pointer">
                 <div class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
           </div>
        </div>
      </div>

      <div class="glass-morphism rounded-[2.5rem] p-10 border-emerald-100/20 bg-slate-900 text-white">
        <h2 class="text-2xl font-heading font-extrabold tracking-tight mb-8">ML Model Configuration</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div class="space-y-4">
              <p class="text-xs font-bold text-emerald-500 uppercase tracking-widest">Sensitivity Threshold</p>
              <div class="h-2 bg-white/10 rounded-full overflow-hidden">
                 <div class="h-full bg-emerald-500 w-[75%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              </div>
              <p class="text-[10px] text-slate-400 italic">Determines the threshold for anomaly detection alerts.</p>
           </div>
           <div class="space-y-4">
              <p class="text-xs font-bold text-emerald-500 uppercase tracking-widest">Projection Depth</p>
              <div class="h-2 bg-white/10 rounded-full overflow-hidden">
                 <div class="h-full bg-emerald-500 w-[40%] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              </div>
              <p class="text-[10px] text-slate-400 italic">Configures look-ahead window for price prediction.</p>
           </div>
        </div>
        <button class="mt-10 px-8 py-3 bg-white text-slate-900 rounded-xl text-xs font-bold tracking-widest hover:bg-emerald-50 transition-all active:scale-95">
           Apply Model Parameters
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
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
