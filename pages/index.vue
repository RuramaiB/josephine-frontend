<template>
  <div>
    <!-- Hero Section -->
    <section class="relative pt-32 pb-20 overflow-hidden bg-white">
      <div class="max-w-7xl mx-auto px-6 relative text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold tracking-widest uppercase mb-8 animate-in">
          Zimbabwe's Live Price Index 2026
        </div>

        <h1 class="text-6xl md:text-7xl font-heading font-extrabold text-slate-900 tracking-tighter leading-[1.1] mb-8 animate-in">
          The Transparency <span class="text-gradient">Zimbabwe</span> <br />
          Deserves for Pricing.
        </h1>

        <p class="max-w-2xl mx-auto text-lg text-slate-500 leading-relaxed mb-12 animate-in [animation-delay:200ms]">
          Real-time aggregation of commodity prices from retail giants, energy regulators, and grain boards. Combating overpricing with statistical transparency.
        </p>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-16 animate-in [animation-delay:300ms]">
          <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div class="text-3xl font-bold text-slate-900 mb-1">{{ stats?.totalRecords || 0 }}</div>
            <div class="text-xs font-bold text-slate-400 uppercase tracking-widest">Price Points</div>
          </div>
          <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div class="text-3xl font-bold text-slate-900 mb-1">{{ stats?.sourcesCount || 0 }}</div>
            <div class="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Sources</div>
          </div>
          <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div class="text-3xl font-bold text-emerald-600 mb-1">{{ stats?.activeAlerts || 0 }}</div>
            <div class="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Alerts</div>
          </div>
          <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div class="text-3xl font-bold text-slate-900 mb-1">{{ Math.round(stats?.averageMarketRisk || 0) }}%</div>
            <div class="text-xs font-bold text-slate-400 uppercase tracking-widest">Risk Score</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Comparison Hub Teaser -->
    <section class="py-12 bg-slate-50">
       <div class="max-w-7xl mx-auto px-6">
          <div class="bg-emerald-600 rounded-[2.5rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-emerald-200">
             <div class="absolute -right-20 -bottom-20 opacity-10">
                <LucideArrowLeftRight class="w-80 h-80" />
             </div>
             <div class="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div class="space-y-6">
                   <h2 class="text-4xl font-heading font-black tracking-tight">Cross-Retailer <br />Comparison Hub</h2>
                   <p class="text-emerald-100 text-lg">Select any two data sources (e.g. TM vs Pick n Pay) and instantly compare pricing for identical commodity nodes.</p>
                   <NuxtLink to="/compare" class="inline-flex items-center gap-3 bg-white text-emerald-600 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all">
                      Launch Comparison Tool
                      <LucideArrowLeftRight class="w-4 h-4" />
                   </NuxtLink>
                </div>
                <div class="hidden md:block">
                   <div class="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                      <div class="space-y-4 opacity-50">
                         <div class="h-4 w-3/4 bg-white/20 rounded-full"></div>
                         <div class="h-4 w-1/2 bg-white/20 rounded-full"></div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { LucideArrowLeftRight } from 'lucide-vue-next'

const stats = ref({
  totalRecords: 0,
  activeAlerts: 0,
  averageMarketRisk: 0,
  sourcesCount: 0
})

const fetchStats = async () => {
  try {
    const res = await fetch('http://localhost:1998/api/public/stats')
    stats.value = await res.json()
  } catch (e) {
     console.error('Failed to fetch stats', e)
  }
}

let interval;
onMounted(async () => {
  await fetchStats()

  // Refresh data every 30 seconds
  interval = setInterval(async () => {
    await fetchStats()
  }, 30000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>
