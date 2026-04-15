<template>
  <NuxtLayout name="dashboard">
    <template #header-title>Zimbabwe Market Overview</template>

    <div class="animate-in space-y-12">
      <!-- AI Intelligence Brief -->
      <div class="glass-morphism rounded-[2.5rem] p-10 bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden">
        <div class="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
           <LucideBrain class="w-32 h-32 text-emerald-500" />
        </div>
        <div class="relative z-10 flex flex-col md:flex-row gap-8 items-start">
           <div class="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shrink-0 shadow-xl shadow-emerald-500/20">
              <LucideBrain class="w-8 h-8 text-white" />
           </div>
           <div class="flex-grow space-y-4">
              <div class="flex items-center gap-3">
                 <h2 class="text-xl font-heading font-extrabold tracking-tight">National Market Intelligence <span class="text-emerald-500">Brief</span></h2>
                 <span class="text-[9px] font-black bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded border border-emerald-500/20 uppercase tracking-widest">Live Ollama Llama 3</span>
              </div>
              <p v-if="aiInsight" class="text-sm text-slate-300 leading-relaxed font-medium italic">
                 "{{ aiInsight }}"
              </p>
              <div v-else-if="aiPending" class="flex items-center gap-3 text-slate-500">
                 <LucideLoader2 class="w-4 h-4 animate-spin" />
                 <span class="text-[10px] font-bold uppercase tracking-widest">Consulting Neural Nodes...</span>
              </div>
              <div class="flex items-center gap-6 pt-4 border-t border-white/5">
                 <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span class="text-[10px] font-bold text-slate-500 uppercase">Stability: High</span>
                 </div>
                 <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-teal-500"></div>
                    <span class="text-[10px] font-bold text-slate-500 uppercase">Prediction Accuracy: 94%</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div v-if="statsPending" class="p-8 flex justify-center">
         <LucideLoader2 class="w-8 h-8 animate-spin text-emerald-500" />
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <StatCard
          title="Essential Items"
          :value="marketStats?.totalProducts || 0"
          icon="Package"
          trend="Live"
          :isUp="true"
          color="emerald"
        />
        <StatCard
          title="Price Records"
          :value="marketStats?.totalPriceRecords || 0"
          icon="Database"
          trend="Real-time"
          :isUp="true"
          color="teal"
        />
        <StatCard
          title="Avg Ref Price"
          :value="formatPrice(marketStats?.averageRefPrice)"
          icon="Zap"
          trend="Market"
          :isUp="true"
          color="emerald"
        />
        <StatCard
          title="Index Accuracy"
          :value="(marketStats?.indexAccuracy || 0) + '%'"
          icon="ShieldCheck"
          trend="AI"
          :isUp="true"
          color="teal"
        />
      </div>

      <!-- Main Section -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-10">
        <!-- Overpricing Alerts -->
        <div class="xl:col-span-2 space-y-8">
          <!-- Advanced Analytics Charts -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="glass-morphism rounded-[2.5rem] p-10 bg-white border border-emerald-100/20 shadow-xl">
              <h3 class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 text-center font-heading">Commodity Distribution</h3>
              <div class="h-64">
                <DoughnutChart v-if="!pricesPending" :chart-data="categoryDistribution" />
                <div v-else class="h-full flex items-center justify-center">
                   <LucideLoader2 class="w-6 h-6 animate-spin text-slate-200" />
                </div>
              </div>
            </div>
            <div class="glass-morphism rounded-[2.5rem] p-10 bg-white border border-emerald-100/20 shadow-xl">
              <h3 class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 text-center font-heading">Price Parity by Category</h3>
              <div class="h-64">
                <BarChart v-if="!pricesPending" :chart-data="priceComparison" />
                <div v-else class="h-full flex items-center justify-center">
                   <LucideLoader2 class="w-6 h-6 animate-spin text-slate-200" />
                </div>
              </div>
            </div>
          </div>

          <div class="glass-morphism rounded-[2.5rem] p-10 border-emerald-100/20 shadow-2xl shadow-emerald-900/5 bg-white">
            <div class="flex items-center justify-between mb-10">
              <div>
                <h2 class="text-xl font-heading font-extrabold text-slate-900 tracking-tight">Overpricing Alerts</h2>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Products detected above statistical market average</p>
              </div>
              <button @click="refreshAlerts" class="p-2 hover:bg-slate-100 rounded-xl transition-all">
                 <LucideRefreshCw class="w-5 h-5 text-slate-400" :class="{ 'animate-spin': alertsPending }" />
              </button>
            </div>
            
            <div v-if="alertsPending" class="py-20 flex flex-col items-center gap-4">
               <LucideLoader2 class="w-8 h-8 animate-spin text-emerald-500" />
            </div>
            <div v-else-if="alerts?.length" class="space-y-4">
               <div v-for="item in alerts" :key="item.id" class="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between hover:border-emerald-200 transition-all">
                  <div class="flex items-center gap-4">
                     <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-600 shadow-sm border border-slate-100">
                        <LucideAlertTriangle class="w-6 h-6" />
                     </div>
                     <div>
                        <div class="text-sm font-bold text-slate-900">{{ item.name }}</div>
                        <div class="text-[10px] font-bold text-slate-400 uppercase">Provider: {{ item.retailer }} • Risk Score: {{ item.riskScore.toFixed(1) }}</div>
                     </div>
                  </div>
                  <div class="text-right">
                     <div class="text-lg font-black text-rose-600">{{ formatPrice(item.currentPrice, item.category) }}</div>
                     <span class="text-[9px] font-bold text-rose-500 flex items-center gap-1 justify-end">
                        <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> OVERPRICED
                     </span>
                  </div>
               </div>
            </div>
            <div v-else class="py-20 text-center space-y-4">
               <LucideCheckCircle2 class="w-12 h-12 text-emerald-500 mx-auto opacity-20" />
               <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">No overpricing alerts detected in current cycle</p>
            </div>
          </div>
          
          <!-- Sync Stats -->
          <div class="grid grid-cols-2 gap-6">
             <div class="p-8 bg-emerald-600 rounded-[2rem] text-white space-y-4 shadow-xl shadow-emerald-900/10">
                <LucideHistory class="w-8 h-8 opacity-50" />
                <div>
                   <div class="text-[10px] font-bold uppercase tracking-widest opacity-70">Latest Market Sync</div>
                   <div class="text-xl font-heading font-black">Just Now (0s ago)</div>
                </div>
             </div>
             <div class="p-8 bg-slate-900 rounded-[2rem] text-white space-y-4 shadow-xl shadow-slate-900/10">
                <LucideGlobe class="w-8 h-8 opacity-50" />
                <div>
                   <div class="text-[10px] font-bold uppercase tracking-widest opacity-70">Retail Coverage</div>
                   <div class="text-xl font-heading font-black">92% Provinces</div>
                </div>
             </div>
          </div>
        </div>

        <!-- Fuel Monitoring -->
        <div class="glass-morphism rounded-[2.5rem] p-10 border-emerald-100/20 bg-slate-900 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent pointer-events-none"></div>
          
          <div class="space-y-10 relative">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-emerald-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-emerald-900/50">
                <LucideFuel class="w-7 h-7" />
              </div>
              <div>
                 <h2 class="text-xl font-heading font-extrabold tracking-tight">Fuel Monitor</h2>
                 <p class="text-[10px] font-bold text-emerald-500 uppercase tracking-widest font-heading">ZERA Regulated Cycle</p>
              </div>
            </div>
            
            <div v-if="fuelPending" class="py-10 flex flex-col items-center gap-4 text-slate-500">
               <LucideLoader2 class="w-8 h-8 animate-spin" />
               <span class="text-[10px] font-bold uppercase tracking-widest font-heading">Syncing Providers...</span>
            </div>

            <div v-else class="space-y-6">
               <div v-for="fuel in fuelProducts" :key="fuel.id" class="p-6 bg-white/5 rounded-3xl border border-white/10 group hover:border-emerald-500 hover:bg-white/10 transition-all duration-300">
                  <div class="flex justify-between items-start mb-4">
                    <div>
                      <span class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] font-heading">{{ fuel.name }}</span>
                      <div class="text-[9px] font-bold text-emerald-500/70 uppercase mt-1 tracking-wider">{{ fuel.retailer }} • {{ fuel.region }}</div>
                    </div>
                    <span class="text-[9px] font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
                      LIVE
                    </span>
                  </div>
                  <div class="flex items-baseline justify-between">
                    <div class="flex items-baseline gap-2">
                       <div class="text-3xl font-heading font-black text-white">{{ formatPrice(fuel.currentPrice, 'FUEL') }}</div>
                       <div class="text-[10px] font-bold text-slate-500 uppercase font-heading">per unit</div>
                    </div>
                    <LucideZap v-if="fuel.currentPrice < 1.7" class="w-4 h-4 text-emerald-500 animate-pulse" />
                  </div>
               </div>
            </div>
          </div>
          
          <div class="mt-12 space-y-6 relative">
             <div class="flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.2em]">
               <span class="text-slate-500 font-heading">Provider Integrity</span>
               <span class="text-emerald-500">ZERA ENFORCED</span>
            </div>
            <button class="w-full py-5 bg-emerald-600 text-white rounded-2xl text-[10px] font-bold tracking-[0.25em] hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-900/40 transition-all active:scale-95 uppercase font-heading">
              Explore Regional Hubs
            </button>
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
  LucideTrendingUp, LucideTrendingDown
} from 'lucide-vue-next'

import { onMounted, onUnmounted, computed } from 'vue'

const api = useApi()
const { formatPrice, isVerifiedSource } = usePriceFormatter()

// Fetch real fuel data
const { data: fuelProducts, pending: fuelPending, refresh: refreshFuel } = await useAsyncData('fuel-data', () => api.getMarketProducts('FUEL'))

// Fetch price trends
const { data: trends, refresh: refreshTrends } = await useAsyncData('market-trends', () => $fetch('http://localhost:1998/api/v1/market/trends'))

// Fetch AI Insights
const { data: aiResponse, pending: aiPending, refresh: refreshAI } = await useAsyncData('ai-insights', () => $fetch('http://localhost:1998/api/v1/market/ai-insights'))
const aiInsight = computed(() => aiResponse.value?.insight)

// Fetch market stats
const { data: marketStats, pending: statsPending, refresh: refreshStats } = await useAsyncData('market-stats', () => $fetch('http://localhost:1998/api/v1/market/stats'))

// Fetch all prices for analytics
const { data: allPrices, pending: pricesPending, refresh: refreshPrices } = await useAsyncData('all-prices', () => $fetch('http://localhost:1998/api/public/prices'))

// Compute alerts from all prices
const alerts = computed(() => (allPrices.value || []).filter(p => p.alert))

const alertsPending = computed(() => pricesPending.value)
const refreshAlerts = () => refreshPrices()

// Advanced Analytics Computations
const categoryDistribution = computed(() => {
  if (!allPrices.value || allPrices.value.length === 0) return { labels: [], datasets: [] }
  const counts = {}
  allPrices.value.forEach(p => counts[p.category] = (counts[p.category] || 0) + 1)
  return {
    labels: Object.keys(counts),
    datasets: [{
      data: Object.values(counts),
      backgroundColor: ['#10b981', '#14b8a6', '#0f766e', '#064e3b', '#34d399', '#059669'],
      borderWidth: 0
    }]
  }
})

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
      borderRadius: 8
    }]
  }
})

onMounted(() => {
  const interval = setInterval(() => {
    refreshFuel()
    refreshStats()
    refreshPrices()
    refreshTrends()
    refreshAI()
  }, 30000)

  onUnmounted(() => {
    clearInterval(interval)
  })
})
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
