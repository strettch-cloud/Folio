<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Columns3, Plus } from 'lucide-vue-next'
import ItemCard from './ItemCard.vue'
import { state, openModal, addItemToCurriculum, cycleItemStatus, deleteItemFromCurriculum } from '../store.js'
const route = useRoute()
const router = useRouter()

const activeCurriculum = computed(() => {
  if (route.params.id) {
    return state.curricula.find(c => c._id === route.params.id) || null
  }
  return state.curricula.find(c => c.active && !c.archived) || null
})

const progressMetrics = computed(() => {
  if (!activeCurriculum.value || !activeCurriculum.value.items) {
    return { completed: 0, total: 0, percentage: 0 }
  }
  const total = activeCurriculum.value.items.length
  const completed = activeCurriculum.value.items.filter(item => item.status === 'Completed').length
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
  return { completed, total, percentage }
})

const handleCycleStatus = async (item) => {
  await cycleItemStatus(activeCurriculum.value._id, item._id)
}

const handleDeleteItem = async (itemId) => {
  await deleteItemFromCurriculum(activeCurriculum.value._id, itemId)
}

const handleAddItem = () => {
  openModal({
    title: 'Add item to curriculum',
    onSave: async (formData) => {
      if (!activeCurriculum.value) return
      await addItemToCurriculum(activeCurriculum.value._id, formData)
    }
  })
}
</script>

<template>
  <div v-if="activeCurriculum">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
      <div>
        <p class="eyebrow">Active Curriculum</p>
        <h1>{{ activeCurriculum.theme }}</h1>
      </div>
      <button class="btn-secondary" @click="router.push({ name: 'all-curricula' })" style="display: inline-flex; align-items: center; gap: 8px;">
        <Columns3 :size="16" /> All curricula
      </button>
    </div>

    <p class="meta" style="margin-bottom: 24px;">
      {{ activeCurriculum.subtitle }} · {{ activeCurriculum.start }} – {{ activeCurriculum.end }}
    </p>

    <div class="panel">
      <div class="progress-header">
        <span>Progress</span>
        <span>{{ progressMetrics.completed }} of {{ progressMetrics.total }} completed</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: progressMetrics.percentage + '%' }"></div>
      </div>
    </div>

    <div class="list-header" style="display: flex; justify-content: space-between; align-items: center; margin-top: 32px;">
      <span>Reading list</span>
      <button class="btn-primary" @click="handleAddItem" style="display: inline-flex; align-items: center; gap: 8px;">
        <Plus :size="16" /> Add item
      </button>
    </div>

    <div class="item-list">
      <ItemCard
        v-for="element in activeCurriculum.items"
        :key="element._id"
        :item="element"
        @cycle-status="handleCycleStatus(element)"
        @delete-item="handleDeleteItem(element._id)"
      />
    </div>
  </div>

  <div v-else style="text-align: center; padding: 32px;">
    <h2>No active curriculum</h2>
    <p class="meta">Pick one from your curricula, or create a new plan.</p>
    <button class="btn-primary" @click="router.push({ name: 'all-curricula' })" style="margin-top: 16px;">
      View all curricula
    </button>
  </div>
</template>