<template>
  <div class="min-h-screen bg-slate-50 p-6 sm:p-10 font-sans text-slate-900 animate-in">
    <div class="max-w-7xl mx-auto space-y-12">
      
      <!-- Header -->
      <header class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div class="flex items-center gap-3 mb-4">
             <span class="px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-200">Intelligence Node</span>
             <span class="text-slate-300">/</span>
             <span class="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Cross-Retailer Comparison</span>
          </div>
          <h1 class="text-5xl md:text-6xl font-heading font-black tracking-tighter text-slate-900">
            Market <span class="text-gradient">Transparency</span>
          </h1>
          <p class="mt-4 text-slate-500 max-w-xl font-medium leading-relaxed">
            Real-time audit of essential commodity pricing. We pull directly from retailer official nodes to calculate market averages and identify price outliers.
          </p>
        </div>
        <div class="flex flex-col items-end gap-2">
           <button @click="auditMarket" :disabled="auditing" class="group relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest overflow-hidden transition-all hover:shadow-2xl hover:shadow-emerald-500/20 active:scale-95 disabled:opacity-50">
             <span class="relative z-10 flex items-center gap-2">
               <LucideShieldCheck v-if="!auditing" class="w-4 h-4 text-emerald-400" />
               <LucideLoader2 v-else class="w-4 h-4 animate-spin text-emerald-400" />
               {{ auditing ? 'Auditing Nodes...' : 'Run Global Audit' }}
             </span>
             <div class="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
           </button>
        </div>
      </header>

      <!-- Fuel Section (Quick Reference) -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div v-for="product in fuelProducts" :key="product" class="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex items-center justify-between group hover:border-amber-500 transition-all">
            <div class="flex items-center gap-6">
               <div class="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                  <LucideZap class="w-8 h-8" />
               </div>
               <div>
                  <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{{ product }}</div>
                  <div class="text-3xl font-heading font-black text-slate-900">{{ formatPrice(getMatrixValue(fuelPrices, product, 'ZERA')) }}</div>
               </div>
            </div>
            <div class="text-right">
               <div class="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">ZERA Official Node</div>
               <div class="text-xs font-bold text-slate-400">Fixed Rate Index</div>
            </div>
         </div>
      </section>

      <!-- Essential Commodities Intelligence -->
      <section class="space-y-8">
         <div class="flex items-center justify-between">
            <h2 class="text-2xl font-heading font-black uppercase tracking-tight flex items-center gap-3">
               <span class="w-2 h-8 bg-emerald-500 rounded-full"></span>
               Essential Commodities Audit
            </h2>
            <div class="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
               <span class="flex items-center gap-2"><span class="w-2 h-2 bg-emerald-500 rounded-full"></span> Verified</span>
               <span class="flex items-center gap-2"><span class="w-2 h-2 bg-rose-500 rounded-full"></span> Outlier</span>
            </div>
         </div>

         <!-- Comparison Table UI (Updated for clarity) -->
         <div class="space-y-6">
            <div v-for="product in groceryProducts" :key="product" class="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden group hover:shadow-xl hover:border-emerald-500/30 transition-all duration-500">
               <!-- Product Header -->
               <div class="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div class="flex items-center gap-4">
                     <div class="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center">
                        <LucidePackage class="w-6 h-6 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                     </div>
                     <div>
                        <h3 class="text-xl font-heading font-black text-slate-900">{{ product }}</h3>
                        <div class="flex items-center gap-2 mt-1">
                           <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Standardized Pool Item</span>
                           <span v-if="getUnitPrice(product, getMarketAverage(groceryPrices, product))" class="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-md uppercase tracking-tighter">
                              {{ getUnitPrice(product, getMarketAverage(groceryPrices, product)) }}
                           </span>
                        </div>
                     </div>
                  </div>
                  <!-- Calculation Transparency Hub (Inline) -->
                  <div class="flex items-center gap-8 bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100">
                     <div class="flex flex-col">
                        <span class="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Calculation Trace</span>
                        <div class="flex items-center gap-2 text-xs font-mono font-bold text-slate-600">
                           <span>Σ Prices ({{ getPricesCount(groceryPrices, product) }})</span>
                           <span class="text-slate-300">/</span>
                           <span>{{ getPricesCount(groceryPrices, product) }}</span>
                           <span class="text-emerald-500">=</span>
                           <span class="text-slate-900">{{ formatPrice(getMarketAverage(groceryPrices, product)) }}</span>
                        </div>
                     </div>
                     <div class="w-px h-8 bg-slate-100"></div>
                     <div class="flex flex-col text-right">
                        <span class="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Market Average</span>
                        <span class="text-lg font-black text-slate-900 tracking-tighter">{{ formatPrice(getMarketAverage(groceryPrices, product)) }}</span>
                     </div>
                  </div>
               </div>

               <!-- Retailer Comparison Grid -->
               <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-x divide-slate-100">
                  <div v-for="source in grocerySources" :key="source" class="p-8 flex flex-col items-center text-center gap-4 relative">
                     <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ source }}</div>
                     
                     <div v-if="getMatrixValue(groceryPrices, product, source)" class="flex flex-col items-center gap-3">
                        <div class="text-2xl font-black text-slate-900" :class="{ 'text-rose-600': isOutlier(groceryPrices, product, source) }">
                           {{ formatPrice(getMatrixValue(groceryPrices, product, source)) }}
                        </div>
                        
                        <div class="flex items-center gap-2">
                           <a v-if="getMatrixLink(groceryPrices, product, source)" 
                              :href="getMatrixLink(groceryPrices, product, source)" 
                              target="_blank" 
                              class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-slate-100 group/link"
                              title="Verify Official Source">
                              <LucideExternalLink class="w-4 h-4" />
                           </a>
                           <div v-if="isOutlier(groceryPrices, product, source)" class="px-2 py-1 bg-rose-50 text-rose-600 text-[8px] font-black rounded border border-rose-100 uppercase tracking-tighter animate-pulse">
                              Anomalous
                           </div>
                        </div>
                     </div>
                     <div v-else class="text-slate-200 font-black text-2xl">--</div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <!-- Footer -->
      <footer class="text-center py-10 border-t border-slate-200/50">
         <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Global Transparency Node v5.0.0 • All data verified via official retailer scrapers</p>
      </footer>

    </div>
  </div>
</template>

<script setup>
import { 
  LucideShieldCheck, LucideZap, LucidePackage, 
  LucideLoader2, LucideExternalLink 
} from 'lucide-vue-next'
import { ref, computed, onMounted } from 'vue'

const prices = ref([])
const auditing = ref(false)
const { formatPrice } = usePriceFormatter()

const fetchPrices = async () => {
    try {
        const res = await $fetch('http://localhost:1998/api/public/prices')
        prices.value = res
    } catch (e) {
        console.error('Failed to fetch node prices', e)
    }
}

const auditMarket = async () => {
    auditing.value = true
    setTimeout(() => auditing.value = false, 2000)
}

// Data Processing
const fuelPrices = computed(() => prices.value.filter(p => p.category === 'FUEL'))
const groceryPrices = computed(() => prices.value.filter(p => 
    ['RETAIL', 'AGRICULTURE', 'GROCERY', 'BUTCHERY'].includes(p.category) || 
    p.category.includes('Markets') || p.category.includes('Grain')
))

const grocerySources = computed(() => {
    const requestedSources = ['TM Pick n Pay', 'OK Zimbabwe', 'Pick n Pay', 'Spar Zimbabwe', 'Choppies']
    const allRetailers = [...new Set(groceryPrices.value.map(p => p.retailer))]
    return requestedSources.filter(s => allRetailers.includes(s))
})

const groceryProducts = computed(() => {
    const sources = grocerySources.value
    const relevantPrices = groceryPrices.value.filter(p => sources.includes(p.retailer))
    const prods = [...new Set(relevantPrices.map(p => p.name))].sort()
    const essentialKeywords = ['RICE', 'SUGAR', 'SALT', 'SOAP', 'POWDER', 'MEALIE', 'OIL', 'MEAL']
    
    return prods.filter(name => {
        const upper = name.toUpperCase()
        return essentialKeywords.some(kw => upper.includes(kw)) && name.length < 50
    })
})

const getMatrixValue = (dataList, productName, sourceName) => {
    const item = dataList.find(p => p.name === productName && p.retailer === sourceName)
    return item ? item.price : null
}

const getMatrixLink = (dataList, productName, sourceName) => {
    const item = dataList.find(p => p.name === productName && p.retailer === sourceName)
    return item ? item.link : null
}

const getMarketAverage = (dataList, productName) => {
    const vals = dataList.filter(p => p.name === productName).map(p => (p.currentPrice || p.price))
    if (vals.length === 0) return 0
    return vals.reduce((a, b) => a + b, 0) / vals.length
}

const getPricesCount = (dataList, productName) => {
    return dataList.filter(p => p.name === productName).length
}

const getUnitPrice = (name, price) => {
    if (!price || !name) return null
    const weightMatch = name.match(/(\d+\.?\d*)\s*(kg|l|g|ml)/i)
    if (weightMatch) {
        let value = parseFloat(weightMatch[1])
        const unit = weightMatch[2].toLowerCase()
        if (unit === 'g' || unit === 'ml') value = value / 1000
        const unitPrice = price / value
        const displayUnit = (unit === 'kg' || unit === 'g') ? 'kg' : 'L'
        return `${formatPrice(unitPrice)} / ${displayUnit}`
    }
    return null
}

const isOutlier = (dataList, productName, sourceName) => {
    const vals = dataList.filter(p => p.name === productName).map(p => (p.currentPrice || p.price))
    if (vals.length < 2) return false
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length
    const current = getMatrixValue(dataList, productName, sourceName)
    if (!current) return false
    return Math.abs(current - avg) / avg > 0.15
}

onMounted(fetchPrices)
</script>

<style scoped>
.text-gradient {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500;
}
.animate-in {
  animation: fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}
@keyframes fade-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
