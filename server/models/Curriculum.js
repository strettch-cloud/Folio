const mongoose = require('mongoose')

// Sub-document: one reading list entry inside a curriculum (Section 10)
const curriculumItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  by: { type: String, default: '' },
  type: { type: String, enum: ['Book', 'Article'], required: true },
  status: {
    type: String,
    enum: ['Not started', 'In progress', 'Completed'],
    default: 'Not started'
  }
})

// Main Curriculum document
const curriculumSchema = new mongoose.Schema({
  theme: { type: String, required: true },
  subtitle: { type: String, default: '' },
  start: { type: String, default: 'TBD' },
  end: { type: String, default: 'TBD' },
  active: { type: Boolean, default: false },
  archived: { type: Boolean, default: false },
  items: [curriculumItemSchema]
})

module.exports = mongoose.model('curriculum', curriculumSchema)