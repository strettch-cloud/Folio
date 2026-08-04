<script setup>
import { onMounted } from 'vue'
import { BookOpen, Library } from 'lucide-vue-next'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import AddItemModal from './components/AddItemModal.vue'
import { state, closeModal, submitModal, loadInitialData } from './store.js'

const route = useRoute()

// Fetch curricula + backlog from the database as soon as the app starts
onMounted(() => {
  loadInitialData()
})
</script>

<template>
  <div class="app">
    <aside>
      <div class="brand"><BookOpen :size="20" /> Folio</div>
      <nav>
        <RouterLink to="/curriculum" class="nav-item" :class="{ active: route.path.startsWith('/curriculum') }">
          <BookOpen :size="18" /> Curriculum
        </RouterLink>
        <RouterLink to="/backlog" class="nav-item" :class="{ active: route.path === '/backlog' }">
          <Library :size="18" /> Backlog
        </RouterLink>
      </nav>
      <p class="sidebar-footer">Reading curriculum app</p>
    </aside>

    <main>
      <RouterView />
    </main>

    <AddItemModal
      :is-open="state.modalOpen"
      :initial-item="state.modalItem"
      :title="state.modalTitle"
      @close="closeModal"
      @save="submitModal"
    />
  </div>
</template>