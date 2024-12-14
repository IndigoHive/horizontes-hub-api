import express from 'express'
import cors from 'cors'
import { formsRouter } from './routes/forms-router'

const port = process.env.PORT || 3000

const app = express()
app.use(express.json())
app.use(cors())

// Routers
app.use('/forms', formsRouter)

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' }).send()
})

app.listen(port, () => {
  console.log('Server is running on port ' + port)
})
