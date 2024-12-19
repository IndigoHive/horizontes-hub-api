import sendgrid, { MailDataRequired } from '@sendgrid/mail'
import * as yup from 'yup'
import { cogfy, mapTextToMailTemplate } from '../../library'

export type CreateContactCommand = {
  name: string
  email: string
  company: string
  phone: string
  subject: string
}

const schema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  company: yup.string().required(),
  phone: yup.string().required(),
  subject: yup.string().nullable()
})

export async function createContact (command: CreateContactCommand): Promise<void> {
  const apiKey = process.env.SENDGRID_API_KEY
  if (!apiKey) throw new Error('SENDGRID_API_KEY is not defined')

  sendgrid.setApiKey(apiKey)

  const from = process.env.SENDGRID_FROM_EMAIL
  if (!from) throw new Error('SENDGRID_FROM_EMAIL is not defined')

  const to = process.env.SENDGRID_TO_EMAIL
  if (!to) throw new Error('SENDGRID_TO_EMAIL is not defined')
  const tos = to.split(';')

  const { name, company } = schema.validateSync(command)

  const text = mapTextToMailTemplate(command)

  const msg: MailDataRequired = {
    to: tos,
    from,
    subject: `Contato - ${name} - ${company}`,
    text
  }

  await Promise.all([
    await sendgrid.send(msg)
      .then((res) => res)
      .catch((error) => {
        throw new Error(error)
      }),
    await createContactRecord(command)
  ])
}

export async function createContactRecord (command: CreateContactCommand) {
  const { name, email, company, phone, subject } = schema.validateSync(command)

  await cogfy.records.create('764a5d49-7efe-4a61-acf1-92b78fb6fca0', {
    properties: {
      'c0d4b94d-cda5-4fc5-9b57-19536172e33f': {
        type: 'text',
        text: {
          value: name
        }
      },
      '69aa0ec6-8334-432a-84f3-dd60fd17ecad': {
        type: 'text',
        text: {
          value: email
        }
      },
      'f3b7698f-cf1a-473b-b89d-1926ece0b7ff': {
        type: 'text',
        text: {
          value: company
        }
      },
      '49b7b610-69ec-4361-a61c-7f42de9a5a0d': {
        type: 'text',
        text: {
          value: phone
        }
      },
      'e9162354-31ba-422c-a149-0b66865672b9': {
        type: 'text',
        text: {
          value: subject ?? ''
        },
      }
    }
  })
}
