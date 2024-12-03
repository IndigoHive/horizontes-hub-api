import sendgrid, { MailDataRequired } from '@sendgrid/mail'
import * as yup from 'yup'
import { createCogfyRecord, mapTextToMailTemplate } from '../../library'

export type Command = {
  name: string
  lead?: string | null
  email: string
  phone: string
  content?: string | null
  userType: 'contact' | 'support' | 'feedback'
  challenge?: string | null
  site?: string | null
}

const schema = yup.object().shape({
  name: yup.string().required(),
  phone: yup.string().required(),
  userType: yup.string().required(),
  email: yup.string().email().required(),
  lead: yup.string().nullable(),
  content: yup.string().nullable(),
  challenge: yup.string().nullable(),
  site: yup.string().nullable()
})

export async function handle (command: Command): Promise<void> {
  const apiKey = process.env.SENDGRID_API_KEY
  if (!apiKey) throw new Error('SENDGRID_API_KEY is not defined')

  sendgrid.setApiKey(apiKey)

  const from = process.env.SENDGRID_FROM_EMAIL
  if (!from) throw new Error('SENDGRID_FROM_EMAIL is not defined')

  const to = process.env.SENDGRID_TO_EMAIL
  if (!to) throw new Error('SENDGRID_TO_EMAIL is not defined')
  const tos = to.split(';')

  const { lead, userType } = schema.validateSync(command)

  const text = mapTextToMailTemplate(command)

  const msg: MailDataRequired = {
    to: tos,
    from,
    subject: `Contato - ${userType} ${lead ? ` - [${lead}]` : ''}`,
    text
  }

  await sendgrid.send(msg)
    .then(() => console.log('Email sent successfully'))
    .catch((error) => {
      throw new Error(error)
    })

  await createCogfyRecord(command)
}
