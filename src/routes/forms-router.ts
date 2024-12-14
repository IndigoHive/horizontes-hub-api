import express from 'express'
import { createLead } from '../services'

export const formsRouter = express.Router()

formsRouter.post('/lead', async (req, res) => {
  await createLead(req.body)
    .then(() => res.status(204).send())
    .catch((err) => res.status(400).json({ error: err.message }).send())
})
