const express = require('express')
const { adminLogin } = require('../controllers/adminController')
const router = express.Router()


router.post('/', adminLogin)

module.exports = router