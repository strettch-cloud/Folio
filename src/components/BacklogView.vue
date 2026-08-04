<script setup>
import { ref, computed } from 'vue'
import { Trash2, ListPlus, SquarePen, Plus } from 'lucide-vue-next'
import { state, openModal, addBacklogItem, editBacklogItem, deleteBacklogItem, moveBacklogItemToCurriculum } from '../store.js'

const searchStringQuery = ref('')
const activeTypePillFilter = ref('All')
const activeDropdownItemId = ref(null)

const filteredBacklogItems = computed(() => {
  return state.backlog.filter(item => {
    const titleStr = item.title || ""
    const byStr = item.by || ""
    const sourceStr = item.source || ""
    const searchableContentString = `${titleStr} ${byStr} ${sourceStr}`.toLowerCase()
    const textMatches = searchableContentString.includes(searchStringQuery.value.toLowerCase())
    const typeMatches = activeTypePillFilter.value === 'All' || item.type === activeTypePillFilter.value
    return textMatches && typeMatches
  })
})

const availableCurricula = computed(() => state.curricula.filter(c => !c.archived))

const handleDelete = async (id) => {
  await deleteBacklogItem(id)
}

const toggleDropdownMenu = (id) => {
  activeDropdownItemId.value = activeDropdownItemId.value === id ? null : id
}

const handleMoveToCurriculum = async (curriculumId, item) => {
  await moveBacklogItemToCurriculum(item._id, curriculumId)
  activeDropdownItemId.value = null
}

const handleAddItem = () => {
  openModal({
    title: 'Add item',
    onSave: async (formData) => {
      await addBacklogItem(formData)
    }
  })
}

const handleEditItem = (item) => {
  openModal({
    item,
    title: 'Edit item',
    onSave: async (formData) => {
      await editBacklogItem(item, formData)
    }
  })
}
</script>

<template>
  <div @click="activeDropdownItemId = null">
    <div class="page-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
      <div>
        <h1 style="margin: 0;">Reading backlog</h1>
        <p class="meta" style="margin: 4px 0 0 0;">Everything you've saved to read.</p>
      </div>
      <button class="btn-primary" @click.stop="handleAddItem" style="display: inline-flex; align-items: center; gap: 8px;">
        <Plus :size="16" /> Add item
      </button>
    </div>

    <div class="toolbar" style="display: flex; gap: 16px; margin: 24px 0; align-items: center;">
      <div class="search-wrap" style="flex: 1; position: relative;">
        <input type="text" v-model="searchStringQuery" placeholder="Search by title or author"
          style="width: 100%; padding: 8px 12px; border: 1px solid #ccc; border-radius: 6px;">
      </div>
      <div class="filter-pills" style="display: flex; gap: 8px;">
        <button @click="activeTypePillFilter = 'All'" :class="['pill', { active: activeTypePillFilter === 'All' }]">All</button>
        <button @click="activeTypePillFilter = 'Book'" :class="['pill', { active: activeTypePillFilter === 'Book' }]">Books</button>
        <button @click="activeTypePillFilter = 'Article'" :class="['pill', { active: activeTypePillFilter === 'Article' }]">Articles</button>
      </div>
    </div>

    <div v-if="filteredBacklogItems.length === 0" style="text-align: center; padding: 32px; color: #777;">
      <h2>Nothing here yet</h2>
      <p>No items match. Try a different search or filter.</p>
    </div>

    <div class="item-list">
      <div v-for="item in filteredBacklogItems" :key="item._id" class="item-card">
        <div class="item-main">
          <p class="item-title">{{ item.title }}</p>
          <p class="meta">{{ item.type === 'Book' ? item.by : item.source }}</p>
          <div class="tag-row" style="display: flex; gap: 4px; margin-top: 4px;">
            <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>

        <div class="item-badges">
          <span :class="['badge', 'type-' + item.type.toLowerCase()]">{{ item.type }}</span>
        </div>

        <div class="item-actions" style="display: flex; gap: 8px; align-items: center; position: relative;">
          <div style="position: relative; display: inline-block;">
            <button class="icon-btn add-curric-btn" @click.stop="toggleDropdownMenu(item._id)" title="Add to curriculum">
              <ListPlus :size="18" />
            </button>
            <div v-if="activeDropdownItemId === item._id"
              style="position: absolute; right: 0; top: 36px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); min-width: 180px; z-index: 1000; padding: 6px 0;">
              <div v-for="c in availableCurricula" :key="c._id" @click.stop="handleMoveToCurriculum(c._id, item)"
                style="padding: 8px 12px; font-size: 0.875rem; color: #334155; cursor: pointer;">
                {{ c.theme }}
              </div>
            </div>
          </div>

          <button class="icon-btn" @click.stop="handleEditItem(item)" title="Edit">
            <SquarePen :size="18" />
          </button>

          <button class="icon-btn icon-btn-danger" @click="handleDelete(item._id)" title="Delete">
            <Trash2 :size="18" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>