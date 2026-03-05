<template>
  <NuxtLayout name="dashboard">
    <template #header-title>Gwatidzo Retail Index</template>

    <div class="animate-in space-y-10">
      <!-- Controls -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex items-center gap-4 flex-wrap">
          <div class="relative group">
            <LucideSearch class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Filter commodities..." 
              class="bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-6 text-sm font-medium w-full md:w-64 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-heading"
            />
          </div>
          
          <div class="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
             <button 
               v-for="cat in ['RETAIL', 'FUEL']" 
               :key="cat"
               @click="currentCategory = cat"
               class="px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
               :class="currentCategory === cat ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'"
             >
                {{ cat }}
             </button>
          </div>

          <div class="relative">
            <select v-model="providerFilter" class="bg-white border border-slate-200 rounded-2xl py-3 pl-6 pr-12 text-xs font-bold uppercase tracking-widest outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer">
               <option value="ALL">All Providers</option>
               <option v-for="prov in uniqueProviders" :key="prov" :value="prov">{{ prov }}</option>
            </select>
            <LucideChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div class="flex gap-4">
           <button @click="exportData" class="bg-slate-900 text-white px-8 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2">
             <LucideDownload class="w-5 h-5" /> Export Data
           </button>
        </div>
      </div>

      <!-- Data Table Card -->
      <div class="glass-morphism rounded-[2.5rem] border-emerald-100/20 overflow-hidden shadow-2xl shadow-emerald-900/5 bg-white">
        <div v-if="pending" class="p-20 flex flex-col items-center justify-center text-slate-400 gap-4">
           <LucideLoader2 class="w-10 h-10 animate-spin text-emerald-500" />
           <p class="text-xs font-bold uppercase tracking-widest font-heading">Fetching Live Records...</p>
        </div>
        
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.2em]">
                <th class="px-8 py-6">Commodity</th>
                <th class="px-8 py-6">Brand/Origin</th>
                <th class="px-8 py-6">Unit</th>
                <th class="px-8 py-6">Data Source</th>
                <th class="px-8 py-6">Current Price</th>
                <th class="px-8 py-6 text-right">Verification</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="item in filteredProducts" :key="item.id" class="group hover:bg-emerald-50/30 transition-all">
                <td class="px-8 py-6">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 font-bold text-xs ring-4 ring-emerald-50/50 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                      {{ item.name.charAt(0) }}
                    </div>
                    <div>
                      <div class="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{{ item.name }}</div>
                      <div class="text-[9px] font-bold text-slate-400 tracking-tighter">{{ item.id }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-8 py-6">
                   <span class="text-xs font-bold text-slate-600">{{ item.brand }}</span>
                </td>
                <td class="px-8 py-6">
                   <span class="text-[9px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-widest">{{ item.unitOfMeasure }}</span>
                </td>
                <td class="px-8 py-6">
                   <div class="flex items-center gap-2">
                      <div class="p-1.5 bg-emerald-50 rounded-md">
                         <LucideChrome v-if="item.retailer.includes('OK') || item.retailer.includes('TM')" class="w-3.5 h-3.5 text-emerald-600" />
                         <LucideZap v-else-if="item.retailer.includes('ZERA')" class="w-3.5 h-3.5 text-emerald-600" />
                         <LucideUserCheck v-else class="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <span class="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{{ item.retailer }}</span>
                   </div>
                </td>
                <td class="px-8 py-6">
                   <div class="text-sm font-black text-slate-900">$ {{ item.currentPrice.toFixed(2) }}</div>
                   <div class="text-[9px] font-bold text-emerald-500 uppercase mt-0.5 tracking-tight">{{ item.region }} Hub</div>
                </td>
                <td class="px-8 py-6 text-right">
                  <span class="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full uppercase tracking-[0.15em]">
                     Verified Just Now
                  </span>
                </td>
              </tr>
              <tr v-if="filteredProducts.length === 0">
                 <td colspan="6" class="py-20 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest bg-slate-50/50">
                    No results found for your selection
                 </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { LucideSearch, LucideLoader2, LucideDownload, LucideChevronDown, LucideChrome, LucideZap, LucideUserCheck } from 'lucide-vue-next'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

const api = useApi()
const searchQuery = ref('')
const currentCategory = ref('RETAIL')
const providerFilter = ref('ALL')

const { data: products, pending, refresh } = await useAsyncData('market-products', () => api.getMarketProducts(currentCategory.value), {
  watch: [currentCategory]
})

const uniqueProviders = computed(() => {
  if (!products.value) return []
  const providers = products.value.map(p => p.retailer)
  return [...new Set(providers)].filter(Boolean).sort()
})

const filteredProducts = computed(() => {
  if (!products.value) return []
  return products.value.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesProvider = providerFilter.value === 'ALL' || 
                            p.retailer === providerFilter.value
    return matchesSearch && matchesProvider
  })
})

const exportData = () => {
  const doc = new jsPDF()
  
  doc.setFontSize(18)
  doc.text('Gwatidzo Regional Price Index Audit', 14, 22)
  doc.setFontSize(11)
  doc.setTextColor(100)
  doc.text(`Category: ${currentCategory.value} | Generated: ${new Date().toLocaleString()}`, 14, 30)
  
  const tableData = filteredProducts.value.map(p => [
    p.name,
    p.brand,
    p.unitOfMeasure,
    p.retailer,
    p.region,
    `$ ${p.currentPrice.toFixed(2)}`
  ])
  
  doc.autoTable({
    startY: 40,
    head: [['Commodity', 'Brand', 'Unit', 'Retailer', 'Region', 'Price (USD)']],
    body: tableData,
    headStyles: { fillColor: [5, 150, 105] }, // emerald-600
    alternateRowStyles: { fillColor: [240, 253, 244] } // emerald-50
  })
  
  doc.save(`Gwatidzo_Market_Audit_${currentCategory.value}_${new Date().toISOString().split('T')[0]}.pdf`)
}

onMounted(() => {
  refresh()
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
