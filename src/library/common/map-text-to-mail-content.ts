import { CreateContactCommand, CreateLeadRecordCommand } from '../../services'

export type mapTextToMailTemplateParams = CreateLeadRecordCommand | CreateContactCommand

export function mapTextToMailTemplate (params: mapTextToMailTemplateParams) {
  const { name, email, phone } = params

  return `
    Nome: ${name}
    E-mail: ${email}
    Celular: ${phone}
    ${'company' in params ? `Empresa: ${params.company}` : ''}
    ${'subject' in params ? `Assunto: ${params.subject}` : ''}
    ${'lead' in params ? `Lead: ${params.lead ? params.lead : 'Não informado'}` : ''}
    ${'content' in params ? `Apresentação: ${params.content ? params.content : 'Não informado'}` : ''}
    ${'challenge' in params ? `Desafio: ${params.challenge ? params.challenge : 'Não informado'}` : ''}
    ${'site' in params ? `Site: ${params.site ? params.site : 'Não informado'}` : ''}
    ${'userType' in params ? `Tipo de Usuário: ${params.userType}` : ''}
    ${'crm' in params ? `CRM: ${params.crm ? params.crm : 'Não informado'}` : ''}
    ${'challengeLink' in params ? `Link de Solução: ${params.challengeLink ? params.challengeLink : 'Não informado'}` : ''}
  `
}
