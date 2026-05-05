<template>
  <div class="min-h-screen bg-slate-50 py-20 px-6">
    <div class="max-w-7xl mx-auto space-y-12">
      <div class="mb-8">
        <h1 class="text-3xl font-heading font-black text-slate-900 tracking-tight">Executive Market Overview</h1>
        <p class="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time National Intelligence</p>
      </div>

      <div class="space-y-10">
        <!-- AI Intelligence Brief -->
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

        <!-- KPI Cards -->
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
          <div class="xl:col-span-8 space-y-8">
            <!-- <div class="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm min-h-[400px]">
              <div class="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
                  <div>
                     <h3 class="text-lg font-heading font-black text-slate-900 tracking-tight">Market Divergence Analytics</h3>
                     <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time cross-retailer pricing comparison</p>
                  </div>
              </div>
              <div v-if="pricesPending" class="h-[300px] flex items-center justify-center">
                 <LucideLoader2 class="w-10 h-10 animate-spin text-emerald-500 opacity-20" />
              </div>
              <div v-else class="h-[300px]">
                 <BarChart :chart-data="priceComparison" />
              </div>
            </div> -->

            <div class="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm">
               <div class="flex items-center justify-between mb-8">
                  <h3 class="text-lg font-heading font-black text-slate-900 tracking-tight">Price Stability Tracker</h3>
               </div>
               <div v-if="stabilityPending" class="space-y-4">
                 <SkeletonLoader v-for="i in 3" :key="i" class="h-20 rounded-2xl" />
               </div>
               <div v-else-if="stabilityTrends.length" class="space-y-4">
                  <div v-for="item in stabilityTrends" :key="item.productId" class="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-between hover:border-emerald-100 transition-all group">
                     <div class="flex items-center gap-5">
                        <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                           <LucideTrendingUp class="w-6 h-6" />
                        </div>
                        <div>
                           <div class="font-bold text-slate-900">{{ item.name }}</div>
                           <div class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ item.category }}</div>
                        </div>
                     </div>
                     <div class="text-right">
                        <div class="text-lg font-black text-rose-600">+{{ item.totalIncreasePct.toFixed(1) }}%</div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          <div class="xl:col-span-4 space-y-8">
             <div class="bg-slate-900 rounded-3xl p-8 text-white min-h-[400px]">
                <h3 class="text-xl font-heading font-extrabold mb-8 text-center">Regional Index Map</h3>
                <div v-if="statsPending" class="space-y-4">
                   <SkeletonLoader v-for="i in 5" :key="i" class="h-12 bg-white/5 rounded-xl" />
                </div>
                <div v-else v-for="region in regions" :key="region.name" class="mb-6">
                   <div class="flex justify-between text-[11px] font-bold uppercase mb-2">
                      <span class="text-slate-400">{{ region.name }}</span>
                      <span>{{ region.value }}%</span>
                   </div>
                   <div class="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div class="h-full bg-emerald-500 rounded-full" :style="{ width: Math.min(100, region.value) + '%' }"></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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

const { formatPrice } = usePriceFormatter()

const refreshingAI = ref(false)

const { data: aiResponse, refresh: refreshAI } = useLazyAsyncData('ai-insights', () => $fetch('http://localhost:1998/api/v1/market/ai-insights'))
const { data: marketStats, pending: statsPending, refresh: refreshStats } = useLazyAsyncData('market-stats', () => $fetch('http://localhost:1998/api/v1/market/stats'))
const { data: allPrices, pending: pricesPending, refresh: refreshPrices } = useLazyAsyncData('all-prices', () => $fetch('http://localhost:1998/api/public/prices'))
const { data: regionData, refresh: refreshRegions } = useLazyAsyncData('regional-indices', () => $fetch('http://localhost:1998/api/v1/market/indices'))
const { data: stabilityTrends, pending: stabilityPending, refresh: refreshStability } = useLazyAsyncData('stability-trends', () => $fetch('http://localhost:1998/api/v1/market/stability'))

const aiInsight = computed(() => aiResponse.value?.insight)
const lastUpdateRaw = computed(() => aiResponse.value?.lastUpdated)
const regions = computed(() => regionData.value || [])

const timeAgo = computed(() => {
  if (!lastUpdateRaw.value || lastUpdateRaw.value === 'N/A') return 'Just Now'
  const date = new Date(lastUpdateRaw.value)
  const diff = Math.floor((new Date() - date) / 60000)
  if (diff < 1) return 'Just Now'
  if (diff < 60) return `${diff}m ago`
  return `${Math.floor(diff/60)}h ago`
})

const manualRefreshAI = async () => {
  if (refreshingAI.value) return
  refreshingAI.value = true
  try {
    await $fetch('http://localhost:1998/api/v1/market/ai-insights/refresh', { method: 'POST' })
    setTimeout(() => { refreshAI(); refreshingAI.value = false; }, 2000)
  } catch (e) { refreshingAI.value = false; }
}

const priceComparison = computed(() => {
  if (!allPrices.value || allPrices.value.length === 0) return { labels: [], datasets: [] }
  const sums = {}; const counts = {}
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
    refreshStats(); refreshPrices(); refreshAI(); refreshRegions()
  }, 60000)
  onUnmounted(() => clearInterval(interval))
})
</script>
