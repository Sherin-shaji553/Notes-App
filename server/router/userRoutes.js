const express = require('express')
const router = new express.Router()
const authController = require('../controllers/authController')
const jwtMiddleware = require('../middlewares/authMiddleware')




//("/api/users")
router.post('/register', authController.registerController)
router.post('/login', authController.loginController)
router.get('/loggedUser',jwtMiddleware, authController.loggedUserController )



module.exports = router;