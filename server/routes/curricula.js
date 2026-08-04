const express = require('express')
const router = express.Router()
const Curriculum = require('../models/Curriculum')

// GET /api/curricula — list all
router.get('/', async (req, res) => {
  try {
    const curricula = await Curriculum.find()
    res.json(curricula)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/curricula/:id — one, by id (shareable link)
router.get('/:id', async (req, res) => {
  try {
    const curriculum = await Curriculum.findById(req.params.id)
    if (!curriculum) return res.status(404).json({ error: 'Curriculum not found' })
    res.json(curriculum)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/curricula — create new, deactivating all others first
router.post('/', async (req, res) => {
  try {
    await Curriculum.updateMany({}, { active: false })
    const newCurriculum = await Curriculum.create({
      ...req.body,
      active: true,
      archived: false,
      items: []
    })
    res.status(201).json(newCurriculum)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// ---- update-status, edit(archive), delete, add-item routes below ----

// PATCH /api/curricula/:id/activate
router.patch('/:id/activate', async (req, res) => {
  try {
    await Curriculum.updateMany({}, { active: false })
    const updated = await Curriculum.findByIdAndUpdate(
      req.params.id, { active: true }, { new: true }
    )
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/curricula/:id/archive — toggle archived
router.patch('/:id/archive', async (req, res) => {
  try {
    const curriculum = await Curriculum.findById(req.params.id)
    if (!curriculum) return res.status(404).json({ error: 'Curriculum not found' })
    curriculum.archived = !curriculum.archived
    if (curriculum.archived) curriculum.active = false
    await curriculum.save()
    res.json(curriculum)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/curricula/:id
router.delete('/:id', async (req, res) => {
  try {
    await Curriculum.findByIdAndDelete(req.params.id)
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/curricula/:id/items — add reading list item
router.post('/:id/items', async (req, res) => {
  try {
    const curriculum = await Curriculum.findById(req.params.id)
    if (!curriculum) return res.status(404).json({ error: 'Curriculum not found' })
    curriculum.items.push({ ...req.body, status: 'Not started' })
    await curriculum.save()
    res.status(201).json(curriculum)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PATCH /api/curricula/:id/items/:itemId/status — cycle status
router.patch('/:id/items/:itemId/status', async (req, res) => {
  try {
    const curriculum = await Curriculum.findById(req.params.id)
    if (!curriculum) return res.status(404).json({ error: 'Curriculum not found' })
    const item = curriculum.items.id(req.params.itemId)
    if (!item) return res.status(404).json({ error: 'Item not found' })

    if (item.status === 'Not started') item.status = 'In progress'
    else if (item.status === 'In progress') item.status = 'Completed'
    else item.status = 'Not started'

    await curriculum.save()
    res.json(curriculum)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/curricula/:id/items/:itemId
router.delete('/:id/items/:itemId', async (req, res) => {
  try {
    const curriculum = await Curriculum.findById(req.params.id)
    if (!curriculum) return res.status(404).json({ error: 'Curriculum not found' })
    curriculum.items.pull(req.params.itemId)
    await curriculum.save()
    res.json(curriculum)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router