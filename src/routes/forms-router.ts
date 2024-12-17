import express from 'express'
import { createContact, createLead } from '../services'

export const formsRouter = express.Router()

formsRouter.post('/lead', async (req, res) => {
  createLead(req.body)
    .then(() => res.status(204).send())
    .catch((err) => res.status(400).json({ error: err.message }).send())
})

formsRouter.post('/contact', async (req, res) => {
  createContact(req.body)
    .then(() => res.status(204).send())
    .catch((err) => res.status(400).json({ error: err.message }).send())
})
