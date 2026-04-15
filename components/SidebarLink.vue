<template>
  <NuxtLink 
    :to="to" 
    class="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group relative overflow-hidden"
    :class="[
      isActive 
        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' 
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    ]"
  >
    <component :is="iconComponent" class="w-5 h-5 shrink-0 transition-transform group-hover:scale-110 z-10" />
    <span class="text-sm font-bold tracking-tight z-10"><slot /></span>
    <div v-if="isActive" class="absolute inset-0 bg-gradient-to-r from-emerald-600 to-emerald-500 opacity-100"></div>
  </NuxtLink>
</template>

<script setup>
import * as LucideIcons from 'lucide-vue-next'

const props = defineProps({
  to: String,
  icon: String
})

const route = useRoute()
const isActive = computed(() => {
  if (props.to === '/dashboard') {
    return route.path === '/dashboard' || route.path === '/dashboard/'
  }
  return route.path.startsWith(props.to)
})

const iconComponent = computed(() => LucideIcons[props.icon])
</script>
