const express = require('express')
const router = express.Router()
const { handleLogout } = require('../controllers/logOutController')

router.get('/', handleLogout)


module.exports = router 