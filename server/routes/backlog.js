const express = require('express')
const router = express.Router()
const BacklogItem = require('../models/BacklogItem')
const Curriculum = require('../models/Curriculum')

// GET /api/backlog
router.get('/', async (req, res) => {
  try {
    const items = await BacklogItem.find()
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/backlog
router.post('/', async (req, res) => {
  try {
    const newItem = await BacklogItem.create(req.body)
    res.status(201).json(newItem)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PUT /api/backlog/:id — edit
router.put('/:id', async (req, res) => {
  try {
    const updated = await BacklogItem.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    )
    if (!updated) return res.status(404).json({ error: 'Item not found' })
    res.json(updated)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/backlog/:id
router.delete('/:id', async (req, res) => {
  try {
    await BacklogItem.findByIdAndDelete(req.params.id)
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/backlog/:id/move-to/:curriculumId — add-backlog-item-to-curriculum
router.post('/:id/move-to/:curriculumId', async (req, res) => {
  try {
    const backlogItem = await BacklogItem.findById(req.params.id)
    if (!backlogItem) return res.status(404).json({ error: 'Backlog item not found' })
    const curriculum = await Curriculum.findById(req.params.curriculumId)
    if (!curriculum) return res.status(404).json({ error: 'Curriculum not found' })

    curriculum.items.push({
      title: backlogItem.title,
      by: backlogItem.type === 'Book' ? backlogItem.by : backlogItem.source,
      type: backlogItem.type,
      status: 'Not started'
    })
    await curriculum.save()
    await BacklogItem.findByIdAndDelete(req.params.id)

    res.json(curriculum)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router