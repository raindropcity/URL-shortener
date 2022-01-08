const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const CRUD = require('./modules/CRUD')

router.use('/', home)
router.use('/', CRUD)


module.exports = router