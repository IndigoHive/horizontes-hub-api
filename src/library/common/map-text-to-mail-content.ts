import { Command } from '../../services'

export function mapTextToMailTemplate (command: Command) {
  const { content, email, name, phone, userType, challenge, lead, site } = command

  return `
    Nome: ${name}
    Lead: ${lead ? lead : 'Não informado'}
    E-mail: ${email}
    Celular: ${phone}
    ${site ? `Site: ${site}` : ''}
    ${content ? `Apresentação: ${content}` : ''}
    ${challenge ? `Desafio: ${challenge} ` : ''}

    Tipo de Usuário: ${userType}
  `
}
