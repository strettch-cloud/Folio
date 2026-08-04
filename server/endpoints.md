// ===== ENDPOINT PLAN (Section 11 mutations → REST endpoints) =====
//
// CURRICULA
// GET    /api/curricula: list all curricula
// GET    /api/curricula/:id :get one curriculum (for shareable link)
// POST   /api/curricula :create new curriculum (Screen 3 save)
// PATCH  /api/curricula/:id/activate: activate this one, deactivate rest
// PATCH  /api/curricula/:id/archive: toggle archived (also deactivates if archived)
// DELETE /api/curricula/:id: delete curriculum entirely
// POST   /api/curricula/:id/items: add item to curriculum's reading list
// PATCH  /api/curricula/:id/items/:itemId/status: cycle item status
// DELETE /api/curricula/:id/items/:itemId: remove item from curriculum
//
// BACKLOG
// GET    /api/backlog: list all backlog items
// POST   /api/backlog: add new backlog item
// PUT    /api/backlog/:id: edit existing backlog item
// DELETE /api/backlog/:id                           → delete backlog item
// POST   /api/backlog/:id/move-to/:curriculumId      → "Add to curriculum" dropdown action