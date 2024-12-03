import sendgrid, { MailDataRequired } from '@sendgrid/mail'
import * as yup from 'yup'

type Body = {
  name: string
  lead?: string | null
  email: string
  phone: string
  content?: string | null
  userType?: 'contact' | 'support' | 'feedback' | null
  challenge?: string | null
  page: string
}

const schema = yup.object().shape({
  name: yup.string().required(),
  lead: yup.string().nullable(),
  email: yup.string().email().required(),
  phone: yup.string().required(),
  content: yup.string().nullable(),
  userType: yup.string().nullable(),
  challenge: yup.string().nullable(),
  page: yup.string().required()
})

export async function sendEmail (body: Body): Promise<void> {
  const apiKey = process.env.SENDGRID_API_KEY
  if (!apiKey) throw new Error('SENDGRID_API_KEY is not defined')

  sendgrid.setApiKey(apiKey)

  const from = process.env.SENDGRID_FROM_EMAIL
  if (!from) throw new Error('SENDGRID_FROM_EMAIL is not defined')

  const to = process.env.SENDGRID_TO_EMAIL
  if (!to) throw new Error('SENDGRID_TO_EMAIL is not defined')

  const { page, lead } = schema.validateSync(body)

  const text = mapTextToMailTemplate(body)

  const msg: MailDataRequired = {
    to,
    from,
    subject: `Contato - [${page}] ${lead ? ` - [${lead}]` : ''}`,
    text
  }

  await sendgrid.send(msg)
    .then(() => console.log('Email sent successfully'))
    .catch((error) => {
      throw new Error(error)
    })
}

const mapTextToMailTemplate = (body: Body): string => {
  const { content, email, name, page, phone, userType, challenge, lead } = body

  return `
    Nome: ${name}
    Lead: ${lead ? lead : 'Não informado'}
    E-mail: ${email}
    Celular: ${phone}
    ${content ? `Apresentação: ${content}` : ''}
    ${userType ? `Tipo de Usuário: ${userType} ` : ''}
    ${challenge ? `Desafio: ${challenge} ` : ''}

    Página de origem: ${page}
  `
}
