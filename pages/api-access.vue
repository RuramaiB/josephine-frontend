<template>
  <div class="min-h-screen bg-slate-50 py-20 px-6">
    <div class="max-w-4xl mx-auto space-y-16">
      
      <!-- Header -->
      <div class="text-center space-y-4">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black tracking-widest uppercase mb-4">
          Developer Documentation
        </div>
        <h1 class="text-4xl md:text-6xl font-heading font-black text-slate-900 tracking-tighter">
          Transparency <span class="text-gradient">API</span>
        </h1>
        <p class="text-slate-500 text-lg max-w-2xl mx-auto">
          Access real-time Zimbabwean commodity pricing data through our open REST API. Build tools for market analysis and transparency.
        </p>
      </div>

      <!-- API Endpoints -->
      <div class="space-y-8">
        <h2 class="text-2xl font-heading font-black text-slate-900 flex items-center gap-3">
          <LucideTerminal class="w-6 h-6 text-emerald-600" />
          Public Endpoints
        </h2>

        <div v-for="endpoint in endpoints" :key="endpoint.path" class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:border-emerald-200 group">
          <div class="p-8 space-y-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <span class="px-3 py-1 bg-emerald-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">GET</span>
                <code class="text-sm font-black text-slate-700 tracking-tight">{{ endpoint.path }}</code>
              </div>
              <button @click="copyCurl(endpoint)" class="text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest flex items-center gap-2 transition-colors">
                <LucideCopy class="w-3 h-3" /> Copy cURL
              </button>
            </div>

            <p class="text-sm text-slate-500 font-medium leading-relaxed">{{ endpoint.description }}</p>

            <div class="flex items-center gap-4 pt-4">
              <button @click="simulate(endpoint)" class="bg-slate-900 text-white text-xs font-black px-6 py-3 rounded-xl hover:bg-emerald-600 transition-all flex items-center gap-2">
                <LucidePlay class="w-3.5 h-3.5" /> Simulate Request
              </button>
            </div>
          </div>

          <!-- Simulation Result -->
          <div v-if="activeSimulation === endpoint.path" class="border-t border-slate-100 bg-slate-50/50 p-8 animate-in">
             <div class="flex items-center justify-between mb-4">
                <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Response Body</div>
                <div class="flex items-center gap-2">
                   <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                   <span class="text-[10px] font-black text-emerald-600 uppercase tracking-widest">200 OK</span>
                </div>
             </div>
             <pre class="bg-slate-900 text-emerald-400 p-6 rounded-2xl text-xs font-mono overflow-x-auto max-h-[400px] shadow-inner"><code>{{ simulationResult || 'Loading response...' }}</code></pre>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { LucideTerminal, LucideCopy, LucidePlay } from 'lucide-vue-next'

const endpoints = [
  {
    name: 'Get All Products',
    path: '/api/public/prices',
    description: 'Returns the full catalog of commodities, including current pricing, retailer details, and regional data.',
    curl: 'curl -X GET "http://localhost:1998/api/public/prices"'
  },
  {
    name: 'Get Categories',
    path: '/api/public/categories',
    description: 'Retrieve a complete list of monitored commodity categories in the Zimbabwean market.',
    curl: 'curl -X GET "http://localhost:1998/api/public/categories"'
  },
  {
    name: 'Get Market Trends',
    path: '/api/v1/market/trends',
    description: 'Fetch real-time volatility data and price adjustments across all monitored commodity nodes.',
    curl: 'curl -X GET "http://localhost:1998/api/v1/market/trends"'
  }
]

const activeSimulation = ref(null)
const simulationResult = ref(null)

const copyCurl = (endpoint) => {
  navigator.clipboard.writeText(endpoint.curl)
  // Simple toast would be nice but let's keep it clean
}

const simulate = async (endpoint) => {
  if (activeSimulation.value === endpoint.path) {
    activeSimulation.value = null
    return
  }
  
  activeSimulation.value = endpoint.path
  simulationResult.value = null
  
  try {
    const res = await fetch(`http://localhost:1998${endpoint.path}`)
    const data = await res.json()
    simulationResult.value = JSON.stringify(data, null, 2)
  } catch (e) {
    simulationResult.value = 'Error: Failed to connect to local backend.'
  }
}
</script>

<style scoped>
.text-gradient {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500;
}
.animate-in {
  animation: fade-in 0.4s ease-out forwards;
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
