import express from 'express'
import { handle } from './services'
import cors from 'cors'

const port = process.env.PORT || 3000

const app = express()
app.use(express.json())
app.use(cors())

app.post('/send-email', async (req, res) => {
  await handle(req.body)
    .then(() => res.status(204).send())
    .catch((err) => res.status(400).json({ error: err.message }).send())
})

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' }).send()
})

app.listen(port, () => {
  console.log('Server is running on port ' + port)
})
