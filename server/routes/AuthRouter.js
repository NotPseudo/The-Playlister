const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/AuthController')

router.get('/loggedIn', AuthController.getLoggedIn)
router.post('/login', AuthController.loginUser)
router.get('/logout', AuthController.logoutUser)
router.post('/register', AuthController.registerUser)
router.patch('/edit', AuthController.editAccount)

module.exports = router