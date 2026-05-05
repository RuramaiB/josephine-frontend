<template>
  <div class="min-h-screen bg-white font-sans selection:bg-emerald-100 selection:text-emerald-900">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div class="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <div class="flex items-center gap-12">
          <NuxtLink to="/" class="flex items-center gap-2 group">
            <div class="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-all duration-500">
              G
            </div>
            <span class="text-2xl font-heading font-black tracking-tighter text-slate-900 group-hover:text-emerald-600 transition-colors">Gwatidzo</span>
          </NuxtLink>

          <div class="hidden md:flex items-center gap-8">
            <NuxtLink v-for="link in navLinks" :key="link.name" :to="link.href" class="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">
              {{ link.name }}
            </NuxtLink>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <NuxtLink to="/ai-analysis" class="bg-emerald-600 text-white text-sm font-bold px-8 py-3 rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:scale-[1.05] active:scale-[0.95] transition-all">
            AI Analysis Hub
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow pt-20">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white py-20 border-t border-slate-100 mt-auto">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-between items-center gap-12">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <LucideZap class="w-5 h-5 text-white" />
            </div>
            <span class="text-xl font-heading font-extrabold text-slate-900">Gwatidzo</span>
          </div>
          <p class="text-sm text-slate-400 font-medium">© 2026 Gwatidzo Price Index. Zimbabwean Transparency First.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { LucideZap } from 'lucide-vue-next'

const navLinks = [
  { name: 'Market', href: '/market' },
  { name: 'Live Overview', href: '/live-overview' },
  { name: 'Trends', href: '/trends' },
  { name: 'Comparison', href: '/compare' },
  { name: 'API Access', href: '/api-access' },
]
</script>

<style>
.font-heading {
  font-family: 'Outfit', sans-serif;
}
.text-gradient {
  @apply bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500;
}
.animate-in {
  animation: animate-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}
@keyframes animate-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
