const express = require('express')
const bodyParser = require('body-parser')
const Modulo = require('./model')

const app = express()
app.use(bodyParser.json())

app.use('/module', Modulo)

app.listen(3000)