<template>
  <NuxtLayout name="dashboard">
    <template #header-title>Data Source Map</template>

    <div class="animate-in space-y-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="source in sourceList" :key="source.name" 
             class="glass-morphism rounded-[2.5rem] p-10 border border-slate-200 bg-white hover:border-emerald-500 transition-all group">
          <div class="flex items-center justify-between mb-8">
             <div class="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-emerald-600 font-black text-xs ring-4 ring-emerald-50/50 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                {{ source.name.charAt(0) }}
             </div>
             <span 
               class="text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest"
               :class="source.verified ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'"
             >
               {{ source.verified ? 'Verified' : 'Active' }}
             </span>
          </div>
          <h3 class="text-xl font-heading font-black text-slate-900 mb-2">{{ source.name }}</h3>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">{{ source.region }} Node</p>
          
          <div class="flex items-center gap-4 pt-6 border-t border-slate-50">
             <div>
                <div class="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Trust Index</div>
                <div class="text-md font-black text-slate-900">{{ source.trust }}%</div>
             </div>
             <div class="ml-auto text-right">
                <div class="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Latency</div>
                <div class="text-md font-black text-emerald-500">{{ source.latency }}ms</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
const sourceList = [
  { name: 'ZERA National Hub', region: 'Harare', verified: true, trust: 99.9, latency: 45 },
  { name: 'OK Zimbabwe Ltd', region: 'Bulawayo', verified: true, trust: 98.5, latency: 120 },
  { name: 'TM Pick n Pay', region: 'Mutare', verified: true, trust: 98.2, latency: 135 },
  { name: 'Spar Central', region: 'Gweru', verified: false, trust: 92.0, latency: 250 },
  { name: 'Grain Marketing Board', region: 'National', verified: true, trust: 99.8, latency: 60 },
  { name: 'Gain Cash & Carry', region: 'Masvingo', verified: true, trust: 95.4, latency: 180 }
]
</script>

<style scoped>
.animate-in {
  animation: animate-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes animate-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.glass-morphism {
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.7);
}
</style>
