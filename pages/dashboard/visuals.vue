<template>
  <NuxtLayout name="dashboard">
    <template #header-title>Advanced Visual Representations</template>

    <div class="animate-in space-y-12">
      <!-- Market Health Radar -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div class="glass-morphism rounded-[3rem] p-12 bg-slate-900 text-white shadow-2xl relative overflow-hidden">
          <div class="relative z-10">
             <h3 class="text-xs font-black uppercase tracking-[0.3em] text-emerald-400 mb-10 font-heading">National Market Integrity</h3>
             <div class="h-[400px]">
                <RadarChart :chart-data="radarChartData" />
             </div>
             <div class="mt-8 pt-8 border-t border-white/10 grid grid-cols-3 gap-6 text-center">
                <div>
                  <div class="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Stability</div>
                  <div class="text-lg font-black text-emerald-500">85%</div>
                </div>
                <div>
                  <div class="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Compliance</div>
                  <div class="text-lg font-black text-emerald-500">94%</div>
                </div>
                <div>
                  <div class="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Transparency</div>
                  <div class="text-lg font-black text-emerald-500">Match</div>
                </div>
             </div>
          </div>
        </div>

        <!-- Commodity Weighted Distribution -->
        <div class="glass-morphism rounded-[3rem] p-12 bg-white border border-emerald-100/20 shadow-2xl">
          <h3 class="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-10 font-heading">Commodity Index Weights</h3>
          <div class="h-[400px]">
             <DoughnutChart :chart-data="categoryDistribution" />
          </div>
          <p class="mt-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Distribution across Fuel, Grain, and Retail sectors
          </p>
        </div>
      </div>

      <!-- Regional Price Heatmap Logic (Simulated with Bar Chart) -->
      <div class="glass-morphism rounded-[3rem] p-12 bg-white border border-emerald-100/20 shadow-2xl">
         <div class="flex items-center justify-between mb-12">
            <div>
               <h3 class="text-2xl font-heading font-black text-slate-900 tracking-tight">Regional Price Parity</h3>
               <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Market variance across national sorting hubs</p>
            </div>
         </div>
         <div class="h-[400px]">
            <BarChart :chart-data="regionalChartData" />
         </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
const api = useApi()

const { data: allPrices } = useLazyAsyncData('all-prices-visuals', () => $fetch('http://localhost:1998/api/public/prices'))

const categoryDistribution = computed(() => {
  if (!allPrices.value) return { labels: [], datasets: [] }
  const counts = {}
  allPrices.value.forEach(p => counts[p.category] = (counts[p.category] || 0) + 1)
  return {
    labels: Object.keys(counts),
    datasets: [{
      data: Object.values(counts),
      backgroundColor: ['#10b981', '#14b8a6', '#0f766e', '#064e3b', '#34d399', '#059669'],
      borderWidth: 0,
      hoverOffset: 20
    }]
  }
})

const regionalChartData = computed(() => {
  return {
    labels: ['Harare Hub', 'Bulawayo Hub', 'Mutare Hub', 'Gweru Hub', 'Masvingo Hub'],
    datasets: [{
      label: 'Market Index Points',
      data: [92, 88, 75, 82, 79],
      backgroundColor: '#10b981',
      borderRadius: 12
    }]
  }
})

const radarChartData = computed(() => ({
  labels: ['Price Stability', 'Source Verification', 'Data Accuracy', 'Update Frequency', 'National Coverage'],
  datasets: [{
    label: 'Index Quality',
    data: [85, 92, 94, 78, 90],
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10b981',
    borderWidth: 2,
    pointBackgroundColor: '#10b981'
  }]
}))
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
