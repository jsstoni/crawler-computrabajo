const express = require('express')
const request = require("request-promise")
const cheerio = require("cheerio")

const computrabajo = require('./computrabajo')

const router = express.Router()
router.get('/computrabajo/:id', computrabajo({request, cheerio}))

module.exports = router