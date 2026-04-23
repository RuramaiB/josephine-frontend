<template>
  <NuxtLayout name="dashboard">
    <template #header-title>Model Evaluation & Source Accuracy</template>

    <div class="space-y-10 animate-in">
      <!-- Performance Header -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 bg-slate-900 rounded-3xl p-8 text-white flex items-center justify-between shadow-2xl">
           <div class="space-y-4">
              <span class="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Engine Performance</span>
              <h2 class="text-3xl font-heading font-black tracking-tight">System Predictive Accuracy</h2>
              <p class="text-sm text-slate-400 max-w-md">Evaluation of price prediction accuracy against real-world retail data points aggregated from multi-source scrapes.</p>
           </div>
           <div class="shrink-0 text-right">
              <div class="text-5xl font-black text-emerald-500">{{ (performance?.anomalyPrecision * 100 || 0).toFixed(1) }}%</div>
              <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Precision Score</div>
           </div>
        </div>
        
        <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-center">
           <div class="flex items-center gap-4 mb-6">
              <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                 <LucideTarget class="w-5 h-5" />
              </div>
              <div>
                 <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">MAPE Rate</span>
                 <div class="text-2xl font-black text-slate-900">{{ performance?.mape || 0 }}%</div>
              </div>
           </div>
           <div class="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full bg-emerald-500 rounded-full" :style="{ width: (100 - (performance?.mape || 0)) + '%' }"></div>
           </div>
        </div>
      </div>

      <!-- Manual Prediction Testing (New Objective) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
           <div class="flex items-center justify-between mb-8">
              <h3 class="text-lg font-heading font-black text-slate-900 tracking-tight">Manual Model Sandbox</h3>
              <LucideFlaskConical class="w-6 h-6 text-emerald-500 opacity-20" />
           </div>
           <div class="space-y-6">
              <div class="space-y-2">
                 <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Select Commodity Node</label>
                 <select v-model="testProductId" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all">
                    <option v-for="item in dataset" :key="item.productId" :value="item.productId">{{ item.productName }}</option>
                 </select>
              </div>
              <button 
                @click="runTestPrediction"
                :disabled="!testProductId || testing"
                class="w-full py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                <LucidePlay v-if="!testing" class="w-4 h-4" />
                <LucideLoader2 v-else class="w-4 h-4 animate-spin text-emerald-400" />
                <span>{{ testing ? 'Simulating Prediction...' : 'Trigger Model Inference' }}</span>
              </button>
           </div>
        </div>

        <div v-if="testResult" class="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden animate-in">
           <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none"></div>
           <div class="relative z-10 flex flex-col h-full justify-between">
              <div class="flex justify-between items-start">
                 <div>
                    <span class="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1 block">Inference Result</span>
                    <div class="text-2xl font-heading font-black">{{ formatPrice(testResult.predictedPrice) }}</div>
                 </div>
                 <div class="text-right">
                    <div class="text-[10px] font-bold text-slate-500 uppercase">Confidence</div>
                    <div class="text-xl font-black text-emerald-400">{{ (testResult.confidence * 100).toFixed(1) }}%</div>
                 </div>
              </div>
              
              <div class="mt-8 pt-6 border-t border-white/5 space-y-4">
                 <div class="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span class="text-slate-500">Anomaly Risk</span>
                    <span :class="(testResult.isAnomaly || testResult.anomaly) ? 'text-rose-500' : 'text-emerald-500'">{{ (testResult.isAnomaly || testResult.anomaly) ? 'DETECTED' : 'NOMINAL' }}</span>
                 </div>
                 <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full bg-emerald-500 transition-all duration-1000" :style="{ width: (testResult.anomalyProbability * 100) + '%' }"></div>
                 </div>
              </div>
           </div>
        </div>
        <div v-else class="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col items-center justify-center text-center gap-4">
           <div class="w-16 h-16 rounded-full bg-white flex items-center justify-center text-slate-200">
              <LucideCode2 class="w-8 h-8" />
           </div>
           <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest max-w-[200px]">Select a node to trigger the pricing prediction engine</p>
        </div>
      </div>

      <!-- Main Dataset Table -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
         <div class="p-8 border-b border-slate-100 flex items-center justify-between">
            <div>
               <h3 class="text-lg font-heading font-black text-slate-900 tracking-tight">Statistical Market Truth Dataset</h3>
               <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cross-referencing {{ dataset?.length || 0 }} commodities across verified retailers</p>
            </div>
            <button @click="refreshDataset" class="p-2.5 hover:bg-slate-50 rounded-xl transition-all border border-slate-100">
               <LucideRefreshCcw class="w-5 h-5 text-slate-400" :class="{ 'animate-spin': datasetPending }" />
            </button>
         </div>
         
         <div class="overflow-x-auto">
            <table class="w-full text-left">
               <thead>
                  <tr class="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                     <th class="px-8 py-5">Commodity / ID</th>
                     <th class="px-8 py-5 text-center">Data points</th>
                     <th class="px-8 py-5">Market Truth (Median)</th>
                     <th class="px-8 py-5">Source Deviations (Mean)</th>
                     <th class="px-8 py-5 text-right">Integrity</th>
                  </tr>
               </thead>
               <tbody class="divide-y divide-slate-50">
                  <tr v-if="datasetPending" v-for="i in 5" :key="i">
                     <td colspan="5" class="px-8 py-6">
                        <SkeletonLoader class="h-8 w-full" />
                     </td>
                  </tr>
                  <tr v-else v-for="item in dataset" :key="item.productId" class="hover:bg-slate-50/50 transition-all group">
                     <td class="px-8 py-6">
                        <div class="font-bold text-slate-900">{{ item.productName }}</div>
                        <div class="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">{{ item.productId }}</div>
                     </td>
                     <td class="px-8 py-6 text-center">
                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-[11px] font-black text-slate-600">{{ item.recordCount }}</span>
                     </td>
                     <td class="px-8 py-6">
                        <div class="text-sm font-black text-slate-900">{{ formatPrice(item.marketTruthPrice) }}</div>
                     </td>
                     <td class="px-8 py-6">
                        <div class="flex flex-wrap gap-2">
                           <div v-for="(dev, source) in item.sourceDeviationsPct" :key="source" 
                             class="px-2 py-1 rounded bg-white border border-slate-100 text-[9px] font-bold"
                             :class="dev > 5 ? 'text-rose-500 border-rose-100 bg-rose-50' : 'text-emerald-600 border-emerald-100 bg-emerald-50'"
                           >
                             {{ source }}: {{ dev.toFixed(1) }}%
                           </div>
                        </div>
                     </td>
                     <td class="px-8 py-6 text-right">
                        <span class="px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter"
                          :class="getIntegrityClass(item.sourceDeviationsPct)"
                        >
                           {{ getIntegrityLabel(item.sourceDeviationsPct) }}
                        </span>
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
import { LucideTarget, LucideRefreshCcw, LucideShieldCheck, LucideAlertTriangle, LucideFlaskConical, LucidePlay, LucideLoader2, LucideCode2 } from 'lucide-vue-next'
import { computed, ref } from 'vue'

const { formatPrice } = usePriceFormatter()

const { data: dataset, pending: datasetPending, refresh: refreshDataset } = useLazyAsyncData('eval-dataset', () => $fetch('http://localhost:1998/api/v1/evaluation/dataset'))
const { data: performance } = useLazyAsyncData('eval-performance', () => $fetch('http://localhost:1998/api/v1/evaluation/performance'))

const testProductId = ref('')
const testing = ref(false)
const testResult = ref(null)

const runTestPrediction = async () => {
   if (!testProductId.value || testing.value) return
   testing.value = true
   testResult.value = null
   try {
      const response = await $fetch(`http://localhost:1998/api/predictions/run/${testProductId.value}`, { method: 'POST' })
      testResult.value = response
   } catch (e) {
      console.error('Prediction failed', e)
   } finally {
      testing.value = false
   }
}

const getIntegrityClass = (deviations) => {
   const values = Object.values(deviations)
   if (!values.length) return 'bg-slate-100 text-slate-400'
   const maxDev = Math.max(...values)
   if (maxDev < 3) return 'bg-emerald-100 text-emerald-700'
   if (maxDev < 10) return 'bg-amber-100 text-amber-700'
   return 'bg-rose-100 text-rose-700'
}

const getIntegrityLabel = (deviations) => {
   const values = Object.values(deviations)
   if (!values.length) return 'Incomplete'
   const maxDev = Math.max(...values)
   if (maxDev < 3) return 'High Confidence'
   if (maxDev < 10) return 'Divergent'
   return 'High Disparity'
}
</script>

<style scoped>
.animate-in {
  animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
