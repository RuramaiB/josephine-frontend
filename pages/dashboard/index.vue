<template>
  <NuxtLayout name="dashboard">
    <template #header-title>Executive Market Overview</template>

    <div class="space-y-10">
      <!-- AI Intelligence Brief (Professional Minimalist) -->
      <div class="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
        <div class="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
           <LucideBrainDeep class="w-48 h-48 text-emerald-500" />
        </div>
        
        <div class="relative z-10 flex flex-col lg:flex-row gap-10 items-center justify-between">
            <div class="flex-grow space-y-6 max-w-4xl text-center lg:text-left">
              <div class="flex items-center justify-center lg:justify-start gap-4">
                 <div class="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <LucideBrain class="w-5 h-5 text-white" />
                 </div>
                 <h2 class="text-xl font-heading font-extrabold tracking-tight uppercase tracking-[0.1em]">National Market Intelligence</h2>
                 <span class="text-[10px] font-black bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded border border-emerald-500/30 uppercase tracking-widest">Llama 3 AI</span>
              </div>
              
              <div class="min-h-[4rem] flex items-center justify-center lg:justify-start">
                <p v-if="aiInsight" class="text-lg text-slate-200 leading-relaxed font-heading font-medium italic opacity-90">
                   "{{ aiInsight }}"
                </p>
                <div v-else class="flex flex-col gap-3 w-full max-w-xl">
                   <SkeletonLoader class="h-4 w-full bg-white/5" />
                   <SkeletonLoader class="h-4 w-2/3 bg-white/10" />
                </div>
              </div>

              <div class="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest pt-2 border-t border-white/5">
                 <div class="flex items-center gap-2">
                    <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    <span>Market Stability: High</span>
                 </div>
                 <div class="flex items-center gap-2 border-l border-white/10 pl-6">
                    <LucideClock class="w-3.5 h-3.5" />
                    <span>Last Analyzed: {{ timeAgo }}</span>
                 </div>
              </div>
            </div>

            <div class="shrink-0 flex flex-col items-center gap-4">
              <button 
                @click="manualRefreshAI" 
                :disabled="refreshingAI"
                class="group relative flex flex-col items-center justify-center w-24 h-24 rounded-full border border-white/10 bg-white/5 hover:bg-emerald-600 hover:border-emerald-500 transition-all duration-500 active:scale-95 disabled:opacity-50"
              >
                <LucideRefreshCw 
                  class="w-6 h-6 text-slate-400 group-hover:text-white transition-all duration-700" 
                  :class="{ 'animate-spin': refreshingAI }" 
                />
                <span class="text-[9px] font-black mt-2 tracking-widest opacity-40 group-hover:opacity-100 uppercase">Refresh</span>
              </button>
              <div v-if="refreshingAI" class="text-[9px] font-black text-emerald-500 animate-pulse uppercase tracking-widest">Optimizing Neural Nodes...</div>
            </div>
        </div>
      </div>

      <!-- Key Performance Indicators (Executive Style) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <template v-if="statsPending">
          <SkeletonLoader v-for="i in 4" :key="i" class="h-40 rounded-3xl" />
        </template>
        <template v-else>
          <StatCard
            title="Total Commodities"
            :value="marketStats?.totalProducts || 0"
            icon="Package"
            trend="12.4"
            :isUp="true"
            color="emerald"
          />
          <StatCard
            title="Verification Nodes"
            :value="marketStats?.totalPriceRecords || 0"
            icon="ShieldCheck"
            trend="8.1"
            :isUp="true"
            color="teal"
          />
          <StatCard
            title="Consumer Price Index"
            :value="formatPrice(marketStats?.averageRefPrice)"
            icon="Coins"
            trend="2.3"
            :isUp="false"
            color="slate"
          />
          <StatCard
            title="Regional Disparity"
            :value="(marketStats?.priceDisparity || 0).toFixed(1) + '%'"
            icon="Activity"
            trend="1.5"
            :isUp="true"
            color="emerald"
          />
        </template>
      </div>

      <!-- Split Layout -->
      <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <!-- Main Analysis Column -->
        <div class="xl:col-span-8 space-y-8">
          <div class="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm overflow-hidden min-h-[400px]">
            <div class="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
                <div>
                   <h3 class="text-lg font-heading font-black text-slate-900 tracking-tight">Market Divergence Analytics</h3>
                   <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time cross-retailer pricing comparison</p>
                </div>
                <div class="flex gap-2">
                  <button class="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100 transition-all">Export Report</button>
                </div>
            </div>
            
            <div v-if="pricesPending" class="h-[300px] flex items-center justify-center">
               <LucideLoader2 class="w-10 h-10 animate-spin text-emerald-500 opacity-20" />
            </div>
            <div v-else class="h-[300px]">
               <BarChart :chart-data="priceComparison" />
            </div>
          </div>

          <div class="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm overflow-hidden">
             <div class="flex items-center justify-between mb-8">
                <div>
                   <h3 class="text-lg font-heading font-black text-slate-900 tracking-tight">Price Stability Tracker</h3>
                   <p class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">3-Month persistent inflation monitoring</p>
                </div>
                <LucideActivity class="w-6 h-6 text-emerald-500 opacity-20" />
             </div>
             
             <div v-if="stabilityPending" class="space-y-4">
               <SkeletonLoader v-for="i in 3" :key="i" class="h-20 rounded-2xl" />
             </div>
             <div v-else-if="stabilityTrends.length" class="space-y-4">
                <div v-for="item in stabilityTrends" :key="item.productId" class="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between hover:border-emerald-100 transition-all group">
                   <div class="flex items-center gap-5">
                      <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm border border-slate-200/50">
                         <LucideTrendingUp class="w-6 h-6" />
                      </div>
                      <div>
                         <div class="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{{ item.name }}</div>
                         <div class="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] mt-0.5">
                            {{ item.category }} • {{ item.hikeCount }} Hikes Detected (90 Days)
                         </div>
                      </div>
                   </div>
                   <div class="text-right">
                      <div class="text-lg font-black text-rose-600">+{{ item.totalIncreasePct.toFixed(1) }}%</div>
                      <div class="text-[8px] font-black bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full inline-block mt-1 uppercase tracking-tighter">Unstable</div>
                   </div>
                </div>
             </div>
             <div v-else class="py-12 flex flex-col items-center gap-4 text-center">
                <LucideCheckCircle2 class="w-12 h-12 text-emerald-500/20" />
                <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">No persistent price creep detected in essentials</p>
             </div>
          </div>

          <div class="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm overflow-hidden">
             <div class="flex items-center justify-between mb-8">
                <div>
                   <h3 class="text-lg font-heading font-black text-slate-900 tracking-tight">High-Risk Alerts</h3>
                   <p class="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-1">Z-Score anomalies > 2.0 (Confidence 95%+)</p>
                </div>
                <LucideAlertCircle class="w-6 h-6 text-rose-500 opacity-20" />
             </div>
             
             <div v-if="pricesPending" class="space-y-4">
               <SkeletonLoader v-for="i in 3" :key="i" class="h-20 rounded-2xl" />
             </div>
             <div v-else-if="alerts.length" class="space-y-4">
                <div v-for="item in alerts.slice(0, 5)" :key="item.id" class="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between hover:border-rose-100 transition-all group">
                   <div class="flex items-center gap-5">
                      <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-rose-500 shadow-sm border border-slate-200/50">
                         <LucideAlertTriangle class="w-6 h-6" />
                      </div>
                      <div>
                         <div class="font-bold text-slate-900 group-hover:text-rose-600 transition-colors">{{ item.name }}</div>
                         <div class="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] mt-0.5">
                            {{ item.retailer }} • {{ item.region }} • Risk Score: {{ (item.riskScore || 0).toFixed(1) }}
                         </div>
                      </div>
                   </div>
                   <div class="text-right">
                      <div class="text-lg font-black text-slate-900">{{ formatPrice(item.currentPrice, item.category) }}</div>
                      <div class="text-[8px] font-black bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full inline-block mt-1 uppercase tracking-tighter">Overpriced</div>
                   </div>
                </div>
             </div>
             <div v-else class="py-12 flex flex-col items-center gap-4 text-center">
                <LucideShieldCheck class="w-12 h-12 text-emerald-500/20" />
                <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">No critical pricing anomalies detected</p>
             </div>
          </div>
        </div>

        <!-- Right Side Stats -->
        <div class="xl:col-span-4 space-y-8">
           <!-- Regional Index Map -->
           <div class="bg-slate-900 rounded-3xl p-8 text-white min-h-[500px] flex flex-col">
              <div class="mb-10 text-center">
                <span class="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-3 block">Regional Distribution</span>
                <h3 class="text-xl font-heading font-extrabold tracking-tight">Price Index Map</h3>
              </div>
              
              <div class="flex-grow space-y-6">
                 <div v-if="statsPending" class="space-y-4">
                    <SkeletonLoader v-for="i in 5" :key="i" class="h-12 bg-white/5 rounded-xl" />
                 </div>
                 <div v-else v-for="region in regions" :key="region.name" class="relative">
                    <div class="flex items-center justify-between mb-2">
                       <span class="text-[11px] font-bold uppercase tracking-widest text-slate-400">{{ region.name }}</span>
                       <span class="text-[11px] font-black" :class="region.value > 100 ? 'text-emerald-500' : 'text-slate-200'">{{ region.value }}%</span>
                    </div>
                    <div class="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                       <div 
                         class="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                         :style="{ width: Math.min(100, region.value) + '%' }"
                       ></div>
                    </div>
                 </div>
              </div>

              <div class="mt-auto pt-10 text-center">
                 <button class="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:border-emerald-500 transition-all active:scale-95">View Regional Detail</button>
              </div>
           </div>

           <!-- Public Transparency -->
           <div class="bg-emerald-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-900/10">
              <div class="absolute -bottom-10 -right-10 opacity-10">
                 <LucideGlobe class="w-40 h-40" />
              </div>
              <div class="relative z-10 space-y-6">
                 <div>
                    <h3 class="text-lg font-heading font-black tracking-tight">Public API Access</h3>
                    <p class="text-[10px] uppercase font-bold tracking-widest text-emerald-200/60 mt-1">Transparency Node v1.4</p>
                 </div>
                 <p class="text-xs font-medium leading-relaxed opacity-80 italic">
                   "Allowing third-party developers to access real-time Zimbabwean market pricing for research and analysis."
                 </p>
                 <button class="flex items-center gap-2 group text-xs font-black uppercase tracking-[0.2em]">
                    <span>Developer Hub</span>
                    <LucideArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { 
  LucidePackage, LucideDatabase, LucideZap, LucideShieldCheck, 
  LucideFuel, LucideLoader2, LucideAlertTriangle, LucideRefreshCw,
  LucideHistory, LucideGlobe, LucideCheckCircle2, LucideBrain,
  LucideTrendingUp, LucideTrendingDown, LucideArrowRight,
  LucideAlertCircle, LucideCoins, LucideActivity, LucideSearch,
  LucideClock, LucideBrainCircuit as LucideBrainDeep
} from 'lucide-vue-next'

import { onMounted, onUnmounted, computed, ref } from 'vue'

const api = useApi()
const { formatPrice } = usePriceFormatter()

// Refs for UI state
const refreshingAI = ref(false)

// Fetch data
const { data: aiResponse, pending: aiPending, refresh: refreshAI } = useLazyAsyncData('ai-insights', () => $fetch('http://localhost:1998/api/v1/market/ai-insights'))
const { data: marketStats, pending: statsPending, refresh: refreshStats } = useLazyAsyncData('market-stats', () => $fetch('http://localhost:1998/api/v1/market/stats'))
const { data: allPrices, pending: pricesPending, refresh: refreshPrices } = useLazyAsyncData('all-prices', () => $fetch('http://localhost:1998/api/public/prices'))
const { data: regionData, refresh: refreshRegions } = useLazyAsyncData('regional-indices', () => $fetch('http://localhost:1998/api/v1/market/indices'))
const { data: stabilityTrends, pending: stabilityPending, refresh: refreshStability } = useLazyAsyncData('stability-trends', () => $fetch('http://localhost:1998/api/v1/market/stability'))

// Computed values
const aiInsight = computed(() => aiResponse.value?.insight)
const lastUpdateRaw = computed(() => aiResponse.value?.lastUpdated)
const alerts = computed(() => (allPrices.value || []).filter(p => p.alert))
const regions = computed(() => regionData.value || [])

const timeAgo = computed(() => {
  if (!lastUpdateRaw.value || lastUpdateRaw.value === 'N/A') return 'Just Now'
  const date = new Date(lastUpdateRaw.value)
  const diff = Math.floor((new Date() - date) / 60000)
  if (diff < 1) return 'Just Now'
  if (diff < 60) return `${diff}m ago`
  return `${Math.floor(diff/60)}h ago`
})

// Methods
const manualRefreshAI = async () => {
  if (refreshingAI.value) return
  refreshingAI.value = true
  try {
    await $fetch('http://localhost:1998/api/v1/market/ai-insights/refresh', { method: 'POST' })
    // Wait bit then refresh the frontend data
    setTimeout(() => {
      refreshAI()
      refreshingAI.value = false
    }, 2000)
  } catch (e) {
    console.error('Failed to refresh AI insights', e)
    refreshingAI.value = false
  }
}

// Advanced Analytics Computations
const priceComparison = computed(() => {
  if (!allPrices.value || allPrices.value.length === 0) return { labels: [], datasets: [] }
  const sums = {}
  const counts = {}
  allPrices.value.forEach(p => {
    const price = Number(p.currentPrice) || 0
    sums[p.category] = (sums[p.category] || 0) + price
    counts[p.category] = (counts[p.category] || 0) + 1
  })
  const categories = Object.keys(sums)
  return {
    labels: categories,
    datasets: [{
      label: 'Avg Price (USD)',
      data: categories.map(c => counts[c] > 0 ? sums[c] / counts[c] : 0),
      backgroundColor: '#10b981',
      borderRadius: 12
    }]
  }
})

onMounted(() => {
  const interval = setInterval(() => {
    refreshStats()
    refreshPrices()
    refreshAI()
    refreshRegions()
  }, 60000) // Slower poll for executive overview

  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>

<style scoped>
.font-heading {
  font-family: 'Outfit', sans-serif;
}
</style>
