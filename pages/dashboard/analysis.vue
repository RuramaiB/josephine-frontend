<template>
  <NuxtLayout name="dashboard">
    <template #header-title>Provincial Market Analysis</template>

    <div class="animate-in space-y-10">
      <!-- Summary Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Market Average" 
          :value="stats?.averageRefPrice ? '$ ' + stats.averageRefPrice.toFixed(2) : '---'" 
          icon="LucideCoins" 
          trend="2.4" 
          :isUp="true"
          color="emerald"
        />
        <StatCard 
          title="Price Disparity" 
          :value="stats?.priceDisparity ? stats.priceDisparity.toFixed(1) + '%' : '---'" 
          icon="LucideScale" 
          trend="0.5" 
          :isUp="false"
          color="teal"
        />
        <StatCard 
          title="Active Sources" 
          :value="sources?.length || '0'" 
          icon="LucideDatabase" 
          trend="12" 
          :isUp="true"
          color="emerald"
        />
        <StatCard 
          title="Index Accuracy" 
          :value="(stats?.indexAccuracy || 94.2).toFixed(1) + '%'" 
          icon="LucideShieldCheck" 
          trend="0.1" 
          :isUp="true"
          color="teal"
        />
      </div>

      <!-- Main Analysis Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Interactive Trend Chart -->
        <div class="lg:col-span-2 glass-morphism rounded-[2.5rem] p-10 bg-white border border-emerald-100/20 shadow-2xl shadow-emerald-900/5">
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div>
              <h2 class="text-xl font-heading font-extrabold text-slate-900 tracking-tight">Price Trend Intelligence</h2>
              <p class="text-[10px] font-bold text-slate-400 capitalize tracking-widest mt-1">Analyzing historical fluctuations across regional hubs</p>
            </div>
            
            <div class="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
               <div class="relative group">
                  <LucideSearch class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <select 
                    v-model="selectedProductId" 
                    @change="fetchHistory"
                    class="bg-white border-none rounded-xl py-2 pl-9 pr-8 text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-emerald-500/10 appearance-none cursor-pointer w-48 shadow-sm"
                  >
                    <option v-for="p in retailProducts" :key="p.id" :value="p.id">{{ p.name }}</option>
                  </select>
                  <LucideChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
               </div>
            </div>
          </div>

          <div class="h-[400px]">
            <LineChart v-if="!loadingHistory" :chart-data="historyChartData" />
            <div v-else class="h-full flex items-center justify-center">
               <LucideLoader2 class="w-8 h-8 animate-spin text-emerald-500" />
            </div>
          </div>
        </div>

        <!-- Retailer Comparison & Category Mix -->
        <div class="space-y-8">
          <div class="glass-morphism rounded-[2.5rem] p-8 bg-slate-900 text-white border-none shadow-2xl">
            <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-6 font-heading">Regional Price Index</h3>
            <div class="space-y-6">
                <div v-for="city in regionalIndices" :key="city.name" class="space-y-2">
                    <div class="flex justify-between items-center">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ city.name }}</span>
                        <span class="text-[10px] font-black text-white px-2 py-0.5 rounded bg-white/10">{{ city.value }} pts</span>
                    </div>
                    <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div class="h-full bg-emerald-500 transition-all duration-1000" :style="{ width: Math.min(city.value, 110) + '%' }"></div>
                    </div>
                </div>
            </div>
          </div>

          <div class="glass-morphism rounded-[2.5rem] p-8 bg-white border border-emerald-100/20 shadow-xl h-[300px]">
             <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 text-center">Market Inventory Mix</h3>
             <div class="h-40">
                <DoughnutChart :chart-data="categoryChartData" />
             </div>
          </div>
        </div>
      </div>

      <!-- Data Source Integrity Table -->
       <div class="glass-morphism rounded-[2.5rem] bg-white border border-emerald-100/20 overflow-hidden shadow-2xl shadow-emerald-900/5">
         <div class="px-10 py-8 border-b border-slate-50 flex justify-between items-center">
            <div>
              <h2 class="text-lg font-heading font-extrabold text-slate-900 tracking-tight">Data Source Integrity</h2>
              <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time health monitoring of automated scrapers</p>
            </div>
            <button @click="triggerResync(null)" class="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all">
               <LucideRefreshCcw class="w-4 h-4" :class="{ 'animate-spin': syncing }" />
            </button>
         </div>
         <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-slate-50/50 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  <th class="px-10 py-6">Source Node</th>
                  <th class="px-10 py-6">Status</th>
                  <th class="px-10 py-6">Payload size</th>
                  <th class="px-10 py-6">Last Handshake</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr v-for="source in sources" :key="source.name" class="group hover:bg-slate-50/50 transition-colors">
                  <td class="px-10 py-6 font-bold text-slate-700 text-xs">{{ source.name }}</td>
                  <td class="px-10 py-6">
                    <span class="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-[9px] font-bold rounded-lg uppercase tracking-widest">{{ source.status }}</span>
                  </td>
                  <td class="px-10 py-6 font-bold text-slate-400 text-[10px]">{{ source.items }} items</td>
                  <td class="px-10 py-6 font-bold text-slate-400 text-[10px]">{{ formatDate(source.lastSync) }}</td>
                </tr>
              </tbody>
            </table>
         </div>
       </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { LucideTrendingUp, LucideScale, LucideCoins, LucideShieldCheck, LucideSearch, LucideChevronDown, LucideRefreshCcw, LucideLoader2, LucideDatabase } from 'lucide-vue-next'

const api = useApi()
const selectedProductId = ref('')
const loadingHistory = ref(false)
const syncing = ref(false)

// Data fetching
const { data: sources, refresh: refreshSources } = await useAsyncData('data-sources', () => api.getDataSources())
const { data: stats, refresh: refreshStats } = await useAsyncData('market-stats', () => api.getMarketStats())
const { data: retailProducts } = await useAsyncData('retail-products', () => api.getMarketProducts('RETAIL'))
const { data: regionalIndices, refresh: refreshIndices } = await useAsyncData('regional-indices', () => api.getRegionalIndices())
const history = ref([])

onMounted(async () => {
  if (retailProducts.value && retailProducts.value.length > 0) {
    selectedProductId.value = retailProducts.value[0].id
    await fetchHistory()
  }

  const interval = setInterval(() => {
    refreshSources()
    refreshStats()
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
  
  // Group by date to show trend
  const sorted = [...history.value].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  return {
    labels: sorted.map(h => new Date(h.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })),
    datasets: [{
      label: 'Price (USD)',
      data: sorted.map(h => h.price),
      fill: true,
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderWidth: 3,
      pointBackgroundColor: '#fff',
      pointBorderColor: '#10b981',
      pointBorderWidth: 2
    }]
  }
})

const currentPricePoints = computed(() => {
  if (!history.value || history.value.length === 0) return []
  
  // Get latest price from each unique source
  const latestBySource = {}
  history.value.forEach(h => {
    if (!latestBySource[h.source] || new Date(h.timestamp) > new Date(latestBySource[h.source].timestamp)) {
      latestBySource[h.source] = h
    }
  })
  
  const sourcesArr = Object.values(latestBySource)
  const minPrice = Math.min(...sourcesArr.map(s => s.price))
  
  return sourcesArr.map(s => ({
    source: s.source,
    price: s.price,
    isCheapest: s.price === minPrice
  }))
})

const comparisonChartData = computed(() => ({
  labels: currentPricePoints.value.map(p => p.source),
  datasets: [{
    label: 'Market Price',
    data: currentPricePoints.value.map(p => p.price),
    backgroundColor: currentPricePoints.value.map(p => p.isCheapest ? '#10b981' : '#1e293b'),
    borderRadius: 8
  }]
}))

const categoryChartData = computed(() => {
  const counts = {}
  retailProducts.value?.forEach(p => {
    counts[p.category] = (counts[p.category] || 0) + 1
  })
  
  return {
    labels: Object.keys(counts),
    datasets: [{
      data: Object.values(counts),
      backgroundColor: ['#10b981', '#14b8a6', '#0ea5e9', '#6366f1'],
      borderWidth: 0,
      hoverOffset: 10
    }]
  }
})

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
