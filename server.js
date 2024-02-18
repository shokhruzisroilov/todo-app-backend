require('dotenv').config()
const express = require('express')
const cors = require('cors')
const todosRouter = require('./routes/todos')
const mongoose = require('mongoose')

const app = express()
app.use(express.json())
app.use(cors())

// MongoDBga ulanish
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDBga ulanish hosil qilindi...'))
.catch(err => console.error('MongoDBga ulanishda xatolik:', err))

// Server ishga tushirilganida
app.get('/', (req, res) => {
  res.send('Todo API ishga tushirildi')
})

// Todo ma'lumotlarini ushbu yo'l orqali qabul qiling
app.use('/api/todos', todosRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda eshitishga tayyor...`)
})
