const express = require('express')
const app = express()
const mongoose = require('mongoose')
const multer = require('multer');
const cors = require('cors')
const bodyParser = require('body-parser')
// dotenv for environment variables
require('dotenv').config()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Connect to MongoDB
mongoose.connect(process.env.DB_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./files");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${file.originalname}.${ext}`);
  },
});

const upload = multer({
  storage: multerStorage
});

const convertRouter = require('./routes/convert')
app.use('/api/convert', upload.single('file'), convertRouter)

const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('Research Paper Summarizer & Notes Builder API')
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))