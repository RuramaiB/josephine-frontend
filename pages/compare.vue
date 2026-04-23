<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  LucideArrowLeftRight, LucideSearch, LucideAlertTriangle,
  LucideArrowLeft, LucideDatabase, LucideZap
} from 'lucide-vue-next'

const { formatPrice } = usePriceFormatter()

const sources = ref<string[]>([])
const sourceA = ref('')
const sourceB = ref('')
const comparisonData = ref([])
const loading = ref(false)

const fetchSources = async () => {
    try {
        const res = await fetch('http://localhost:1998/api/public/sources')
        sources.value = await res.json()
    } catch (e) {
        console.error('Failed to fetch sources', e)
    }
}

const runComparison = async () => {
    if (!sourceA.value || !sourceB.value) return
    loading.value = true
    try {
        const res = await fetch(`http://localhost:1998/api/public/compare?sourceA=${sourceA.value}&sourceB=${sourceB.value}`)
        comparisonData.value = await res.json()
    } catch (e) {
        console.error('Comparison failed', e)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchSources()
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 py-20 px-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-12 flex items-center justify-between">
         <NuxtLink to="/" class="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-all">
            <LucideArrowLeft class="w-4 h-4" />
            Back to Landing
         </NuxtLink>
         <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <LucideZap class="w-5 h-5 text-white" />
            </div>
            <span class="text-xl font-heading font-extrabold text-slate-900">Gwatidzo Comparison</span>
         </div>
      </div>

      <div class="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-2xl shadow-slate-900/5 mb-12">
         <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div class="space-y-2">
               <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Primary Source (A)</label>
               <select v-model="sourceA" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all">
                  <option value="" disabled>Select Source</option>
                  <option v-for="s in sources" :key="s" :value="s">{{ s }}</option>
               </select>
            </div>
            
            <div class="flex justify-center text-slate-300">
               <LucideArrowLeftRight class="w-8 h-8" />
            </div>

            <div class="space-y-2">
               <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Secondary Source (B)</label>
               <select v-model="sourceB" class="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all">
                  <option value="" disabled>Select Source</option>
                  <option v-for="s in sources" :key="s" :value="s">{{ s }}</option>
               </select>
            </div>
         </div>

         <button 
           @click="runComparison"
           :disabled="!sourceA || !sourceB || loading"
           class="w-full mt-10 py-5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
         >
           <LucideSearch v-if="!loading" class="w-4 h-4" />
           <LucideDatabase v-else class="w-4 h-4 animate-spin" />
           <span>{{ loading ? 'Analyzing common nodes...' : 'Compare Sources' }}</span>
         </button>
      </div>

      <div v-if="comparisonData.length" class="overflow-x-auto">
        <div class="inline-block min-w-full align-middle">
          <div class="overflow-hidden bg-white border border-slate-200 rounded-[2.5rem] shadow-sm">
            <table class="min-w-full divide-y divide-slate-100">
              <thead>
                <tr class="bg-slate-50/50">
                  <th class="py-6 px-10 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                  <th class="py-6 px-10 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ sourceA }}</th>
                  <th class="py-6 px-10 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ sourceB }}</th>
                  <th class="py-6 px-10 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Variance</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr v-for="item in comparisonData" :key="item.productId" class="hover:bg-slate-50 transition-colors">
                  <td class="py-6 px-10">
                    <div class="text-sm font-bold text-slate-900">{{ item.name }}</div>
                    <div class="text-[9px] font-bold text-slate-400 uppercase">{{ item.category }} • {{ item.unit }}</div>
                  </td>
                  <td class="py-6 px-10 text-right text-sm font-black text-slate-900">{{ formatPrice(item.priceA) }}</td>
                  <td class="py-6 px-10 text-right text-sm font-black text-slate-900">{{ formatPrice(item.priceB) }}</td>
                  <td class="py-6 px-10 text-right">
                    <div :class="item.diffPct > 0 ? 'text-rose-500' : 'text-emerald-500'" class="text-sm font-black">
                      {{ item.diffPct > 0 ? '+' : '' }}{{ item.diffPct.toFixed(1) }}%
                    </div>
                    <div class="text-[9px] font-bold text-slate-400 uppercase">{{ formatPrice(Math.abs(item.diff)) }} difference</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div v-else-if="!loading && sourceA && sourceB" class="py-32 text-center space-y-4 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
         <LucideAlertTriangle class="w-12 h-12 text-amber-500/20 mx-auto" />
         <p class="text-sm font-bold text-slate-400 uppercase tracking-widest">No common commodity nodes found between these sources</p>
      </div>

      <div v-else-if="!loading" class="py-32 text-center text-slate-300">
         <p class="text-[10px] font-black uppercase tracking-[0.4em]">Select Sources to Begin Analysis</p>
      </div>
    </div>
  </div>
</template>
