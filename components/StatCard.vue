<template>
  <div class="glass-morphism p-7 rounded-[2rem] border-emerald-100/20 shadow-xl shadow-emerald-900/5 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 relative overflow-hidden group">
    <!-- Icon Backdrop Decoration -->
    <div class="absolute -top-6 -right-6 p-4 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-700">
      <component :is="iconComponent" class="w-24 h-24" />
    </div>
    
    <div class="flex items-center gap-4 mb-6 relative z-10">
      <div 
        class="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-500"
        :class="[
          color === 'emerald' ? 'bg-emerald-50 text-emerald-600 shadow-emerald-200/50' : 
          color === 'teal' ? 'bg-teal-50 text-teal-600 shadow-teal-200/50' :
          'bg-slate-50 text-slate-600 shadow-slate-200/50'
        ]"
      >
        <component :is="iconComponent" class="w-6 h-6" />
      </div>
      <div>
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block mb-0.5">{{ title }}</span>
        <div class="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">{{ value }}</div>
      </div>
    </div>

    <div class="flex items-center justify-between relative z-10">
      <div class="flex items-center gap-2">
         <span 
           class="text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm"
           :class="isUp ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'"
         >
           <LucideTrendingUp v-if="isUp" class="w-3 h-3" />
           <LucideTrendingDown v-else class="w-3 h-3" />
           {{ trend }}%
         </span>
         <span class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">vs Period</span>
      </div>
      
      <!-- Tiny Sparkline Mockup -->
      <div class="flex gap-1 items-end h-10 w-20">
         <div v-for="i in 8" :key="i" class="flex-grow bg-slate-100 rounded-full group-hover:bg-emerald-100 transition-colors duration-500" :style="{ height: (5 + Math.random() * 95) + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as LucideIcons from 'lucide-vue-next'
import { LucideTrendingUp, LucideTrendingDown } from 'lucide-vue-next'

const props = defineProps({
  title: String,
  value: String,
  icon: String,
  trend: String,
  isUp: Boolean,
  color: {
    type: String,
    default: 'emerald'
  }
})

const iconComponent = computed(() => LucideIcons[props.icon])
</script>
