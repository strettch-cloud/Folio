<script setup>
import { ref } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { createCurriculum } from '../store.js'

const router = useRouter()

const theme = ref('')
const subtitle = ref('')
const startDate = ref('')
const endDate = ref('')

const formatShortDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
const formatYear = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).getFullYear()
}

const handleSave = async () => {
  if (!theme.value.trim()) return alert("Theme title is required")

  const startFormatted = formatShortDate(startDate.value)
  const endFormatted = formatShortDate(endDate.value)
  const yearFormatted = formatYear(endDate.value)

  const newCurriculum = await createCurriculum({
    theme: theme.value.trim(),
    subtitle: subtitle.value.trim() || 'Custom Reading Plan',
    start: startFormatted || 'TBD',
    end: endFormatted ? `${endFormatted}, ${yearFormatted}` : 'TBD'
  })

  router.push({ name: 'curriculum', params: { id: newCurriculum._id } })
}
</script>

<template>
  <div class="main-narrow" style="max-width: 540px; margin: 0 auto;">
    <button class="back-link" @click="router.push({ name: 'all-curricula' })" style="display: inline-flex; align-items: center; gap: 8px; margin-bottom: 24px;">
      <ArrowLeft :size="16" /> Back to curricula
    </button>

    <h1>Create curriculum</h1>
    <p class="meta" style="margin-bottom: 32px;">A themed plan with a start and end date. Add books and articles after.</p>

    <div class="form">
      <div class="form-field" style="margin-top: 16px;">
        <label>Theme</label>
        <input type="text" v-model="theme" placeholder="e.g. Narrative craft" style="width: 100%; margin-top: 4px;">
      </div>
      <div class="form-field" style="margin-top: 16px;">
        <label>Subtitle / Focus</label>
        <input type="text" v-model="subtitle" placeholder="e.g. Storytelling & structure" style="width: 100%; margin-top: 4px;">
      </div>
      <div class="date-row" style="display: flex; gap: 16px; margin-top: 16px;">
        <div class="form-field" style="flex: 1;">
          <label>Start date</label>
          <input type="date" v-model="startDate" style="width: 100%; margin-top: 4px;">
        </div>
        <div class="form-field" style="flex: 1;">
          <label>End date</label>
          <input type="date" v-model="endDate" style="width: 100%; margin-top: 4px;">
        </div>
      </div>
      <div class="form-actions" style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px;">
        <button type="button" class="btn-secondary" @click="router.push({ name: 'all-curricula' })">Cancel</button>
        <button type="button" class="btn-primary" @click="handleSave">Save curriculum</button>
      </div>
    </div>
  </div>
</template>