const express = require('express')
const router = express.Router()
const Todo = require('../models/Todos')
const Joi = require('joi')

// All Todo (Barcha Todo)
router.get('/', async (req, res) => {
	try {
		// Barcha todo-larni olish
		const todos = await Todo.find()
		// Agar todo-lar mavjud bo'lmasa, 404 Not Found xatoligi qaytariladi
		if (todos.length === 0) {
			res.status(404).send('Not Found')
		} else {
			res.send(todos)
		}
	} catch (error) {
		// Agar ma'lumotlar bazasiga ulanishda xatolik bo'lsa, 500 Internal Server Error xatoligi qaytariladi
		res.status(500).send(error.message)
	}
})

// Create Todo (Todo yaratish)
router.post('/', async (req, res) => {
	const { error } = todoValidate(req.body)
	// Kiritilgan ma'lumotlarni tekshirish
	if (error) {
		// Agar kiritilgan ma'lumotlar to'g'ri emas bo'lsa, 400 Bad Request xatoligi qaytariladi
		return res.status(400).send(error.details[0].message)
	}
	try {
		// Yangi todo yaratish
		const todo = new Todo({
			title: req.body.title,
			like: req.body.like,
		})
		// Yangi todo-ni saqlash
		const todoSave = await todo.save()
		// Saqlangan todo-ni 201 Created status kodi bilan qaytarish
		res.status(201).send(todoSave)
	} catch (error) {
		// Agar ma'lumotlar bazasiga ma'lumot qo'shishda xatolik bo'lsa, 500 Internal Server Error xatoligi qaytariladi
		res.status(500).send(error.message)
	}
})

// Update Todo (Todo-ni yangilash)
router.put('/:todoId', async (req, res) => {
	const { error } = todoValidate(req.body)
	// Kiritilgan ma'lumotlarni tekshirish
	if (error) {
		// Agar kiritilgan ma'lumotlar to'g'ri emas bo'lsa, 400 Bad Request xatoligi qaytariladi
		return res.status(400).send(error.details[0].message)
	}
	try {
		// Todo-ni bazadan yangilash
		const todo = await Todo.findByIdAndUpdate(req.params.todoId, req.body, {
			new: true,
		})
		// Agar todo topilmagan bo'lsa, 404 Not Found xatoligi qaytariladi
		if (!todo) {
			return res.status(404).send('No todo found for given Id')
		} else {
			// Yangilangan todo-ni qaytarish
			return res.send(todo)
		}
	} catch (error) {
		// Agar ma'lumotlar bazasiga ma'lumot qo'shishda xatolik bo'lsa, 500 Internal Server Error xatoligi qaytariladi
		res.status(500).send(error.message)
	}
})

// Delete Todo (Todo-ni o'chirish)
router.delete('/:todoId', async (req, res) => {
	try {
		// Todo-ni o'chirish
		const todo = await Todo.findByIdAndDelete(req.params.todoId)
		// Agar todo topilmagan bo'lsa, 404 Not Found xatoligi qaytariladi
		if (!todo) {
			return res.status(404).send('No todo found for given Id')
		} else {
			// O'chirilgan todo-ni qaytarish
			return res.send(todo)
		}
	} catch (error) {
		// Agar ma'lumotlar bazasiga ma'lumot o'chirishda xatolik bo'lsa, 500 Internal Server Error xatoligi qaytariladi
		res.status(500).send(error.message)
	}
})

// Like is update todo (Yoqtirishni yangilash)
router.get('/like/:todoId', async (req, res) => {
	try {
		// Todo-ni ID-si orqali topish
		const todo = await Todo.findById(req.params.todoId)
		// Agar todo topilmagan bo'lsa, 404 Not Found xatoligi qaytariladi
		if (!todo) {
			return res.status(404).send('No todo found for given Id')
		}
		// Yoqtirish holatini almashish
		todo.like = !todo.like
		// Yangilangan todo-ni saqlash
		await todo.save()
		// Yangilangan todo-ni qaytarish
		return res.send(todo)
	} catch (error) {
		// Agar ma'lumotlar bazasiga ma'lumot qo'shishda xatolik bo'lsa, 500 Internal Server Error xatoligi qaytariladi
		res.status(500).send(error.message)
	}
})

// Validate todo (Todo-ni tekshirish)
function todoValidate(book) {
	// Joi moduli yordamida ma'lumotlarni tekshirish
	const todoSchema = Joi.object({
		title: Joi.string().required().min(3),
		like: Joi.boolean().required(),
	})
	// Ma'lumotlarni tekshirish
	return todoSchema.validate(book)
}

module.exports = router
