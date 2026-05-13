<template>
  <div class="py-12 bg-slate-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-6">
      <div class="flex justify-between items-start mb-12">
        <div>
          <h2 class="text-3xl font-heading font-extrabold text-slate-900 mb-2">Live Market Overview</h2>
          <p class="text-slate-500">Latest pricing data aggregated from multiple verified sources.</p>
          
          <!-- Official Source Nodes -->
          <div class="mt-6 flex flex-wrap gap-4 items-center">
             <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Scrape Nodes:</span>
             <a href="https://tmpnponline.co.zw/" target="_blank" class="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 hover:text-emerald-600 hover:border-emerald-500 transition-all shadow-sm group">
               <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover:animate-ping"></span>
               TM PICK N PAY
               <LucideExternalLink class="w-3 h-3 opacity-50" />
             </a>
             <a href="https://www.spar.co.zw/products/department/1/groceries" target="_blank" class="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 hover:text-emerald-600 hover:border-emerald-500 transition-all shadow-sm group">
               <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover:animate-ping"></span>
               SPAR ZIMBABWE
               <LucideExternalLink class="w-3 h-3 opacity-50" />
             </a>
             <a href="https://www.okzim.co.zw/" target="_blank" class="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 hover:text-emerald-600 hover:border-emerald-500 transition-all shadow-sm group">
               <span class="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
               OK ZIMBABWE
               <LucideExternalLink class="w-3 h-3 opacity-50" />
             </a>
             <a href="https://www.choppies.co.bw/" target="_blank" class="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 hover:text-emerald-600 hover:border-emerald-500 transition-all shadow-sm group">
               <span class="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
               CHOPPIES
               <LucideExternalLink class="w-3 h-3 opacity-50" />
             </a>
          </div>
        </div>
        <div class="flex gap-4">
           <select v-model="selectedCategory" @change="fetchPrices" class="bg-white border border-slate-200 text-sm font-bold px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm">
             <option value="">All Categories</option>
             <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
           </select>
        </div>
      </div>

      <div v-if="loading" class="py-32 flex flex-col items-center gap-6">
         <LucideLoader2 class="w-12 h-12 animate-spin text-emerald-500" />
         <p class="text-sm font-bold text-slate-400 uppercase tracking-widest">Consulting Market Indices...</p>
      </div>
      
      <div v-else-if="Object.keys(categoryGroups).length" class="space-y-12">
        <!-- Categorized Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="(products, cat) in categoryGroups" :key="cat" 
               @click="openCategoryModal(cat, products)"
               class="cursor-pointer bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-emerald-500 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
             
             <div class="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity">
               <LucidePackage class="w-32 h-32 text-emerald-500" />
             </div>

             <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-emerald-50 transition-colors mb-6">
               <LucideZap v-if="cat === 'FUEL'" class="w-6 h-6 text-emerald-600" />
               <LucidePackage v-else class="w-6 h-6 text-emerald-600" />
             </div>
             
             <h3 class="text-2xl font-heading font-black text-slate-900 group-hover:text-emerald-600 transition-colors mb-2">{{ cat }}</h3>
             <div class="flex items-center gap-3">
               <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ products.length }} Price Data Points</div>
             </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center pt-8 border-t border-slate-200/50">
           <NuxtLink to="/dashboard/inventory" class="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all group">
              View Full Market Inventory
              <LucideArrowLeftRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
           </NuxtLink>
           <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Access detailed pricing for all verified commodities</p>
        </div>
      </div>
      
      <div v-else class="py-20 text-center space-y-4">
         <LucidePackageSearch class="w-16 h-16 text-slate-200 mx-auto" />
         <p class="text-sm font-bold text-slate-400 uppercase tracking-widest">No active commodities detected in current cycle</p>
      </div>
    </div>

    <!-- Commodity Modal Overlay -->
    <CommodityModal 
      :isOpen="isModalOpen" 
      :category="selectedModalCategory" 
      :products="selectedModalProducts" 
      @close="closeCategoryModal" 
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { 
  LucideZap, LucidePackage, LucidePackageSearch, 
  LucideLoader2, LucideArrowLeftRight, LucideExternalLink
} from 'lucide-vue-next'

const prices = ref([])
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

const fetchCategories = async () => {
  try {
    const res = await fetch('http://localhost:1998/api/public/categories')
    categories.value = await res.json()
  } catch (e) {
    console.error('Failed to fetch categories', e)
  }
}

let interval;
onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([fetchPrices(), fetchCategories()])
  } catch (e) {
    console.error('Initial data fetch failed', e)
  } finally {
    loading.value = false
  }

  // Refresh data every 30 seconds
  interval = setInterval(async () => {
    try {
        await Promise.all([fetchPrices(), fetchCategories()])
    } catch (e) {
        console.error('Periodic refresh failed', e)
    }
  }, 30000)
})

onUnmounted(() => {
  clearInterval(interval)
})

// Modal State and Logic
const isModalOpen = ref(false)
const selectedModalCategory = ref('')
const selectedModalProducts = ref([])

const openCategoryModal = (cat, products) => {
  selectedModalCategory.value = cat
  selectedModalProducts.value = products
  isModalOpen.value = true
}

const closeCategoryModal = () => {
  isModalOpen.value = false
}

const categoryGroups = computed(() => {
  const groups = {}
  const source = prices.value || []
  source.forEach(p => {
    if (selectedCategory.value && p.category !== selectedCategory.value) return;
    if (!groups[p.category]) groups[p.category] = []
    groups[p.category].push(p)
  })
  return groups
})
</script>
