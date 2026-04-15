<template>
  <div class="min-h-screen bg-slate-50 flex overflow-hidden font-sans selection:bg-emerald-100 selection:text-emerald-900">
    <!-- Sidebar -->
    <aside class="hidden lg:flex flex-col w-72 bg-slate-900 text-white shrink-0">
      <div class="h-20 flex items-center px-8 shrink-0">
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
            G
          </div>
          <span class="text-2xl font-heading font-extrabold tracking-tight">Gwatidzo</span>
        </NuxtLink>
      </div>

      <nav class="flex-grow px-4 py-6 space-y-1 overflow-y-auto">
        <div class="pb-2 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Market Intelligence</div>
        <SidebarLink to="/dashboard" icon="LayoutDashboard">Market Overview</SidebarLink>
        <SidebarLink to="/dashboard/analysis" icon="LineChart">Market Analysis</SidebarLink>
        <SidebarLink to="/dashboard/visuals" icon="Activity">Visual Representations</SidebarLink>
        
        <div class="pt-8 pb-3 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Quick Actions</div>
        <SidebarLink to="/" icon="Home">Back to Landing</SidebarLink>
        <SidebarLink to="/dashboard/inventory" icon="Package">Retail Prices</SidebarLink>
        <SidebarLink to="/dashboard/categories" icon="Layers">Categories & Analysis</SidebarLink>
        <SidebarLink to="/dashboard/sources" icon="Globe">Data Source Map</SidebarLink>
      </nav>

      <div class="p-8 mt-auto border-t border-white/5">
        <div class="p-6 bg-emerald-600/10 rounded-2xl border border-emerald-500/20">
          <p class="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-2">System Status</p>
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span class="text-xs font-bold text-slate-300">Public Live Node</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-grow flex flex-col h-screen overflow-hidden">
      <!-- Top header -->
      <header class="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-8 shrink-0 z-10">
        <div class="flex items-center gap-6">
           <button class="lg:hidden p-2 hover:bg-slate-50 rounded-lg text-slate-500">
              <LucideMenu class="w-6 h-6" />
           </button>
           <div>
             <h1 class="text-xl font-heading font-extrabold text-slate-900 tracking-tight">
               <slot name="header-title">GPIS Dashboard</slot>
             </h1>
           </div>
        </div>
        
        <div class="flex items-center gap-4">
           <div class="hidden sm:flex items-center bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-200">
              <LucideSearch class="w-4 h-4 text-slate-400 mr-2" />
              <input type="text" placeholder="Search Zim market..." class="bg-transparent border-none outline-none text-sm w-48 font-medium text-slate-600 placeholder:text-slate-400" />
           </div>
           <button class="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all active:scale-95 border border-slate-200 relative group">
              <LucideBell class="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span class="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white ring-2 ring-emerald-100"></span>
           </button>
        </div>
      </header>

      <section class="flex-grow overflow-y-auto p-8 lg:p-12 bg-slate-50/50">
        <slot />
      </section>
    </main>
  </div>
</template>

<script setup>
import { LucideLayoutDashboard, LucidePackage, LucideLineChart, LucideBell, LucideSearch, LucideMenu, LucideActivity, LucideLayers, LucideGlobe, LucideHome } from 'lucide-vue-next'
</script>
