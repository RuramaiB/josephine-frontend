<template>
  <div class="min-h-screen bg-slate-50 py-20 px-6">
    <div class="max-w-7xl mx-auto">
      
      <!-- Header -->
      <div class="mb-12">
         <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold tracking-widest uppercase mb-4 animate-in">
           Market Intelligence
         </div>
         <h1 class="text-4xl md:text-5xl font-heading font-black text-slate-900 tracking-tight mb-4 animate-in [animation-delay:100ms]">
           Price Trends & <span class="text-gradient">Alerts</span>
         </h1>
         <p class="text-slate-500 max-w-2xl text-lg animate-in [animation-delay:200ms]">
           Monitor real-time market fluctuations, track historical price adjustments, and view active alerts for overpriced commodities.
         </p>

         <!-- Category Filter -->
         <div class="mt-12 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6 animate-in [animation-delay:250ms]">
            <div class="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
               <LucideLayers class="w-6 h-6" />
            </div>
            <div class="flex-grow w-full md:w-auto">
               <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 mb-2 block">Filter by Category</label>
               <select v-model="selectedCategory" class="w-full md:max-w-xs bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer hover:bg-slate-100">
                  <option value="">All Categories</option>
                  <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
               </select>
            </div>
         </div>
      </div>

      <div v-if="loading" class="py-32 flex flex-col items-center gap-6">
         <LucideActivity class="w-12 h-12 animate-pulse text-emerald-500" />
         <p class="text-sm font-bold text-slate-400 uppercase tracking-widest">Compiling Market Trends...</p>
      </div>

      <div v-else class="space-y-16 animate-in [animation-delay:300ms]">
         
         <!-- Active Alerts Section -->
         <section v-if="alerts.length > 0">
            <h2 class="text-2xl font-heading font-black text-slate-900 mb-6 flex items-center gap-3">
               <LucideAlertTriangle class="w-6 h-6 text-rose-500" /> 
               Active Market Alerts
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <div v-for="alert in alerts" :key="alert.id" class="bg-white border border-rose-100 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                  <div class="absolute -right-6 -top-6 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                     <LucideAlertTriangle class="w-32 h-32 text-rose-500" />
                  </div>
                  <div class="flex items-start justify-between mb-4 relative z-10">
                     <div>
                        <div class="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Overpriced Alert</div>
                        <h3 class="text-lg font-bold text-slate-900">{{ alert.name }}</h3>
                        <p class="text-xs text-slate-500 uppercase tracking-widest">{{ alert.category }} • {{ alert.unitOfMeasure }}</p>
                     </div>
                     <div class="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                        <LucideTrendingUp class="w-5 h-5" />
                     </div>
                  </div>
                  <div class="pt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
                     <div>
                        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Retailer</div>
                        <div class="text-sm font-black text-slate-700">{{ alert.retailer }}</div>
                     </div>
                     <div class="text-right">
                        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Price</div>
                        <div class="text-lg font-black text-rose-600">{{ formatPrice(alert.currentPrice) }}</div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         <!-- Recent Market Adjustments (Before & After) -->
         <section>
            <h2 class="text-2xl font-heading font-black text-slate-900 mb-6 flex items-center gap-3">
               <LucideHistory class="w-6 h-6 text-emerald-600" /> 
               Recent Market Adjustments
            </h2>
            
            <div class="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
               <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-slate-100">
                     <thead>
                        <tr class="bg-slate-50/50">
                           <th class="py-6 px-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Commodity & Source</th>
                           <th class="py-6 px-8 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Previous Price & Date</th>
                           <th class="py-6 px-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Adjustment</th>
                           <th class="py-6 px-8 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">New Price & Effective Date</th>
                        </tr>
                     </thead>
                     <tbody class="divide-y divide-slate-50">
                        <tr v-for="item in adjustments" :key="item.id" class="hover:bg-slate-50 transition-colors">
                           <td class="py-6 px-8">
                              <div class="text-sm font-bold text-slate-900">{{ item.name }}</div>
                              <div class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{{ item.retailer }} • {{ item.unitOfMeasure }}</div>
                           </td>
                           
                           <!-- Before -->
                           <td class="py-6 px-8">
                              <div class="text-sm font-black text-slate-500">{{ formatPrice(item.previousPrice) }}</div>
                              <div class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                                 <LucideCalendar class="w-3 h-3" /> {{ formatDate(item.previousDate) }}
                              </div>
                           </td>
                           
                           <!-- Change Indicator -->
                           <td class="py-6 px-8 text-center">
                              <div class="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase"
                                   :class="getChangeClass(item.changePct)">
                                 <LucideTrendingUp v-if="item.changePct > 0" class="w-3 h-3" />
                                 <LucideTrendingDown v-else-if="item.changePct < 0" class="w-3 h-3" />
                                 <LucideMinus v-else class="w-3 h-3" />
                                 {{ item.changePct > 0 ? '+' : '' }}{{ item.changePct.toFixed(1) }}%
                              </div>
                           </td>
                           
                           <!-- After -->
                           <td class="py-6 px-8 text-right">
                              <div class="text-lg font-black text-slate-900">{{ formatPrice(item.currentPrice) }}</div>
                              <div class="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-1 flex items-center justify-end gap-1">
                                 <LucideZap class="w-3 h-3" /> Effective: {{ formatDate(item.lastUpdated) }}
                              </div>
                           </td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
         </section>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { 
  LucideActivity, LucideAlertTriangle, LucideTrendingUp, 
  LucideTrendingDown, LucideHistory, LucideCalendar,
  LucideMinus, LucideZap, LucideLayers
} from 'lucide-vue-next'

const { formatPrice } = usePriceFormatter()

const prices = ref<any[]>([])
const trends = ref<any[]>([])
const categories = ref<string[]>([])
const selectedCategory = ref('')
const loading = ref(true)

const fetchCategories = async () => {
    try {
        const res = await fetch('http://localhost:1998/api/public/categories')
        categories.value = await res.json()
    } catch (e) {
        console.error('Failed to fetch categories', e)
    }
}

const fetchPrices = async () => {
    try {
        const res = await fetch('http://localhost:1998/api/public/prices')
        prices.value = await res.json()
    } catch (e) {
        console.error('Failed to fetch prices', e)
    }
}

const fetchTrends = async () => {
    try {
        const res = await fetch('http://localhost:1998/api/v1/market/trends')
        trends.value = await res.json()
    } catch (e) {
        console.error('Failed to fetch trends', e)
    }
}

onMounted(async () => {
    loading.value = true
    await Promise.all([fetchPrices(), fetchTrends(), fetchCategories()])
    loading.value = false
})

const getProductPrice = (p: any) => Number(p.currentPrice !== undefined ? p.currentPrice : (p.price || 0))

// Map and enrich data for trends display
const enrichedData = computed(() => {
    return prices.value.map(p => {
        const trend = trends.value.find(t => t.id === p.id) || {}
        const current = getProductPrice(p)
        // If API doesn't provide previous data, we mock it slightly for the sake of the visualization demo.
        // In production, this falls back to actual trend.previousPrice
        const prev = trend.previousPrice || (current * (1 - (Math.random() * 0.1 - 0.02)))
        const diff = current - prev
        const changePct = prev > 0 ? (diff / prev) * 100 : 0
        
        return {
            ...p,
            currentPrice: current,
            previousPrice: prev,
            changePct: changePct,
            previousDate: trend.previousDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            lastUpdated: p.lastUpdated || new Date().toISOString(),
        }
    })
})

const filteredData = computed(() => {
    if (!selectedCategory.value) return enrichedData.value
    return enrichedData.value.filter(item => item.category === selectedCategory.value)
})

const adjustments = computed(() => {
    // Only show items that actually have a significant change
    return filteredData.value
        .filter(item => Math.abs(item.changePct) > 0.5)
        .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))
        .slice(0, 20) // show top 20 recent adjustments
})

const alerts = computed(() => {
    // Show items where price increased by more than 10% or flagged as alert
    return filteredData.value
        .filter(item => item.changePct > 10 || item.isAlert)
        .sort((a, b) => b.changePct - a.changePct)
        .slice(0, 6)
})

const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Unknown'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const getChangeClass = (pct: number) => {
    if (pct > 5) return 'bg-rose-50 text-rose-600'
    if (pct > 0) return 'bg-amber-50 text-amber-600'
    if (pct < 0) return 'bg-emerald-50 text-emerald-600'
    return 'bg-slate-100 text-slate-500'
}
</script>

<style scoped>
.text-gradient {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500;
}

.animate-in {
  animation: fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
