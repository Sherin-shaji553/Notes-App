const express = require('express')
const router = express.Router()
const jwtMiddleware = require('../middlewares/authMiddleware')
const noteController = require('../controllers/noteController')

router.get('/', jwtMiddleware, noteController.getNotes)
router.post('/', jwtMiddleware, noteController.createNote)
router.get('/:id', jwtMiddleware, noteController.getNotesById)
router.put('/:id', jwtMiddleware, noteController.updateNote)
router.delete('/:id', jwtMiddleware, noteController.deleteNote)

module.exports = router
