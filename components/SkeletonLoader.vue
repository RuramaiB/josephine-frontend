<template>
  <div 
    class="animate-pulse bg-slate-100 rounded-2xl"
    :class="className"
  ></div>
</template>

<script setup>
defineProps({
  className: {
    type: String,
    default: 'w-full h-full'
  }
})
</script>
