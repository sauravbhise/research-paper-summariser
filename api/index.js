const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
// dotenv for environment variables
require('dotenv').config()

const convertRouter = require('./routes/convert')
app.use('/api/convert', convertRouter)

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
	res.send('Research Paper Summarizer & Notes Builder API')
})

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
