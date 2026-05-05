<template>
  <div class="min-h-screen bg-slate-50 py-20 px-6">
    <div class="max-w-7xl mx-auto space-y-16">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold tracking-widest uppercase mb-4 animate-in">
             Market Transparency Hub
          </div>
          <h1 class="text-4xl md:text-6xl font-heading font-black text-slate-900 tracking-tighter leading-none">
            Price <span class="text-gradient">Comparison</span> Matrix
          </h1>
          <p class="text-slate-500 max-w-2xl text-lg mt-4 font-medium italic">
            "Eliminating information asymmetry through real-time cross-retailer audits."
          </p>
        </div>
        
        <div class="flex gap-4">
           <button @click="triggerAiAudit" :disabled="auditing" class="group bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 disabled:opacity-50">
              <LucideBrainDeep :class="{ 'animate-pulse text-emerald-400': auditing }" class="w-5 h-5" />
              <span>{{ auditing ? 'AI Auditing Market...' : 'Run Smart AI Audit' }}</span>
           </button>
        </div>
      </div>

      <!-- AI Audit Result -->
      <div v-if="aiAuditResult" class="bg-emerald-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl animate-in">
         <div class="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
            <LucideBrain class="w-48 h-48" />
         </div>
         <div class="relative z-10 max-w-4xl">
            <div class="flex items-center gap-3 mb-6">
               <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <LucideZap class="w-4 h-4" />
               </div>
               <span class="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200">AI Intelligence Brief (Ollama)</span>
            </div>
            <p class="text-2xl font-heading font-bold leading-tight opacity-90">
               "{{ aiAuditResult }}"
            </p>
         </div>
      </div>

      <!-- Fuel Section -->
      <section class="space-y-8 animate-in" style="animation-delay: 100ms">
        <div class="flex items-center justify-between">
           <h2 class="text-2xl font-heading font-black text-slate-900 flex items-center gap-3">
             <LucideFuel class="w-8 h-8 text-emerald-600" />
             Strategic Fuel Index
           </h2>
           <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live National Updates</span>
        </div>

        <div class="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
           <div class="overflow-x-auto">
              <table class="w-full">
                 <thead>
                    <tr class="bg-slate-50/80 border-b border-slate-100">
                       <th class="py-8 px-10 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Fuel Node</th>
                       <th v-for="source in fuelSources" :key="source" class="py-8 px-10 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          {{ source }}
                       </th>
                    </tr>
                 </thead>
                 <tbody class="divide-y divide-slate-50">
                    <tr v-for="product in fuelProducts" :key="product" class="group hover:bg-slate-50/50 transition-all">
                       <td class="py-8 px-10">
                          <div class="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{{ product }}</div>
                          <div class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Regulated vs Open Market</div>
                       </td>
                       <td v-for="source in fuelSources" :key="source" class="py-8 px-10 text-right">
                          <div v-if="getMatrixValue(fuelPrices, product, source)" class="space-y-1">
                             <div class="text-lg font-heading font-black text-slate-900">
                                {{ formatPrice(getMatrixValue(fuelPrices, product, source)) }}
                             </div>
                             <div v-if="isOutlier(fuelPrices, product, source)" class="text-[8px] font-black text-rose-500 uppercase tracking-tighter bg-rose-50 px-1.5 py-0.5 rounded-full inline-block">High Variance</div>
                          </div>
                          <div v-else class="text-slate-200 font-black">--</div>
                       </td>
                    </tr>
                 </tbody>
              </table>
           </div>
        </div>
      </section>

      <!-- Groceries Section -->
      <section class="space-y-8 animate-in" style="animation-delay: 200ms">
        <div class="flex items-center justify-between">
           <h2 class="text-2xl font-heading font-black text-slate-900 flex items-center gap-3">
             <LucideShoppingBag class="w-8 h-8 text-emerald-600" />
             Essential Commodities Matrix
           </h2>
           <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Major Retail Chain Comparison</span>
        </div>

        <div class="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
           <div class="overflow-x-auto">
              <table class="w-full">
                 <thead>
                    <tr class="bg-slate-50/80 border-b border-slate-100">
                       <th class="py-8 px-10 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Commodity & Unit</th>
                       <th v-for="source in grocerySources" :key="source" class="py-8 px-10 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          {{ source }}
                       </th>
                    </tr>
                 </thead>
                 <tbody class="divide-y divide-slate-50">
                    <tr v-for="product in groceryProducts" :key="product" class="group hover:bg-slate-50/50 transition-all">
                       <td class="py-8 px-10">
                          <div class="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{{ product }}</div>
                          <div class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Basic Essentials</div>
                       </td>
                       <td v-for="source in grocerySources" :key="source" class="py-8 px-10 text-right">
                          <div v-if="getMatrixValue(groceryPrices, product, source)" class="space-y-1">
                             <div class="text-base font-heading font-black text-slate-900">
                                {{ formatPrice(getMatrixValue(groceryPrices, product, source)) }}
                             </div>
                             <div v-if="isOutlier(groceryPrices, product, source)" class="text-[8px] font-black text-rose-500 uppercase tracking-tighter bg-rose-50 px-1.5 py-0.5 rounded-full inline-block">Anomalous</div>
                          </div>
                          <div v-else class="text-slate-200 font-black">--</div>
                       </td>
                    </tr>
                 </tbody>
              </table>
           </div>
        </div>
      </section>

      <!-- Comparison Footer Note -->
      <div class="text-center py-10">
         <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Global Transparency Node v4.2.1 • All prices in USD</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { 
  LucideFuel, LucideShoppingBag, LucideZap, LucideBrainCircuit as LucideBrainDeep, 
  LucideBrain, LucideActivity, LucideArrowRight, LucideInfo
} from 'lucide-vue-next'

const { formatPrice } = usePriceFormatter()

const prices = ref([])
const loading = ref(true)
const auditing = ref(false)
const aiAuditResult = ref('')

const fetchPrices = async () => {
    loading.value = true
    try {
        const res = await fetch('http://localhost:1998/api/public/prices')
        prices.value = await res.json()
    } catch (e) {
        console.error('Failed to fetch prices', e)
    } finally {
        loading.value = false
    }
}

const triggerAiAudit = async () => {
    auditing.value = true
    try {
        // First trigger refresh
        await $fetch('http://localhost:1998/api/v1/market/ai-insights/refresh', { method: 'POST' })
        // Wait bit then fetch
        setTimeout(async () => {
            const res = await $fetch('http://localhost:1998/api/v1/market/ai-insights')
            aiAuditResult.value = res.insight
            auditing.value = false
        }, 3000)
    } catch (e) {
        aiAuditResult.value = 'AI Audit Hub is currently unreachable. Regional nodes remain operational.'
        auditing.value = false
    }
}

// Data Processing
const fuelPrices = computed(() => prices.value.filter(p => p.category === 'FUEL'))
const groceryPrices = computed(() => prices.value.filter(p => 
    p.category === 'RETAIL' || 
    p.category === 'AGRICULTURE' || 
    p.category.includes('Markets') || 
    p.category.includes('Grain')
))

const fuelSources = computed(() => {
    const sources = [...new Set(fuelPrices.value.map(p => p.retailer))].sort()
    // Prioritize major ones if many exist, but here we show all
    return sources
})

const fuelProducts = computed(() => [...new Set(fuelPrices.value.map(p => p.name))].sort())

const grocerySources = computed(() => {
    // Explicitly prioritize local supermarkets as requested by the user
    const prioritySources = [
        'TM Pick n Pay', 'OK Zimbabwe', 'Pick n Pay', 
        'Spar Zimbabwe', 'Choppies', 'Gain Cash & Carry', 'GMB'
    ]
    
    const allRetailers = [...new Set(groceryPrices.value.map(p => p.retailer))]
    
    // Return priority sources first, then others if space permits
    const result = prioritySources.filter(s => allRetailers.includes(s))
    
    // Add other retailers that have data but are not in priority list (up to 10 columns total)
    const others = allRetailers.filter(s => !prioritySources.includes(s) && s !== 'Numbeo')
    return [...result, ...others].slice(0, 10)
})

const groceryProducts = computed(() => {
    const sources = grocerySources.value
    // Filter to products that actually exist in these retailers
    const relevantPrices = groceryPrices.value.filter(p => sources.includes(p.retailer))
    const prods = [...new Set(relevantPrices.map(p => p.name))].sort()
    
    // Filter out very long strings or non-commodity names if any (Numbeo has some long ones)
    return prods.filter(name => name.length < 50)
})

const getMatrixValue = (dataList, productName, sourceName) => {
    const item = dataList.find(p => p.name === productName && p.retailer === sourceName)
    return item ? (item.currentPrice || item.price) : null
}

const isOutlier = (dataList, productName, sourceName) => {
    const vals = dataList.filter(p => p.name === productName).map(p => (p.currentPrice || p.price))
    if (vals.length < 2) return false
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length
    const current = getMatrixValue(dataList, productName, sourceName)
    if (!current) return false
    return Math.abs(current - avg) / avg > 0.15 // 15% variance
}

onMounted(() => {
    fetchPrices()
})
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
