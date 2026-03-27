const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./src/config/db')

// 1. Load environment variables
dotenv.config()

// 2. Connect to MongoDB
connectDB()

// 3. Create Express app and HTTP server
const app = express()
const httpServer = http.createServer(app)

// 4. Attach Socket.io to HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST', 'PATCH']
  }
})

// Middleware
app.use(cors())
app.use(express.json())

// Make io accessible inside controllers
app.set('io', io)

// Routes
const triageRoutes = require('./src/routes/triageRoutes')
const patientRoutes = require('./src/routes/patientRoutes')
const hospitalRoutes = require('./src/routes/hospitalRoutes')

app.use('/api/triage', triageRoutes)
app.use('/api/patients', patientRoutes)
app.use('/api/hospitals', hospitalRoutes)

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Purviksha API is running' })
})

// Socket connection
io.on('connection', (socket) => {
  console.log(`Dashboard connected: ${socket.id}`)
  socket.on('disconnect', () => {
    console.log(`Dashboard disconnected: ${socket.id}`)
  })
})

// Start server
const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`Purviksha server running on port ${PORT}`)
})