import { Command } from '../services'

export function mapTextToMailTemplate (command: Command) {
  const { content, email, name, page, phone, userType, challenge, lead } = command

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
