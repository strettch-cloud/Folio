import { reactive } from 'vue'

// Server base URL comes from .env (dev) / .env.production (build)
const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/api`

export const state = reactive({
  curricula: [],   // starts EMPTY — populated by loadInitialData() on app startup
  backlog: [],

  modalOpen: false,
  modalItem: null,
  modalTitle: 'Add item',
  modalOnSave: null
})

// Fetches everything from the database. Called once when App.vue mounts.
export async function loadInitialData() {
  const [curriculaRes, backlogRes] = await Promise.all([
    fetch(`${API_BASE}/curricula`),
    fetch(`${API_BASE}/backlog`)
  ])
  state.curricula = await curriculaRes.json()
  state.backlog = await backlogRes.json()
}

// ---- Modal control (unchanged logic, just async now) ----
export function openModal({ item = null, title = null, onSave }) {
  state.modalItem = item
  state.modalTitle = title || (item ? 'Edit item' : 'Add item')
  state.modalOnSave = onSave
  state.modalOpen = true
}

export function closeModal() {
  state.modalOpen = false
  state.modalItem = null
  state.modalOnSave = null
}

export async function submitModal(formData) {
  if (typeof state.modalOnSave === 'function') {
    await state.modalOnSave(formData)
  }
  closeModal()
}

// ---- Curriculum actions — each one calls the API, then updates local state to match ----

export async function createCurriculum(data) {
  const res = await fetch(`${API_BASE}/curricula`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  const newCurriculum = await res.json()
  state.curricula.forEach(c => { c.active = false })
  state.curricula.push(newCurriculum)
  return newCurriculum
}

export async function activateCurriculum(id) {
  const res = await fetch(`${API_BASE}/curricula/${id}/activate`, { method: 'PATCH' })
  const updated = await res.json()
  state.curricula.forEach(c => { c.active = c._id === id })
  return updated
}

export async function toggleArchiveCurriculum(curriculum) {
  const res = await fetch(`${API_BASE}/curricula/${curriculum._id}/archive`, { method: 'PATCH' })
  const updated = await res.json()
  Object.assign(curriculum, updated)
}

export async function deleteCurriculum(id) {
  await fetch(`${API_BASE}/curricula/${id}`, { method: 'DELETE' })
  state.curricula = state.curricula.filter(c => c._id !== id)
}

export async function addItemToCurriculum(curriculumId, formData) {
  const res = await fetch(`${API_BASE}/curricula/${curriculumId}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  const updatedCurriculum = await res.json()
  const index = state.curricula.findIndex(c => c._id === curriculumId)
  if (index !== -1) state.curricula[index] = updatedCurriculum
}

export async function cycleItemStatus(curriculumId, itemId) {
  const res = await fetch(`${API_BASE}/curricula/${curriculumId}/items/${itemId}/status`, {
    method: 'PATCH'
  })
  const updatedCurriculum = await res.json()
  const index = state.curricula.findIndex(c => c._id === curriculumId)
  if (index !== -1) state.curricula[index] = updatedCurriculum
}

export async function deleteItemFromCurriculum(curriculumId, itemId) {
  const res = await fetch(`${API_BASE}/curricula/${curriculumId}/items/${itemId}`, {
    method: 'DELETE'
  })
  const updatedCurriculum = await res.json()
  const index = state.curricula.findIndex(c => c._id === curriculumId)
  if (index !== -1) state.curricula[index] = updatedCurriculum
}

// ---- Backlog actions ----

export async function addBacklogItem(formData) {
  const res = await fetch(`${API_BASE}/backlog`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  const newItem = await res.json()
  state.backlog.push(newItem)
}

export async function editBacklogItem(item, formData) {
  const res = await fetch(`${API_BASE}/backlog/${item._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  const updated = await res.json()
  Object.assign(item, updated)
}

export async function deleteBacklogItem(id) {
  await fetch(`${API_BASE}/backlog/${id}`, { method: 'DELETE' })
  state.backlog = state.backlog.filter(item => item._id !== id)
}

export async function moveBacklogItemToCurriculum(backlogItemId, curriculumId) {
  const res = await fetch(`${API_BASE}/backlog/${backlogItemId}/move-to/${curriculumId}`, {
    method: 'POST'
  })
  const updatedCurriculum = await res.json()
  state.backlog = state.backlog.filter(item => item._id !== backlogItemId)
  const index = state.curricula.findIndex(c => c._id === curriculumId)
  if (index !== -1) state.curricula[index] = updatedCurriculum
}