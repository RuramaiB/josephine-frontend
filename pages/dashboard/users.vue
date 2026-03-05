<template>
  <NuxtLayout name="dashboard">
    <template #header-title>Admin User Control</template>

    <div class="animate-in space-y-12">
      <!-- Users Table Card -->
      <div class="glass-morphism rounded-[2.5rem] border-emerald-100/20 overflow-hidden shadow-2xl shadow-emerald-900/5 bg-white">
        <div class="p-10 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 class="text-xl font-heading font-extrabold text-slate-900 tracking-tight">System Officers</h2>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage platform access and regional roles</p>
          </div>
          <button @click="showAddModal = true" class="bg-emerald-600 text-white px-8 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:scale-[1.05] active:scale-[0.95] transition-all flex items-center gap-2">
            <LucideUserPlus class="w-5 h-5" /> Add New Officer
          </button>
        </div>

        <div v-if="pending" class="p-20 flex flex-col items-center justify-center text-slate-400 gap-4">
           <LucideLoader2 class="w-10 h-10 animate-spin text-emerald-500" />
           <p class="text-xs font-bold uppercase tracking-widest">Fetching Gwatidzo Users...</p>
        </div>
        
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest">
                <th class="px-8 py-6">Officer Name</th>
                <th class="px-8 py-6">Email Address</th>
                <th class="px-8 py-6">Current Role</th>
                <th class="px-8 py-6">Status</th>
                <th class="px-8 py-6 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="user in users" :key="user.email" class="group hover:bg-emerald-50/30 transition-colors">
                <td class="px-8 py-6">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold overflow-hidden ring-2 ring-emerald-500/10">
                      <LucideUser class="w-5 h-5" />
                    </div>
                    <div>
                      <div class="text-sm font-bold text-slate-900">{{ user.firstname }} {{ user.lastname }}</div>
                      <div class="text-[10px] font-bold text-slate-400 uppercase">Zim Hub Active</div>
                    </div>
                  </div>
                </td>
                <td class="px-8 py-6">
                   <span class="text-xs font-medium text-slate-600">{{ user.email }}</span>
                </td>
                <td class="px-8 py-6">
                   <span :class="roleBadge(user.role)" class="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border">
                      {{ user.role }}
                   </span>
                </td>
                <td class="px-8 py-6">
                   <div class="flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full" :class="user.enabled ? 'bg-emerald-500' : 'bg-slate-300'"></div>
                      <span class="text-xs font-bold text-slate-600">{{ user.enabled ? 'Verified' : 'Pending' }}</span>
                   </div>
                </td>
                <td class="px-8 py-6 text-right">
                  <div class="flex justify-end gap-2">
                    <button @click="editUser(user)" class="p-2 hover:bg-emerald-600 hover:text-white rounded-xl text-slate-400 transition-all group/btn" title="Edit Details">
                      <LucideEdit class="w-5 h-5" />
                    </button>
                    <button @click="resetPass(user)" class="p-2 hover:bg-slate-900 hover:text-white rounded-xl text-slate-400 transition-all group/btn" title="Reset Password">
                      <LucideKey class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal for adding user -->
    <div v-if="showAddModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
       <div class="bg-white rounded-[2.5rem] p-10 w-full max-w-xl shadow-2xl space-y-8 animate-in border border-emerald-100">
          <div>
            <h3 class="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">Add New Gwatidzo Officer</h3>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">New accounts will receive a temporary password</p>
          </div>
          
          <div class="space-y-6">
             <div class="grid grid-cols-2 gap-4">
                <input v-model="newUser.firstname" type="text" placeholder="First Name" class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm outline-none focus:border-emerald-500 transition-all font-medium" />
                <input v-model="newUser.lastname" type="text" placeholder="Last Name" class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm outline-none focus:border-emerald-500 transition-all font-medium" />
             </div>
             <input v-model="newUser.email" type="email" placeholder="Email Address" class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm outline-none focus:border-emerald-500 transition-all font-medium" />
             <div class="relative">
                <select v-model="newUser.role" class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm outline-none focus:border-emerald-500 transition-all font-medium appearance-none">
                   <option value="USER">Standard User</option>
                   <option value="OFFICER">Field Officer</option>
                   <option value="MANAGER">District Manager</option>
                   <option value="ADMIN">System Admin</option>
                </select>
                <LucideChevronDown class="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
             </div>
          </div>

          <div class="flex gap-4">
             <button @click="showAddModal = false" class="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-xs font-bold tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
             <button @click="submitNewUser" class="flex-1 py-4 bg-emerald-600 text-white rounded-2xl text-xs font-bold tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-900/10 transition-all">Create Officer</button>
          </div>
       </div>
    </div>

    <!-- Modal for editing user -->
    <div v-if="showEditModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
       <div class="bg-white rounded-[2.5rem] p-10 w-full max-w-xl shadow-2xl space-y-8 animate-in border border-emerald-100">
          <div>
            <h3 class="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">Edit Officer Details</h3>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Update profile information for {{ editingUser.email }}</p>
          </div>
          
          <div class="space-y-6">
             <div class="grid grid-cols-2 gap-4">
                <div>
                   <label class="text-[10px] font-bold text-slate-400 uppercase ml-4 mb-2 block">First Name</label>
                   <input v-model="editingUser.firstname" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm outline-none focus:border-emerald-500 transition-all font-medium" />
                </div>
                <div>
                   <label class="text-[10px] font-bold text-slate-400 uppercase ml-4 mb-2 block">Last Name</label>
                   <input v-model="editingUser.lastname" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm outline-none focus:border-emerald-500 transition-all font-medium" />
                </div>
             </div>
             <div>
                <label class="text-[10px] font-bold text-slate-400 uppercase ml-4 mb-2 block">Physical Address</label>
                <input v-model="editingUser.physicalAddress" type="text" class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm outline-none focus:border-emerald-500 transition-all font-medium" />
             </div>
             <div>
                <label class="text-[10px] font-bold text-slate-400 uppercase ml-4 mb-2 block">System access (Role)</label>
                <div class="relative">
                   <select v-model="editingUser.role" class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-sm outline-none focus:border-emerald-500 transition-all font-medium appearance-none">
                      <option value="USER">Standard User</option>
                      <option value="OFFICER">Field Officer</option>
                      <option value="MANAGER">District Manager</option>
                      <option value="ADMIN">System Admin</option>
                   </select>
                   <LucideChevronDown class="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
             </div>
          </div>

          <div class="flex gap-4">
             <button @click="showEditModal = false" class="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl text-xs font-bold tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
             <button @click="submitEditUser" class="flex-1 py-4 bg-emerald-600 text-white rounded-2xl text-xs font-bold tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-900/10 transition-all">Save Changes</button>
          </div>
       </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { LucideUserPlus, LucideLoader2, LucideUser, LucideEdit, LucideKey, LucideChevronDown, LucideZap } from 'lucide-vue-next'

const api = useApi()
const showAddModal = ref(false)
const showEditModal = ref(false)
const newUser = ref({ firstname: '', lastname: '', email: '', role: 'OFFICER', password: 'Gwatidzo2026' })
const editingUser = ref({})

const { data: users, pending, refresh } = await useAsyncData('system-users', () => api.getUsers())

const roleBadge = (role) => {
  switch(role) {
    case 'ADMIN': return 'bg-slate-900 text-white border-slate-900'
    case 'OFFICER': return 'bg-emerald-50 text-emerald-600 border-emerald-200'
    case 'MANAGER': return 'bg-teal-50 text-teal-600 border-teal-200'
    default: return 'bg-slate-50 text-slate-500 border-slate-200'
  }
}

const editUser = (user) => {
  editingUser.value = { ...user }
  showEditModal.value = true
}

const resetPass = async (user) => {
  alert('Temporary password "Gwatidzo2026" has been set for ' + user.email)
}

const submitNewUser = async () => {
  try {
    await api.createTempUser(newUser.value)
    showAddModal.value = false
    newUser.value = { firstname: '', lastname: '', email: '', role: 'OFFICER', password: 'Gwatidzo2026' }
    refresh()
  } catch(e) { console.error(e) }
}

const submitEditUser = async () => {
   try {
      await api.updateUserDetails(editingUser.value.email, {
         firstname: editingUser.value.firstname,
         lastname: editingUser.value.lastname,
         physicalAddress: editingUser.value.physicalAddress,
         role: editingUser.value.role
      })
      showEditModal.value = false
      refresh()
   } catch(e) { console.error(e) }
}
</script>

<style scoped>
.glass-morphism {
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.7);
}
.animate-in {
  animation: animate-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes animate-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
