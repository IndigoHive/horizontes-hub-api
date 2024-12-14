import { cogfy } from '../clients'
import { Command } from '../../services'

export async function createCogfyRecord (command: Command) {
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
      }
    }
  })
}
