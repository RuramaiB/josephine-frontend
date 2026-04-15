<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { 
  LucideZap, LucidePackage, LucideAlertTriangle, 
  LucidePackageSearch, LucideLoader2,
  LucideTrendingUp, LucideTrendingDown
} from 'lucide-vue-next'

const { formatPrice } = usePriceFormatter()

const navLinks = [
  { name: 'Market Overview', href: '#market-overview' },
  { name: 'Trends', href: '#trends' },
  { name: 'API Access', href: '#api' },
]

interface ProductPriceResponse {
  id: string;
  name: string;
  brand: string;
  category: string;
  unitOfMeasure: string;
  currentPrice: number;
  retailer: string;
  region: string;
  lastUpdated: string;
}

const prices = ref<ProductPriceResponse[]>([])
const stats = ref({
  totalRecords: 0,
  activeAlerts: 0,
  averageMarketRisk: 0,
  sourcesCount: 0
})
const categories = ref([])
const selectedCategory = ref('')
const loading = ref(true)

const fetchPrices = async () => {
  try {
    const url = selectedCategory.value 
      ? `http://localhost:1998/api/public/prices?category=${selectedCategory.value}`
      : 'http://localhost:1998/api/public/prices'
    const res = await fetch(url)
    prices.value = await res.json()
  } catch (e) {
    console.error('Failed to fetch prices', e)
  }
}

const fetchStats = async () => {
  try {
    const res = await fetch('http://localhost:1998/api/public/stats')
    stats.value = await res.json()
  } catch (e) {
     console.error('Failed to fetch stats', e)
  }
}

const fetchCategories = async () => {
  try {
    const res = await fetch('http://localhost:1998/api/public/categories')
    categories.value = await res.json()
  } catch (e) {
    console.error('Failed to fetch categories', e)
  }
}

const trends = ref([])
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
  try {
    await Promise.all([fetchPrices(), fetchStats(), fetchCategories(), fetchTrends()])
  } catch (e) {
    console.error('Initial data fetch failed', e)
  } finally {
    loading.value = false
  }

  // Refresh data every 30 seconds
  const interval = setInterval(async () => {
    try {
        await Promise.all([fetchPrices(), fetchStats(), fetchCategories(), fetchTrends()])
    } catch (e) {
        console.error('Periodic refresh failed', e)
    }
  }, 30000)

  onUnmounted(() => {
    clearInterval(interval)
  })
})

const getTrendFor = (productId: string) => {
  return (trends.value || []).find(t => t.id === productId)
}

const { isVerifiedSource } = usePriceFormatter()

const groupedPrices = computed(() => {
  const groups: Record<string, ProductPriceResponse[]> = {}
  
  // For demonstration: Priority commodities (Fuel, Mealie-meal, Sugar) or National Hub
  const demonstrationPrices = prices.value.filter(p => {
    const s = p.retailer.toUpperCase()
    const n = p.name.toLowerCase()
    return isVerifiedSource(p.retailer) || 
           n.includes('fuel') || 
           n.includes('meal') || 
           n.includes('sugar')
  })

  demonstrationPrices.forEach(p => {
    if (!groups[p.category]) groups[p.category] = []
    groups[p.category].push(p)
  })
  
  // Sort each group: National Hub (Verified) first
  Object.keys(groups).forEach(cat => {
    groups[cat].sort((a, b) => {
      const aOfficial = isVerifiedSource(a.retailer)
      const bOfficial = isVerifiedSource(b.retailer)
      if (aOfficial && !bOfficial) return -1
      if (!aOfficial && bOfficial) return 1
      return 0
    })
  })
  
  return groups
})

const summaryPrices = computed(() => {
  return (prices.value || []).filter(p => {
    const n = p.name.toLowerCase()
    const c = p.category.toLowerCase()
    return n.includes('fuel') || 
           n.includes('grain') || 
           n.includes('sugar') || 
           n.includes('meal') ||
           c.includes('fuel') ||
           c.includes('grain')
  }).sort((a, b) => {
    // Verified sources first
    const aOfficial = isVerifiedSource(a.retailer)
    const bOfficial = isVerifiedSource(b.retailer)
    if (aOfficial && !bOfficial) return -1
    if (!aOfficial && bOfficial) return 1
    return 0
  }).slice(0, 12)
})

const filteredPrices = computed(() => prices.value)

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString()
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
    <!-- Navbar -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-emerald-50">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <LucideZap class="w-6 h-6 text-white" />
          </div>
          <span class="text-2xl font-heading font-extrabold tracking-tight text-slate-900">Gwatidzo</span>
        </div>

        <div class="hidden md:flex items-center gap-10">
          <a v-for="link in navLinks" :key="link.name" :href="link.href" class="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">
            {{ link.name }}
          </a>
          <NuxtLink to="/dashboard" class="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">
            Live Market Overview
          </NuxtLink>
        </div>

        <div class="flex items-center gap-4">
          <NuxtLink to="/dashboard/analysis" class="bg-emerald-600 text-white text-sm font-bold px-8 py-3 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:scale-[1.05] active:scale-[0.95] transition-all">
            Advanced Analytics Hub
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative pt-40 pb-20 overflow-hidden bg-white">
      <div class="max-w-7xl mx-auto px-6 relative text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold tracking-widest uppercase mb-8 animate-in">
          Zimbabwe's Live Price Index 2026
        </div>

        <h1 class="text-6xl md:text-7xl font-heading font-extrabold text-slate-900 tracking-tighter leading-[1.1] mb-8 animate-in">
          The Transparency <span class="text-gradient">Zimbabwe</span> <br />
          Deserves for Pricing.
        </h1>

        <p class="max-w-2xl mx-auto text-lg text-slate-500 leading-relaxed mb-12 animate-in [animation-delay:200ms]">
          Real-time aggregation of commodity prices from retail giants, energy regulators, and grain boards. Combating overpricing with statistical transparency.
        </p>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-16 animate-in [animation-delay:300ms]">
          <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div class="text-3xl font-bold text-slate-900 mb-1">{{ stats?.totalRecords || 0 }}</div>
            <div class="text-xs font-bold text-slate-400 uppercase tracking-widest">Price Points</div>
          </div>
          <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div class="text-3xl font-bold text-slate-900 mb-1">{{ stats?.sourcesCount || 0 }}</div>
            <div class="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Sources</div>
          </div>
          <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div class="text-3xl font-bold text-emerald-600 mb-1">{{ stats?.activeAlerts || 0 }}</div>
            <div class="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Alerts</div>
          </div>
          <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div class="text-3xl font-bold text-slate-900 mb-1">{{ Math.round(stats?.averageMarketRisk || 0) }}%</div>
            <div class="text-xs font-bold text-slate-400 uppercase tracking-widest">Risk Score</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Market Overview -->
    <section id="market-overview" class="py-24 bg-slate-50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex justify-between items-end mb-12">
          <div>
            <h2 class="text-3xl font-heading font-extrabold text-slate-900 mb-2">Live Market Overview</h2>
            <p class="text-slate-500">Latest pricing data aggregated from multiple verified sources.</p>
          </div>
          <div class="flex gap-4">
             <select v-model="selectedCategory" @change="fetchPrices" class="bg-white border border-slate-200 text-sm font-bold px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20">
               <option value="">All Categories</option>
               <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
             </select>
          </div>
        </div>

        <div v-if="loading" class="py-32 flex flex-col items-center gap-6">
           <LucideLoader2 class="w-12 h-12 animate-spin text-emerald-500" />
           <p class="text-sm font-bold text-slate-400 uppercase tracking-widest">Consulting Market Indices...</p>
        </div>
        
        <div v-else-if="summaryPrices.length" class="overflow-x-auto">
          <div class="inline-block min-w-full align-middle">
            <div class="overflow-hidden bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl shadow-slate-900/5">
              <table class="min-w-full divide-y divide-slate-100">
                <thead>
                  <tr class="bg-slate-50/50">
                    <th scope="col" class="py-6 px-10 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Product & Brand</th>
                    <th scope="col" class="py-6 px-10 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                    <th scope="col" class="py-6 px-10 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Source</th>
                    <th scope="col" class="py-6 px-10 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Trend</th>
                    <th scope="col" class="py-6 px-10 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Price</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                  <tr v-for="item in summaryPrices" :key="item.id" 
                      class="group hover:bg-emerald-50/30 transition-all duration-300">
                    <td class="py-6 px-10 whitespace-nowrap">
                      <div class="flex items-center gap-4">
                        <div class="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                          <LucideZap v-if="item.category === 'FUEL'" class="w-5 h-5 text-emerald-600" />
                          <LucidePackage v-else class="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <div class="text-sm font-bold text-slate-900 leading-none mb-1.5 flex items-center gap-2">
                             {{ item.name }}
                             <span v-if="isVerifiedSource(item.retailer)" class="w-2 h-2 bg-emerald-500 rounded-full" title="Verified Source"></span>
                          </div>
                          <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ item.brand }} • {{ item.unitOfMeasure }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="py-6 px-10 whitespace-nowrap">
                      <span class="px-3 py-1 bg-slate-100 text-[9px] font-black text-slate-500 rounded-lg uppercase tracking-wider group-hover:bg-white transition-colors">
                        {{ item.category }}
                      </span>
                    </td>
                    <td class="py-6 px-10 whitespace-nowrap">
                      <div class="text-xs font-bold text-slate-700 italic">{{ item.retailer }}</div>
                      <div class="text-[9px] text-slate-400 uppercase tracking-widest mt-1">{{ item.region }}</div>
                    </td>
                    <td class="py-6 px-10 whitespace-nowrap text-right">
                      <div v-if="getTrendFor(item.id)" 
                           class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight"
                           :class="getTrendFor(item.id).trend === 'UP' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'"
                      >
                         <component :is="getTrendFor(item.id).trend === 'UP' ? LucideTrendingUp : LucideTrendingDown" class="w-3 h-3" />
                         {{ Math.abs(getTrendFor(item.id).changePct).toFixed(1) }}%
                      </div>
                      <span v-else class="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic">STABLE</span>
                    </td>
                    <td class="py-6 px-10 whitespace-nowrap text-right">
                      <div class="text-xl font-heading font-black text-slate-900 tracking-tight">{{ formatPrice(item.currentPrice, item.category) }}</div>
                      <div class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{{ formatDate(item.lastUpdated).split(',')[0] }}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <div class="p-8 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                <div class="text-xs font-bold text-slate-400 uppercase tracking-widest">Displaying Zimbabwe's Top essential price points</div>
                <NuxtLink to="/dashboard" class="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-widest hover:gap-3 transition-all">
                  View Full Analytics Hub
                  <LucideZap class="w-4 h-4 fill-emerald-600/10" />
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="py-20 text-center space-y-4">
           <LucidePackageSearch class="w-16 h-16 text-slate-200 mx-auto" />
           <p class="text-sm font-bold text-slate-400 uppercase tracking-widest">No active commodities detected in current cycle</p>
        </div>
      </div>
    </section>

    <!-- API Access -->
    <section id="api" class="py-32 bg-slate-900 relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div class="space-y-8">
            <h2 class="text-4xl font-heading font-extrabold text-white leading-tight">Public API for Price <br />Transparency</h2>
            <p class="text-slate-400 text-lg">We provide a free, public API for third-party developers to access Zimbabwe's market pricing data. No authentication required for reading public indices.</p>
            
            <div class="space-y-4">
              <div class="flex items-start gap-4">
                <div class="w-6 h-6 bg-emerald-500/20 rounded flex items-center justify-center text-emerald-500 shrink-0 font-bold">GET</div>
                <div class="text-slate-300 font-mono text-sm">/api/public/prices</div>
              </div>
              <div class="flex items-start gap-4">
                <div class="w-6 h-6 bg-emerald-500/20 rounded flex items-center justify-center text-emerald-500 shrink-0 font-bold">GET</div>
                <div class="text-slate-300 font-mono text-sm">/api/public/stats</div>
              </div>
            </div>

            <button class="bg-white text-slate-900 font-bold px-8 py-4 rounded-2xl hover:bg-slate-100 transition-all">Read API Docs</button>
          </div>
          <div class="bg-slate-800 rounded-3xl p-8 border border-slate-700 font-mono text-sm text-emerald-400 shadow-2xl">
            <div class="flex gap-2 mb-6">
              <div class="w-3 h-3 bg-red-500 rounded-full"></div>
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <pre class="overflow-x-auto">
{
  "product": "Maize",
  "price": 380.00,
  "source": "GMB",
  "category": "Grain",
  "riskScore": 12.5,
  "isAlert": false,
  "timestamp": "2026-03-04T12:00:00Z"
}</pre>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-white py-20 border-t border-slate-100">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-between items-center gap-12">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <LucideZap class="w-5 h-5 text-white" />
            </div>
            <span class="text-xl font-heading font-extrabold text-slate-900">Gwatidzo</span>
          </div>
          <p class="text-sm text-slate-400 font-medium">© 2026 Gwatidzo Price Index. Zimbabwean Transparency First.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.text-gradient {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500;
}

.animate-in {
  animation: animate-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}

@keyframes animate-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
