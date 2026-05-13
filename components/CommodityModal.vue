<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="close"></div>
    
    <!-- Modal Content -->
    <div class="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col animate-in overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
        <div>
          <h2 class="text-2xl font-heading font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
              <LucideLayers class="w-5 h-5" />
            </span>
            {{ category }} Analysis
          </h2>
          <p class="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Cross-Retailer Variance & Fairness</p>
        </div>
        <button @click="close" class="p-2 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all border border-slate-200">
          <LucideX class="w-5 h-5" />
        </button>
      </div>

      <!-- Scrollable Body -->
      <div class="flex-grow overflow-y-auto p-6 space-y-8 bg-slate-50">
        
        <!-- Stats Row -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Average Price</div>
            <div class="text-2xl font-black text-slate-900">{{ formatPrice(stats.avg) }}</div>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Lowest Market</div>
            <div class="text-2xl font-black text-emerald-600">{{ formatPrice(stats.min) }}</div>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div class="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-1">Highest Market</div>
            <div class="text-2xl font-black text-rose-600">{{ formatPrice(stats.max) }}</div>
          </div>
          <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Overall Fairness</div>
            <div class="text-lg font-black" :class="fairness.color">{{ fairness.text }}</div>
          </div>
        </div>

        <!-- Chart Section -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
           <div class="mb-4">
             <h3 class="text-lg font-heading font-black text-slate-900">Provider Variance Visualized</h3>
             <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pricing distribution across major retailers</p>
           </div>
           <div class="h-[250px] w-full relative">
              <div class="flex items-stretch h-full gap-2 pt-10">
                 <div v-for="provider in providerAverages" :key="provider.name" class="flex-1 flex flex-col justify-end group relative h-full">
                    
                    <div class="w-full flex-grow flex items-end relative">
                      <!-- Tooltip -->
                      <div class="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none z-10 shadow-lg left-1/2 -translate-x-1/2">
                        {{ formatPrice(provider.avg) }}
                      </div>
                      
                      <div class="w-full rounded-t-xl transition-all duration-500 hover:opacity-80"
                           :style="{ 
                             height: `${Math.max(5, (provider.avg / (stats.max || 1)) * 100)}%`,
                             backgroundColor: getProviderColor(provider.avg, stats.avg)
                           }">
                      </div>
                    </div>
                    
                    <div class="w-full mt-2 h-4 shrink-0 text-center text-[9px] font-black text-slate-500 uppercase truncate px-1" :title="provider.name">
                      {{ provider.name }}
                    </div>
                 </div>
              </div>
           </div>
           
           <div class="flex items-center gap-6 mt-6 pt-6 border-t border-slate-100 justify-center text-[10px] font-bold uppercase tracking-widest">
              <div class="flex items-center gap-2 text-emerald-600">
                <span class="w-3 h-3 rounded bg-emerald-500"></span> Excellent/Fair Value
              </div>
              <div class="flex items-center gap-2 text-amber-600">
                <span class="w-3 h-3 rounded bg-amber-500"></span> Moderate Variance
              </div>
              <div class="flex items-center gap-2 text-rose-600">
                <span class="w-3 h-3 rounded bg-rose-500"></span> High/Overpriced
              </div>
           </div>
        </div>
        
        <!-- Analytical Transparency Hub -->
        <div class="bg-slate-900 rounded-2xl p-6 text-slate-300 font-mono text-xs shadow-xl border border-slate-800">
          <div class="flex items-center gap-3 mb-4 text-emerald-400">
            <LucideCode class="w-4 h-4" />
            <span class="text-[10px] font-black uppercase tracking-[0.2em]">Analytical Transparency Hub</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-4">
               <div>
                 <div class="text-[9px] text-slate-500 mb-1">MARKET_AVG_CALCULATION</div>
                 <div class="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span class="text-slate-400">Sum(Prices) / n</span>
                    <span class="text-white font-bold">{{ formatPrice(stats.avg) }}</span>
                 </div>
               </div>
               <div>
                 <div class="text-[9px] text-slate-500 mb-1">VARIANCE_INDEX_MATH</div>
                 <div class="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span class="text-slate-400">(Max - Min) / Avg</span>
                    <span class="text-white font-bold">{{ ((stats.max - stats.min) / (stats.avg || 1) * 100).toFixed(1) }}%</span>
                 </div>
               </div>
            </div>
            <div class="space-y-4">
               <div>
                 <div class="text-[9px] text-slate-500 mb-1">STABILITY_ALGORITHM</div>
                 <div class="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span class="text-slate-400">1.0 - (Variance / 1.0)</span>
                    <span class="font-bold" :class="fairness.color">{{ (100 - (stats.max - stats.min) / (stats.avg || 1) * 100).toFixed(1) }}% Stability</span>
                 </div>
               </div>
               <div>
                 <div class="text-[9px] text-slate-500 mb-1">RISK_THRESHOLD_PROTOCOL</div>
                 <div class="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span class="text-slate-400">Mapped Status</span>
                    <span class="font-bold uppercase tracking-widest text-[10px]" :class="fairness.color">{{ fairness.text }}</span>
                 </div>
               </div>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-[8px] text-slate-500">
            <span>DATASET_SIZE: {{ products.length }} ENTRIES</span>
            <span>ALGORITHM_VERSION: 2.1.0-STABLE</span>
          </div>
        </div>

        <!-- Detailed Provider List -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-6 border-b border-slate-100 bg-slate-50/50">
             <h3 class="text-lg font-heading font-black text-slate-900">Detailed Product Listings</h3>
          </div>
          <div class="overflow-x-auto">
             <table class="min-w-full divide-y divide-slate-100">
                <thead>
                  <tr class="bg-white">
                    <th class="py-4 px-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                    <th class="py-4 px-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Retailer</th>
                    <th class="py-4 px-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk/Alert</th>
                    <th class="py-4 px-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                    <th class="py-4 px-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Source</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-50 bg-white">
                  <tr v-for="group in groupedProducts" :key="group.name" class="hover:bg-slate-50 transition-colors">
                    <td class="py-4 px-6">
                      <div class="text-sm font-bold text-slate-900">{{ group.name }}</div>
                      <div class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{{ group.brand }} • {{ group.unit }}</div>
                      <div v-if="group.retailers.length > 1" class="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-tighter">
                         <LucideLayers class="w-2.5 h-2.5" /> Found in {{ group.retailers.length }} shops
                      </div>
                    </td>
                    <td class="py-4 px-6">
                      <div class="space-y-2">
                         <div v-for="item in group.retailers" :key="item.retailer" class="flex items-center justify-between gap-4">
                            <div class="text-xs font-bold text-slate-700 flex items-center gap-2">
                               {{ item.retailer }}
                               <span v-if="isVerifiedSource(item.retailer)" class="w-1 h-1 bg-emerald-500 rounded-full"></span>
                            </div>
                            <div class="flex items-center gap-3">
                               <div class="text-sm font-black text-slate-900">{{ formatPrice(item.price) }}</div>
                               <a v-if="item.link" :href="item.link" target="_blank" class="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors">
                                  <LucideExternalLink class="w-3 h-3" />
                               </a>
                            </div>
                         </div>
                      </div>
                    </td>
                    <td class="py-4 px-6 text-right">
                       <div class="flex flex-col items-end gap-1">
                          <div v-if="group.retailers.length > 1" class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                             Var: {{ ((group.max - group.min) / group.min * 100).toFixed(1) }}%
                          </div>
                          <span v-if="group.max > stats.avg * 1.15" class="inline-flex items-center gap-1 text-[9px] font-black bg-rose-50 text-rose-600 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                            <LucideAlertTriangle class="w-3 h-3" /> Potential Gouging
                          </span>
                          <span v-else class="inline-flex items-center gap-1 text-[9px] font-black bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                            <LucideShieldCheck class="w-3 h-3" /> Stable Market
                          </span>
                       </div>
                    </td>
                    <td class="py-4 px-6 text-right">
                       <div class="text-lg font-black text-slate-900">{{ formatPrice(group.min) }}</div>
                       <div class="text-[8px] font-bold text-emerald-600 uppercase">Best Price</div>
                    </td>
                    <td class="py-4 px-6 text-center">
                       <div class="w-2 h-2 rounded-full mx-auto" :class="group.retailers.length > 1 ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-200'"></div>
                    </td>
                  </tr>
                </tbody>
             </table>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { LucideX, LucideLayers, LucideAlertTriangle, LucideShieldCheck, LucideExternalLink, LucideCode } from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean,
  category: String,
  products: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}

const { formatPrice, isVerifiedSource } = usePriceFormatter()

const getProductPrice = (p) => Number(p.currentPrice !== undefined ? p.currentPrice : (p.price || 0))

const stats = computed(() => {
  if (!props.products || props.products.length === 0) return { min: 0, max: 0, avg: 0 }
  const pricesList = props.products.map(p => getProductPrice(p)).filter(p => !isNaN(p) && p > 0)
  if (pricesList.length === 0) return { min: 0, max: 0, avg: 0 }
  
  const min = Math.min(...pricesList)
  const max = Math.max(...pricesList)
  const avg = pricesList.reduce((a, b) => a + b, 0) / pricesList.length
  
  return { min, max, avg }
})

const groupedProducts = computed(() => {
  const groups = {}
  props.products.forEach(p => {
    const name = p.name
    if (!groups[name]) {
      groups[name] = {
        name: p.name,
        brand: p.brand,
        unit: p.unitOfMeasure,
        retailers: [],
        min: Infinity,
        max: -Infinity
      }
    }
    const price = getProductPrice(p)
    groups[name].retailers.push({
      retailer: p.retailer,
      price: price,
      link: p.link
    })
    groups[name].min = Math.min(groups[name].min, price)
    groups[name].max = Math.max(groups[name].max, price)
  })
  return Object.values(groups).sort((a, b) => b.retailers.length - a.retailers.length)
})

const providerAverages = computed(() => {
  const providerMap = {}
  props.products.forEach(p => {
    if (!providerMap[p.retailer]) providerMap[p.retailer] = []
    providerMap[p.retailer].push(getProductPrice(p))
  })
  
  return Object.keys(providerMap).map(name => {
    const pricesList = providerMap[name]
    const avg = pricesList.reduce((a, b) => a + b, 0) / (pricesList.length || 1)
    return { name, avg }
  }).sort((a, b) => a.avg - b.avg)
})

const fairness = computed(() => {
  if (stats.value.avg === 0) return { text: 'Unknown', color: 'text-slate-400' }
  const variance = stats.value.max - stats.value.min
  const variancePct = variance / stats.value.avg
  
  if (variancePct < 0.1) return { text: 'Highly Stable', color: 'text-emerald-500' }
  if (variancePct < 0.25) return { text: 'Moderate Variance', color: 'text-amber-500' }
  return { text: 'High Risk/Gouging', color: 'text-rose-500' }
})

const isOverpriced = (price, avgPrice) => {
  if (!avgPrice) return false;
  // Consider overpriced if > 15% above average
  return price > (avgPrice * 1.15)
}

const getProviderColor = (price, avgPrice) => {
  if (!avgPrice) return '#10b981' // emerald-500
  if (price > avgPrice * 1.15) return '#f43f5e' // rose-500
  if (price > avgPrice * 1.05) return '#f59e0b' // amber-500
  return '#10b981' // emerald-500
}
</script>

<style scoped>
.animate-in {
  animation: modal-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes modal-in {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
