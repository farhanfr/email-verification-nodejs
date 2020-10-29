const express = require('express')
const router = express.Router()

const {signup,activateAccount}  = require('../controllers/auth')

router.post('/signup',signup)
router.get('/email-activate/:token',activateAccount)

module.exports = router