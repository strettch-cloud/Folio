const mongoose = require('mongoose')

const backlogItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  by: { type: String, default: '' },
  source: { type: String, default: '' },
  url: { type: String, default: '' },
  type: { type: String, enum: ['Book', 'Article'], required: true },
  tags: { type: [String], default: [] },
  note: { type: String, default: '' }
})

module.exports = mongoose.model('backlogitem', backlogItemSchema)