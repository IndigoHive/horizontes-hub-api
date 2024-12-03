import express from 'express'
import { sendEmail } from './src'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors())

app.post('/send-email', async (req, res) => {
  await sendEmail(req.body)
    .then(() => res.status(204).send())
    .catch((err) => res.status(400).json({ error: err.message }).send())
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
