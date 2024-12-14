import express from 'express'
import { handle } from '../services'

export const formsRouter = express.Router()

formsRouter.post('/lead', async (req, res) => {
  await handle(req.body)
    .then(() => res.status(204).send())
    .catch((err) => res.status(err.status).json({ error: err.message }).send())
})
