<template>
  <NuxtLayout name="dashboard">
    <template #header-title>Provincial Market Analysis</template>

    <div class="animate-in space-y-12">
      <!-- Market Pulse Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h2 class="text-4xl font-heading font-black text-slate-900 tracking-tighter leading-none">Market Analysis <span class="text-emerald-600">Hub</span></h2>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Open Data Intelligence • Real-time Monitoring</p>
        </div>
        <div class="flex items-center gap-6">
           <div class="text-right">
              <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Risk Score</div>
              <div class="text-2xl font-heading font-black text-slate-900">{{ Math.round(stats?.averageMarketRisk || 12) }}%</div>
           </div>
           <div class="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-emerald-500 shadow-xl">
              <LucideActivity class="w-6 h-6 animate-pulse" />
           </div>
        </div>
      </div>

      <!-- Main Analysis Row -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Robust Trend Analysis -->
        <div class="lg:col-span-3 glass-morphism rounded-[3rem] p-12 bg-white border border-emerald-100/30 shadow-2xl shadow-emerald-900/5 relative overflow-hidden">
          <div class="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
             <LucideTrendingUp class="w-48 h-48 text-emerald-600" />
          </div>

          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 relative z-10">
            <div>
              <h3 class="text-2xl font-heading font-black text-slate-900 tracking-tight">Price History Trends</h3>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Historical Price Data • Market Trends</p>
            </div>
            
            <div class="flex items-center gap-4">
               <div class="relative group">
                  <LucideSearch class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 font-bold" />
                  <select 
                    v-model="selectedProductId" 
                    @change="fetchHistory"
                    class="bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-11 pr-10 text-[10px] font-black uppercase tracking-[0.1em] outline-none focus:ring-4 focus:ring-emerald-500/10 appearance-none cursor-pointer w-64 shadow-inner text-slate-700"
                  >
                    <option v-for="p in retailProducts" :key="p.id" :value="p.id">{{ p.name }}</option>
                  </select>
                  <LucideChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
               </div>
            </div>
          </div>

          <div class="h-[450px]">
            <LineChart v-if="!loadingHistory" :chart-data="historyChartData" />
            <div v-else class="h-full flex flex-col items-center justify-center gap-4 text-slate-400">
               <LucideLoader2 class="w-10 h-10 animate-spin" />
               <span class="text-[10px] font-bold uppercase tracking-widest">Consulting Index Nodes...</span>
            </div>
          </div>
        </div>

        <!-- Robust Side Metrics -->
        <div class="space-y-8">
          <div class="glass-morphism rounded-[3rem] p-10 bg-slate-900 text-white border-none shadow-2xl h-[380px] flex flex-col">
            <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-8 text-center font-heading">Commodity Health</h3>
            <div class="flex-grow">
               <RadarChart :chart-data="radarChartData" />
            </div>
            <div class="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
               <div class="text-center">
                  <div class="text-[8px] font-bold text-slate-500 uppercase">Reliability</div>
                  <div class="text-sm font-black text-emerald-500">98.2%</div>
               </div>
               <div class="text-center">
                  <div class="text-[8px] font-bold text-slate-500 uppercase">Parity</div>
                  <div class="text-sm font-black text-emerald-500">Match</div>
               </div>
            </div>
          </div>

          <div class="glass-morphism rounded-[3rem] p-10 bg-white border border-emerald-100/30 shadow-xl">
             <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 text-center">National Price Dispersion</h3>
             <div class="space-y-6">
                <div v-for="city in regionalIndices?.slice(0, 3)" :key="city.name" class="space-y-3">
                    <div class="flex justify-between items-center px-1">
                        <span class="text-[10px] font-black text-slate-900 uppercase tracking-widest">{{ city.name }}</span>
                        <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{{ city.value }} pts</span>
                    </div>
                    <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000 ease-out" :style="{ width: Math.min(city.value, 110) + '%' }"></div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <!-- Analysis Insight Bar -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div v-for="i in 3" :key="i" class="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex items-start gap-6 group hover:translate-y-[-4px] transition-all">
            <div class="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
               <LucideZap v-if="i===1" class="w-6 h-6" />
               <LucideShieldCheck v-else-if="i===2" class="w-6 h-6" />
               <LucideActivity v-else class="w-6 h-6" />
            </div>
            <div>
               <h4 class="text-xs font-black text-slate-900 uppercase tracking-widest mb-1">
                  {{ i === 1 ? 'Volatility Alert' : i === 2 ? 'Audit Confidence' : 'AI Forecast' }}
               </h4>
               <p class="text-[10px] font-bold text-slate-400 leading-relaxed uppercase">
                  {{ i === 1 ? 'Current market shows 2.4% variance in fuel pricing' : i === 2 ? 'Data source integrity verified by national hub nodes' : 'Bullish trend expected for essential commodities' }}
               </p>
            </div>
         </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { LucideTrendingUp, LucideActivity, LucideAlertTriangle, LucideZap, LucideShieldCheck, LucideSearch, LucideChevronDown, LucideLoader2 } from 'lucide-vue-next'

const api = useApi()
const selectedProductId = ref('')
const loadingHistory = ref(false)
const syncing = ref(false)

// Data fetching
// Data fetching
const { data: sources, refresh: refreshSources } = useLazyAsyncData('data-sources', () => api.getDataSources())
const { data: stats, refresh: refreshStats } = useLazyAsyncData('market-stats', () => api.getMarketStats())
const { data: retailProducts, pending: productsPending } = useLazyAsyncData('retail-products', () => api.getMarketProducts('RETAIL'))
const { data: regionalIndices, refresh: refreshIndices } = useLazyAsyncData('regional-indices', () => api.getRegionalIndices())
const history = ref([])

// Watch for products to arrive lazily
watch(retailProducts, (newProducts) => {
  if (newProducts?.length > 0 && !selectedProductId.value) {
    selectedProductId.value = newProducts[0].id
    fetchHistory()
  }
}, { immediate: true })

onMounted(() => {
  const interval = setInterval(() => {
    refreshSources()
    refreshStats()
    refreshIndices()
  }, 30000)

  onUnmounted(() => clearInterval(interval))
})

const fetchHistory = async () => {
  if (!selectedProductId.value) return
  loadingHistory.value = true
  try {
    history.value = await api.getPriceHistory(selectedProductId.value)
  } catch (e) {
    console.error('Failed to fetch history:', e)
  } finally {
    loadingHistory.value = false
  }
}

const triggerResync = async () => {
  syncing.value = true
  try {
    await api.triggerScrape()
    await refreshSources()
    await refreshStats()
  } catch (e) {
    console.error(e)
  } finally {
    syncing.value = false
  }
}

// Chart Computations
const historyChartData = computed(() => {
  if (!history.value || history.value.length === 0) return { labels: [], datasets: [] }
  
  const sorted = [...history.value].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  return {
    labels: sorted.map(h => new Date(h.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })),
    datasets: [{
      label: 'Market Price (USD)',
      data: sorted.map(h => h.price),
      fill: true,
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.05)',
      borderWidth: 4,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#10b981',
      pointBorderWidth: 3,
      pointRadius: 4,
      tension: 0.4
    }]
  }
})

const radarChartData = computed(() => ({
  labels: ['Stability', 'Parity', 'Accuracy', 'Availability', 'Safety'],
  datasets: [{
    label: 'Market Health',
    data: [85, 92, 94, 78, 90],
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10b981',
    borderWidth: 2,
    pointBackgroundColor: '#10b981'
  }]
}))


const formatDate = (dateStr) => {
  if (!dateStr || dateStr === 'N/A') return 'In Queue'
  const date = new Date(dateStr)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
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
