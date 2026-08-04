<script setup>
import { ref, watch } from 'vue'
import { X } from 'lucide-vue-next'


const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  initialItem: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

// 1. Reactive state values for the form fields bound via v-model
const itemType = ref('Book')
const title = ref('')
const author = ref('')
const source = ref('')
const url = ref('')
const note = ref('')
const tagsString = ref('')

const resetForm = () => {
  itemType.value = 'Book'
  title.value = ''
  author.value = ''
  source.value = ''
  url.value = ''
  note.value = ''
  tagsString.value = ''
}

// Prefill the form when opening — either with an existing item (edit) or blank (add)
watch(() => props.isOpen, (open) => {
  if (!open) return
  if (props.initialItem) {
    const item = props.initialItem
    itemType.value = item.type ?? 'Book'
    title.value = item.title ?? ''
    author.value = item.by ?? ''
    source.value = item.source ?? ''
    url.value = item.url ?? ''
    note.value = item.note ?? ''
    tagsString.value = (item.tags ?? []).join(', ')
  } else {
    resetForm()
  }
})

// 2. Form submission handler — ONLY builds and emits form data, no business logic
const handleSubmit = () => {
  if (!title.value.trim()) {
    alert("Title is required")
    return
  }

  const cleanTagsArray = tagsString.value
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag !== "")

  // Plain form data — no id, no status, no assumptions about where it's going
  const formData = {
    type: itemType.value,
    title: title.value.trim(),
    by: itemType.value === 'Book' ? author.value.trim() : '',
    source: itemType.value === 'Article' ? source.value.trim() : '',
    url: itemType.value === 'Article' ? url.value.trim() : '',
    tags: cleanTagsArray,
    note: note.value.trim()
  }

  emit('save', formData)
  resetForm()
}

const handleCancel = () => {
  resetForm()
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-box">

      <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div>
          <h2 style="margin: 0;">{{ initialItem ? 'Edit item' : 'Add item' }}</h2>
          <p class="meta" style="margin: 4px 0 0 0;">Save a book or article to your backlog.</p>
        </div>
        <button class="icon-btn" @click="handleCancel" style="padding: 4px;"><X :size="20" /></button>
      </div>

      <form @submit.prevent="handleSubmit">

        <div class="form-field">
          <label>Type</label>
          <div class="segmented" style="display: flex; gap: 8px; margin-top: 4px;">
            <button
              type="button"
              @click="itemType = 'Book'"
              :class="['seg-btn', { active: itemType === 'Book' }]"
              style="flex: 1; padding: 8px;"
            >Book</button>
            <button
              type="button"
              @click="itemType = 'Article'"
              :class="['seg-btn', { active: itemType === 'Article' }]"
              style="flex: 1; padding: 8px;"
            >Article</button>
          </div>
        </div>

        <div v-if="itemType === 'Book'">
          <div class="form-field" style="margin-top: 16px;">
            <label for="book-title">Title</label>
            <input id="book-title" type="text" v-model="title" placeholder="Book title" style="width: 100%; margin-top: 4px;" required>
          </div>
          <div class="form-field" style="margin-top: 16px;">
            <label for="book-author">Author</label>
            <input id="book-author" type="text" v-model="author" placeholder="Author name" style="width: 100%; margin-top: 4px;">
          </div>
        </div>

        <div v-else>
          <div class="form-field" style="margin-top: 16px;">
            <label for="article-url">URL</label>
            <input id="article-url" type="text" v-model="url" placeholder="https://example.com" style="width: 100%; margin-top: 4px;">
          </div>
          <div class="form-field" style="margin-top: 16px;">
            <label for="article-title">Title</label>
            <input id="article-title" type="text" v-model="title" placeholder="Article title" style="width: 100%; margin-top: 4px;" required>
          </div>
          <div class="form-field" style="margin-top: 16px;">
            <label for="article-source">Source</label>
            <input id="article-source" type="text" v-model="source" placeholder="e.g. The Atlantic" style="width: 100%; margin-top: 4px;">
          </div>
        </div>

               <div class="form-field" style="margin-top: 16px;">
          <label for="item-note">Note <span class="label-hint">(Optional)</span></label>
          <textarea id="item-note" v-model="note" placeholder="Add custom notes..." style="width: 100%; margin-top: 4px; min-height: 80px;"></textarea>
        </div>

        <div class="form-field" style="margin-top: 16px;">
          <label for="item-tags">Tags <span class="label-hint">(Comma separated)</span></label>
          <input id="item-tags" type="text" v-model="tagsString" placeholder="e.g. design, engineering" style="width: 100%; margin-top: 4px;">
        </div>

        <div class="modal-actions" style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;">
          <button type="button" class="btn-secondary" @click="handleCancel">Cancel</button>
          <button type="submit" class="btn-primary">Save item</button>
        </div>

      </form>
    </div>
  </div>
</template>
