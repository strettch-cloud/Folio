require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const curriculaRoutes = require('./routes/curricula')
const backlogRoutes = require('./routes/backlog')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/curricula', curriculaRoutes)
app.use('/api/backlog', backlogRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`)
    })
  })
  .catch((err) => console.error('MongoDB connection failed:', err))