const mongoose = require('mongoose')

const Schema = mongoose.Schema
const todoSchema = new mongoose.Schema({
	title: String,
	createdAt: { type: Date, default: Date.now },
	like: Boolean,
})

module.exports = Todo = mongoose.model('todos', todoSchema)
