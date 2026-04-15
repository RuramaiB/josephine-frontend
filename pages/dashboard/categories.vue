<template>
  <NuxtLayout name="dashboard">
    <template #header-title>Categories & Sector Analysis</template>

    <div class="animate-in space-y-12">
      <!-- Sector Summary -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="sector in sectorSummaries" :key="sector.name" 
             class="glass-morphism rounded-[2.5rem] p-10 border border-slate-100 shadow-xl bg-white group hover:border-emerald-500 transition-all">
          <div class="flex items-center gap-4 mb-8">
             <div class="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <LucideLayers v-if="sector.name === 'RETAIL'" class="w-6 h-6" />
                <LucideFuel v-else-if="sector.name === 'FUEL'" class="w-6 h-6" />
                <LucidePackage v-else class="w-6 h-6" />
             </div>
             <h3 class="font-heading font-black text-slate-900 tracking-tight">{{ sector.name }}</h3>
          </div>
          
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Data Points</span>
              <span class="text-sm font-black text-slate-900">{{ sector.count }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Index Price</span>
              <span class="text-sm font-black text-emerald-600">${{ sector.avg.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Category Breakdown -->
      <div class="glass-morphism rounded-[3rem] p-12 bg-white border border-emerald-100/20 shadow-2xl">
         <h3 class="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-12 font-heading">Sector Price Comparison</h3>
         <div class="h-[450px]">
            <BarChart :chart-data="categoryComparisonData" />
         </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { LucideLayers, LucideFuel, LucidePackage } from 'lucide-vue-next'

const { data: allPrices } = await useAsyncData('all-prices-categories', () => $fetch('http://localhost:1998/api/public/prices'))

const sectorSummaries = computed(() => {
  if (!allPrices.value) return []
  const sectors = {}
  allPrices.value.forEach(p => {
    if (!sectors[p.category]) sectors[p.category] = { name: p.category, count: 0, sum: 0 }
    const price = Number(p.currentPrice) || 0
    sectors[p.category].count++
    sectors[p.category].sum += price
  })
  return Object.values(sectors).map(s => ({ ...s, avg: s.count > 0 ? s.sum / s.count : 0 }))
})

const categoryComparisonData = computed(() => {
  const summaries = sectorSummaries.value
  return {
    labels: summaries.map(s => s.name),
    datasets: [{
      label: 'Average Market Price (USD)',
      data: summaries.map(s => s.avg),
      backgroundColor: '#10b981',
      borderRadius: 16
    }]
  }
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
