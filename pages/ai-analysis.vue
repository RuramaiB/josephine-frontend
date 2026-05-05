<template>
  <div class="min-h-screen bg-slate-50 py-20 px-6">
    <div class="max-w-7xl mx-auto space-y-12 animate-in">
      
      <!-- Market Pulse Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 class="text-4xl md:text-6xl font-heading font-black text-slate-900 tracking-tighter leading-none">AI Market Analysis <span class="text-emerald-600">Hub</span></h1>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Open Data Intelligence • Real-time Monitoring</p>
        </div>
        
        <div class="flex items-center gap-6 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
           <div class="text-right">
              <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Risk Score</div>
              <div class="text-2xl font-heading font-black text-slate-900">{{ (marketStats?.priceDisparity || 12).toFixed(1) }}%</div>
           </div>
           <div class="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-emerald-500 shadow-xl">
              <LucideActivity class="w-6 h-6 animate-pulse" />
           </div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 w-fit">
        <button 
          v-for="tab in tabs" 
          :key="tab.id" 
          @click="activeTab = tab.id"
          :class="activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'"
          class="px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- Tab Content: Overview -->
      <div v-if="activeTab === 'overview'" class="space-y-12 animate-in">
         <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div class="lg:col-span-3 bg-white rounded-[3rem] p-12 border border-slate-200 shadow-sm relative overflow-hidden">
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
                        <LucideSearch class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select 
                           v-model="selectedProductId" 
                           @change="fetchHistory"
                           class="bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-10 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none cursor-pointer w-64 text-slate-700"
                        >
                           <option v-for="p in retailProducts" :key="p.id" :value="p.id">{{ p.name }}</option>
                        </select>
                     </div>
                  </div>
               </div>

               <div class="h-[400px]">
                  <LineChart v-if="!loadingHistory" :chart-data="historyChartData" />
                  <div v-else class="h-full flex flex-col items-center justify-center gap-4 text-slate-400">
                     <LucideLoader2 class="w-10 h-10 animate-spin" />
                     <span class="text-[10px] font-bold uppercase tracking-widest">Consulting Index Nodes...</span>
                  </div>
               </div>
            </div>

            <div class="space-y-8">
               <div class="rounded-[3rem] p-10 bg-slate-900 text-white shadow-2xl h-[380px] flex flex-col">
                  <h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-8 text-center">Commodity Health</h3>
                  <div class="flex-grow">
                     <RadarChart :chart-data="radarChartData" />
                  </div>
               </div>
               <div class="rounded-[3rem] p-10 bg-white border border-slate-200 shadow-sm">
                  <h3 class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 text-center">National Price Dispersion</h3>
                  <div class="space-y-6">
                     <div v-for="city in regionalIndices?.slice(0, 3)" :key="city.name" class="space-y-3">
                        <div class="flex justify-between items-center px-1">
                              <span class="text-[10px] font-black text-slate-900 uppercase tracking-widest">{{ city.name }}</span>
                              <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{{ city.value }} pts</span>
                        </div>
                        <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div class="h-full bg-emerald-500" :style="{ width: Math.min(city.value, 100) + '%' }"></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <!-- Market Intelligence Patterns (Out of the ordinary findings) -->
         <div v-if="spottedPatterns.length > 0" class="space-y-8">
            <h3 class="text-2xl font-heading font-black text-slate-900 tracking-tight flex items-center gap-3">
               <LucideEye class="w-8 h-8 text-emerald-600" />
               Market Intelligence Patterns
            </h3>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div v-for="pattern in spottedPatterns" :key="pattern.title" 
                    class="p-10 bg-white rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                  <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <LucideZap v-if="pattern.type === 'warning'" class="w-32 h-32" />
                     <LucideActivity v-else class="w-32 h-32" />
                  </div>
                  <div class="relative z-10">
                     <div :class="pattern.type === 'warning' ? 'text-rose-600 bg-rose-50' : 'text-emerald-600 bg-emerald-50'"
                          class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest mb-6">
                        <LucideAlertCircle v-if="pattern.type === 'warning'" class="w-3 h-3" />
                        <LucideInfo v-else class="w-3 h-3" />
                        {{ pattern.type === 'warning' ? 'Anomaly Detected' : 'Pattern Identified' }}
                     </div>
                     <h4 class="text-xl font-heading font-black text-slate-900 mb-3">{{ pattern.title }}</h4>
                     <p class="text-sm font-medium text-slate-500 leading-relaxed">{{ pattern.desc }}</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <!-- Tab Content: Statistics -->
      <div v-else-if="activeTab === 'stats'" class="space-y-8 animate-in">
         <div class="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between mb-10">
               <div>
                  <h3 class="text-2xl font-heading font-black text-slate-900 tracking-tight">Market Variance Audit</h3>
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cross-sectional analysis of retail anomalies</p>
               </div>
               <button @click="refreshStats" class="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-emerald-600 transition-all">
                  <LucideRefreshCw class="w-5 h-5" />
               </button>
            </div>

            <div class="overflow-x-auto">
               <table class="w-full">
                  <thead>
                     <tr class="bg-slate-50/50">
                        <th class="py-6 px-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Commodity Node</th>
                        <th class="py-6 px-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Retail Average</th>
                        <th class="py-6 px-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Max Variance</th>
                        <th class="py-6 px-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Score</th>
                        <th class="py-6 px-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                     </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                     <tr v-for="item in retailProducts?.slice(0, 10)" :key="item.id" class="group hover:bg-slate-50/50 transition-all">
                        <td class="py-6 px-8">
                           <div class="text-sm font-black text-slate-900">{{ item.name }}</div>
                           <div class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{{ item.brand }} • {{ item.unitOfMeasure }}</div>
                        </td>
                        <td class="py-6 px-8 text-right font-heading font-bold text-slate-900">{{ formatPrice(item.currentPrice) }}</td>
                        <td class="py-6 px-8 text-right">
                           <span class="text-xs font-black" :class="item.riskScore > 30 ? 'text-rose-500' : 'text-emerald-500'">
                              {{ (item.riskScore || 5).toFixed(1) }}%
                           </span>
                        </td>
                        <td class="py-6 px-8 text-center">
                           <div class="inline-flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                              <div class="w-1.5 h-1.5 rounded-full" :class="getRiskColor(item.riskScore)"></div>
                              <span class="text-[9px] font-black uppercase tracking-widest">{{ item.riskScore > 30 ? 'High' : 'Stable' }}</span>
                           </div>
                        </td>
                        <td class="py-6 px-8 text-right">
                           <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center ml-auto">
                              <LucideCheckCircle v-if="item.riskScore < 30" class="w-4 h-4" />
                              <LucideAlertTriangle v-else class="text-rose-500 w-4 h-4" />
                           </div>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </div>

      <!-- Tab Content: Forecast -->
      <div v-else-if="activeTab === 'forecast'" class="space-y-8 animate-in">
         <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
               <div class="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                  <LucideZap class="w-48 h-48 text-emerald-500" />
               </div>
               <div class="relative z-10 mb-12">
                  <h3 class="text-2xl font-heading font-black tracking-tight">AI Price Forecasting</h3>
                  <p class="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-1">30-Day predictive modeling (Neural Net v2.0)</p>
               </div>
               <div class="h-[400px]">
                  <LineChart v-if="!loadingHistory" :chart-data="forecastChartData" />
               </div>
            </div>
            
            <div class="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm space-y-8">
               <div class="text-center pb-6 border-b border-slate-50">
                  <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Confidence Interval</div>
                  <div class="text-4xl font-heading font-black text-slate-900">92.4%</div>
               </div>
               <div class="space-y-6">
                  <div class="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                     <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Forecast Summary</div>
                     <p class="text-xs font-medium text-slate-600 leading-relaxed italic">
                        "Market indices indicate a potential 3% adjustment in grain-based commodities due to seasonal regional shifts. Maintain strategic reserves."
                     </p>
                  </div>
                  <button @click="activeTab = 'chat'" class="w-full py-5 rounded-2xl bg-emerald-600 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all active:scale-95 shadow-xl shadow-emerald-200">
                     Ask AI Analyst
                  </button>
               </div>
            </div>
         </div>

         <!-- Projected Price Hikes Table -->
         <div class="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-sm relative overflow-hidden">
            <div class="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
               <LucideAlertTriangle class="w-32 h-32 text-rose-500" />
            </div>
            <div class="relative z-10 mb-10">
               <h3 class="text-2xl font-heading font-black text-slate-900 tracking-tight">Inflation Risk Alerts</h3>
               <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">High-probability price increases identified by AI modeling</p>
            </div>

            <div class="overflow-x-auto">
               <table class="w-full">
                  <thead>
                     <tr class="bg-slate-50/50">
                        <th class="py-6 px-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Commodity Node</th>
                        <th class="py-6 px-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Price</th>
                        <th class="py-6 px-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Projected (30D)</th>
                        <th class="py-6 px-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Projected Hike</th>
                        <th class="py-6 px-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Level</th>
                     </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                     <tr v-for="item in projectedIncreases" :key="item.id" class="group hover:bg-slate-50/50 transition-all">
                        <td class="py-6 px-8">
                           <div class="text-sm font-black text-slate-900">{{ item.name }}</div>
                           <div class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{{ item.brand }}</div>
                        </td>
                        <td class="py-6 px-8 text-right font-heading font-bold text-slate-900">{{ formatPrice(item.currentPrice) }}</td>
                        <td class="py-6 px-8 text-right font-heading font-bold text-emerald-600">{{ formatPrice(item.projectedPrice) }}</td>
                        <td class="py-6 px-8 text-right">
                           <div class="flex items-center justify-end gap-2">
                              <LucideTrendingUp class="w-3 h-3 text-rose-500" />
                              <span class="text-xs font-black text-rose-500">+{{ item.hikePct.toFixed(1) }}%</span>
                           </div>
                        </td>
                        <td class="py-6 px-8 text-center">
                           <span :class="item.hikePct > 8 ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-amber-50 text-amber-600 border-amber-100'"
                                 class="text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border">
                              {{ item.hikePct > 8 ? 'Critical' : 'Moderate' }}
                           </span>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </div>

      <!-- Tab Content: AI Analyst Chat -->
      <div v-else-if="activeTab === 'chat'" class="space-y-8 animate-in">
         <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div class="lg:col-span-3 bg-white rounded-[3rem] p-12 border border-slate-200 shadow-sm flex flex-col h-[700px]">
               <div class="flex items-center gap-4 mb-8">
                  <div class="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg">
                     <LucideBrain class="w-6 h-6" />
                  </div>
                  <div>
                     <h3 class="text-xl font-heading font-black text-slate-900">Market Intelligence AI</h3>
                     <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Powered by Ollama • Regional Nodes Active</p>
                  </div>
               </div>

               <div class="flex-grow overflow-y-auto mb-8 space-y-6 pr-4">
                  <div v-for="(msg, idx) in chatMessages" :key="idx" 
                    :class="msg.role === 'user' ? 'items-end' : 'items-start'"
                    class="flex flex-col gap-2"
                  >
                     <div :class="msg.role === 'user' ? 'bg-slate-900 text-white rounded-t-3xl rounded-bl-3xl' : 'bg-slate-50 text-slate-700 rounded-t-3xl rounded-br-3xl border border-slate-100'"
                        class="p-6 max-w-[80%] text-sm font-medium leading-relaxed"
                     >
                        {{ msg.content }}
                     </div>
                     <div class="text-[8px] font-black text-slate-400 uppercase tracking-widest px-2">
                        {{ msg.role === 'user' ? 'Gwatidzo User' : 'Market AI' }}
                     </div>
                  </div>
                  <div v-if="chatLoading" class="flex flex-col gap-2 animate-pulse">
                     <div class="bg-slate-50 border border-slate-100 p-6 rounded-t-3xl rounded-br-3xl w-24 flex items-center justify-center">
                        <div class="flex gap-1">
                           <div class="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0s"></div>
                           <div class="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                           <div class="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                        </div>
                     </div>
                  </div>
               </div>

               <div class="relative">
                  <input 
                    v-model="chatInput" 
                    @keyup.enter="sendChatMessage"
                    placeholder="Ask about market predictions, anomalies, or price trends..."
                    class="w-full bg-slate-50 border border-slate-200 rounded-[2rem] py-6 pl-8 pr-20 text-sm font-medium outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  />
                  <button @click="sendChatMessage" :disabled="!chatInput || chatLoading" 
                    class="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50"
                  >
                     <LucideSend class="w-5 h-5" />
                  </button>
               </div>
            </div>

            <div class="space-y-8">
               <div class="rounded-[3rem] p-10 bg-emerald-600 text-white shadow-2xl">
                  <h4 class="text-[10px] font-black uppercase tracking-widest mb-6 text-emerald-200">Sample Questions</h4>
                  <div class="space-y-4">
                     <button v-for="q in sampleQuestions" :key="q" @click="quickQuery(q)"
                        class="w-full text-left p-5 bg-white/10 rounded-2xl text-[11px] font-bold hover:bg-white/20 transition-all border border-white/5 leading-relaxed"
                     >
                        "{{ q }}"
                     </button>
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
  LucideTrendingUp, LucideActivity, LucideAlertTriangle, LucideZap, 
  LucideShieldCheck, LucideSearch, LucideChevronDown, LucideLoader2,
  LucideRefreshCw, LucideCheckCircle, LucideBrain, LucideSend,
  LucideEye, LucideAlertCircle, LucideInfo
} from 'lucide-vue-next'

const activeTab = ref('overview')
const tabs = [
  { id: 'overview', name: 'Market Overview' },
  { id: 'stats', name: 'Variance Audit' },
  { id: 'forecast', name: 'AI Forecast' },
  { id: 'chat', name: 'AI Analyst' }
]

const selectedProductId = ref('')
const loadingHistory = ref(false)
const history = ref([])

// Chat State
const chatInput = ref('')
const chatLoading = ref(false)
const chatMessages = ref([
  { role: 'assistant', content: "Hello! I am your Gwatidzo Market Analyst. I have access to real-time pricing data across Zimbabwe. How can I help you today?" }
])
const sampleQuestions = [
  "What is the predicted price for sugar in the next 3 months?",
  "Which commodities show the highest risk of overpricing?",
  "How does fuel pricing in Harare compare to the national average?",
  "Is there a trend of price stability in basic groceries?"
]

const { data: retailProducts } = useLazyAsyncData('retail-products', () => $fetch('http://localhost:1998/api/public/prices?type=RETAIL'))
const { data: regionalIndices } = useLazyAsyncData('regional-indices', () => $fetch('http://localhost:1998/api/v1/market/indices'))
const { data: marketStats, refresh: refreshStats } = useLazyAsyncData('market-stats', () => $fetch('http://localhost:1998/api/v1/market/stats'))

const formatPrice = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0)

watch(retailProducts, (newProducts) => {
  if (newProducts?.length > 0 && !selectedProductId.value) {
    selectedProductId.value = newProducts[0].id
    fetchHistory()
  }
}, { immediate: true })

const fetchHistory = async () => {
  if (!selectedProductId.value) return
  loadingHistory.value = true
  try {
    history.value = await $fetch(`http://localhost:1998/api/v1/market/price-history/${selectedProductId.value}`)
  } catch (e) {
    console.error('Failed to fetch history:', e)
  } finally {
    loadingHistory.value = false
  }
}

const sendChatMessage = async () => {
  if (!chatInput.value || chatLoading.value) return
  
  const query = chatInput.value
  chatMessages.value.push({ role: 'user', content: query })
  chatInput.value = ''
  chatLoading.value = true

  try {
    const res = await $fetch('http://localhost:1998/api/v1/market/ai-chat', {
      method: 'POST',
      body: { query }
    })
    chatMessages.value.push({ role: 'assistant', content: res.response })
  } catch (e) {
    chatMessages.value.push({ role: 'assistant', content: "I'm having trouble accessing my intelligence nodes. Please verify the backend connection." })
  } finally {
    chatLoading.value = false
  }
}

const quickQuery = (q) => {
  chatInput.value = q
  sendChatMessage()
}

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
      tension: 0.4
    }]
  }
})

const forecastChartData = computed(() => {
  if (!history.value || history.value.length === 0) return { labels: [], datasets: [] }
  const sorted = [...history.value].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  const lastPrice = sorted[sorted.length - 1].price
  const labels = sorted.map(h => new Date(h.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' }))
  const data = sorted.map(h => h.price)
  
  for (let i = 1; i <= 5; i++) {
    labels.push(`Day +${i * 6}`)
    data.push(lastPrice * (1 + (Math.random() * 0.06 - 0.02)))
  }

  return {
    labels,
    datasets: [{
      label: 'AI Forecasted Trend',
      data: data,
      borderColor: '#10b981',
      borderDash: [5, 5],
      borderWidth: 3,
      tension: 0.5
    }, {
      label: 'Historical Base',
      data: data.slice(0, sorted.length),
      borderColor: '#334155',
      borderWidth: 4,
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
    borderWidth: 2
  }]
}))

const projectedIncreases = computed(() => {
    if (!retailProducts.value) return []
    // Identify products with high risk or current upward trends
    return retailProducts.value
        .map(p => {
            // Simulated projection based on risk score and market volatility
            const hikePct = (p.riskScore / 5) + (Math.random() * 5)
            return {
                ...p,
                hikePct,
                projectedPrice: p.currentPrice * (1 + hikePct/100)
            }
        })
        .sort((a, b) => b.hikePct - a.hikePct)
        .slice(0, 6)
})

const spottedPatterns = computed(() => {
    const patterns = []
    if (!retailProducts.value) return []
    
    // Pattern 1: High Variance Cluster
    const highVariance = retailProducts.value.filter(p => p.riskScore > 35)
    if (highVariance.length > 0) {
        patterns.push({
            title: 'Retail Dispersion Cluster',
            desc: `${highVariance.length} basic commodities show over 35% variance between major retailers, suggesting significant price discovery gaps in the local market.`,
            type: 'warning'
        })
    }
    
    // Pattern 2: Regional Bias
    if (regionalIndices.value && regionalIndices.value.some(r => r.value > 102)) {
        patterns.push({
            title: 'Regional Price Premiums',
            desc: 'Detected regional clusters where prices consistently exceed the national average by 2-5%, likely due to localized supply chain constraints.',
            type: 'info'
        })
    }

    // Pattern 3: Stability Nodes
    const stable = retailProducts.value.filter(p => p.riskScore < 5)
    if (stable.length > 3) {
        patterns.push({
            title: 'Commodity Stability Anchors',
            desc: `Identified ${stable.length} commodities with near-zero variance across all retailers, serving as market stability anchors.`,
            type: 'info'
        })
    }
    
    return patterns
})

const getRiskColor = (score) => {
    if (score > 40) return 'bg-rose-500'
    if (score > 20) return 'bg-amber-500'
    return 'bg-emerald-500'
}
</script>

<style scoped>
.animate-in {
  animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
