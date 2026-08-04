<script setup>
import { computed } from 'vue'
import { Trash2 } from 'lucide-vue-next'
// Define strict prop expectations for incoming item data objects
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

// Define outbound event hooks to communicate cleanly with parents
const emit = defineEmits(['cycle-status', 'delete-item'])

// Compute custom CSS classes dynamically based on active item state parameters
const statusClass = computed(() => {
  if (props.item.status === 'In progress') return 'status-doing'
  if (props.item.status === 'Completed') return 'status-done'
  return 'status-todo'
})

// Normalize metadata subtitle display fields strictly on structural media type
const displayMeta = computed(() => {
  return props.item.type === 'Book' 
    ? (props.item.by || 'Unknown Author') 
    : (props.item.source || 'Unknown Source')
})
</script>

<template>
  <div class="item-card">
    <div class="item-main">
      <p class="item-title">{{ item.title || 'Untitled' }}</p>
      <p class="meta">{{ displayMeta }}</p>
    </div>
    
    <!-- Structural Media Type Badge Indicator -->
    <span :class="['badge', 'type-' + (item.type || 'book').toLowerCase()]">
      {{ item.type }}
    </span>
    
    <!-- Clickable Status Loop Indicator Target Button -->
    <span 
      @click="emit('cycle-status')" 
      :class="['badge', statusClass]"
      style="cursor: pointer;"
    >
      ● {{ item.status || 'Not started' }}
    </span>
    
    <!-- Vector Trash Can Action Key -->
    <button class="icon-btn delete-btn" @click="emit('delete-item')" title="Delete item">
      <Trash2 :size="18" />
    </button>
  </div>
</template>
