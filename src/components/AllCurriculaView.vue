<script setup>
import { Archive, Trash2, Plus } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { state, activateCurriculum, toggleArchiveCurriculum, deleteCurriculum } from '../store.js'

const router = useRouter()

const handleActivate = async (curriculum) => {
  if (curriculum.archived) return
  await activateCurriculum(curriculum._id)
  router.push({ name: 'curriculum', params: { id: curriculum._id } })
}

const getMetrics = (curriculum) => {
  const total = curriculum.items ? curriculum.items.length : 0
  const completed = curriculum.items ? curriculum.items.filter(i => i.status === 'Completed').length : 0
  return `${total} items · ${completed} completed`
}

const handleToggleArchive = async (curriculum) => {
  await toggleArchiveCurriculum(curriculum)
}

const handleDelete = async (id) => {
  if (confirm("Are you sure you want to delete this curriculum and all its nested books?")) {
    await deleteCurriculum(id)
  }
}
</script>

<template>
  <div>
    <div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
      <div>
        <h1 style="margin: 0;">Your curricula</h1>
        <p class="meta" style="margin: 4px 0 0 0;">Themed reading plans, past and present.</p>
      </div>
      <button class="btn-primary" @click="router.push({ name: 'create-curriculum' })" style="display: inline-flex; align-items: center; gap: 8px;">
        <Plus :size="16" /> Create curriculum
      </button>
    </div>

    <div class="card-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px;">
      <div
        v-for="curr in state.curricula"
        :key="curr._id"
        :class="['curriculum-card', { 'card-archived': curr.archived }]"
        style="border: 1px solid #e2e8f0; padding: 24px; border-radius: 8px; background: #fff; position: relative;"
      >
        <div class="card-title-row" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
          <div @click="handleActivate(curr)" style="cursor: pointer; flex: 1; padding-right: 8px;" title="Click title to activate and view">
            <h2 class="card-title" style="margin: 0; font-size: 1.25rem; font-weight: 600; text-decoration: underline; color: var(--fg-1);">
              {{ curr.theme }}
            </h2>
          </div>

          <span v-if="curr.active" class="badge badge-active" style="background: #e0f2fe; color: #0369a1; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">● Active</span>
          <span v-else-if="curr.archived" class="badge badge-archived" style="background: #f1f5f9; color: #475569; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">Archived</span>
        </div>

        <p class="meta" style="margin: 4px 0; font-size: 0.875rem; color: #64748b;">{{ curr.subtitle || 'No description' }}</p>
        <p class="meta" style="margin: 4px 0 16px 0; font-size: 0.875rem; color: #64748b; font-weight: 500;">{{ curr.start }} – {{ curr.end }}</p>

        <div class="card-footer" style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 12px; margin-top: 16px;">
          <span class="meta" style="font-size: 0.875rem; color: #64748b;">{{ getMetrics(curr) }}</span>
          <div class="card-actions" style="display: flex; gap: 8px;">
            <button class="icon-btn" @click="handleToggleArchive(curr)" :title="curr.archived ? 'Unarchive' : 'Archive'">
              <Archive :size="16" />
            </button>
            <button class="icon-btn icon-btn-danger" @click="handleDelete(curr._id)" title="Delete">
              <Trash2 :size="16" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>