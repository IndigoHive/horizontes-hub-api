import sendgrid, { MailDataRequired } from '@sendgrid/mail'
import * as yup from 'yup'
import { cogfy, mapTextToMailTemplate } from '../../library'

export type CreateLeadRecordCommand = {
  name: string
  lead?: string | null
  email: string
  phone: string
  content?: string | null
  userType: 'contact' | 'support' | 'feedback'
  challenge?: string | null
  site?: string | null
  crm?: string | null
  challengeLink?: string | null
}

const schema = yup.object().shape({
  name: yup.string().required(),
  phone: yup.string().required(),
  userType: yup.string().required(),
  email: yup.string().email().required(),
  lead: yup.string().nullable(),
  content: yup.string().nullable(),
  challenge: yup.string().nullable(),
  site: yup.string().nullable(),
  crm: yup.string().nullable(),
  challengeLink: yup.string().nullable()
})

export async function createLead (command: CreateLeadRecordCommand): Promise<void> {
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

  await Promise.all([
    await sendgrid.send(msg)
      .then((res) => res)
      .catch((error) => {
        throw new Error(error)
      }),
    await createLeadRecord(command)
  ])
}

export async function createLeadRecord (command: CreateLeadRecordCommand) {
  await cogfy.records.create('b2c82a62-3b82-4be0-9b60-6dc863c8bd6c', {
    properties: {
      '2f8f3eec-6cf9-41b5-a426-39762624f674': {
        type: 'text',
        text: {
          value: command.name
        }
      },
      'b6ac71df-894d-4388-a4a5-9c649f5e1f66': {
        type: 'text',
        text: {
          value: command.lead ? command.lead : 'Não informado'
        }
      },
      'c5b7252f-9ae1-4f80-b9d0-7bdf9a9824da': {
        type: 'text',
        text: {
          value: command.email
        }
      },
      'eea3a065-a2cf-4590-90f5-7cb794c43981': {
        type: 'text',
        text: {
          value: command.phone
        }
      },
      '07984096-c092-478c-b11c-5d71e2662b35': {
        type: 'text',
        text: {
          value: command.content ? command.content : '-'
        }
      },
      '36936646-d4b1-488d-8618-dfae90dab1ee': {
        type: 'text',
        text: {
          value: command.userType ? command.userType : '-'
        }
      },
      '8a770728-3be6-4126-a7e5-f795e922abab': {
        type: 'text',
        text: {
          value: command.challenge ? command.challenge : '-'
        }
      },
      '4f2a296a-46e2-47a7-ae16-30c3d8652397': {
        type: 'text',
        text: {
          value: command.site ? command.site : '-'
        }
      },
      '9caa2b16-c0d9-46af-a1f7-de8b9a46fec8': {
        type: 'text',
        text: {
          value: command.crm ? command.crm : '-'
        }
      },
      'a3419722-d13c-4dd3-904f-89f591a578d0': {
        type: 'text',
        text: {
          value: command.challengeLink ? command.challengeLink : '-'
        }
      }
    }
  })
}
