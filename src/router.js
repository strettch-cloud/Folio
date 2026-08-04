// src/router.js
import { createRouter, createWebHistory } from 'vue-router'

import AllCurriculaView from './components/AllCurriculaView.vue'
import CurriculumView from './components/CurriculumView.vue'
import BacklogView from './components/BacklogView.vue'
import CreateCurriculumView from './components/CreateCurriculumView.vue'

const routes = [
  // "/" redirects straight to the all-curricula grid, so there's only
  // ONE url that ever shows that page (avoids duplicate/confusing routes)
  { path: '/', redirect: { name: 'all-curricula' } },

  { path: '/curriculum/all', name: 'all-curricula', component: AllCurriculaView },

  // No :id — shows whichever curriculum is currently active
  { path: '/curriculum', name: 'curriculum-active', component: CurriculumView },

  // WITH :id — shows that specific curriculum, shareable/bookmarkable
  { path: '/curriculum/:id', name: 'curriculum', component: CurriculumView, props: true },

  { path: '/curriculum/create', name: 'create-curriculum', component: CreateCurriculumView },

  { path: '/backlog', name: 'backlog', component: BacklogView },

  { path: '/:pathMatch(.*)*', redirect: { name: 'all-curricula' } }
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})