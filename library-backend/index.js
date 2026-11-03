require('dotenv').config()
const startServer = require('./server')

// env settings
const PORT = process.env.PORT || 4000

startServer(PORT)
