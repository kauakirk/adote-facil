// Teste de Aceitação - Cenário 2: Cadastro de Animal para Adoção
// Este teste valida o fluxo completo de cadastro de um novo animal

describe('Cenário 2: Cadastro de Animal para Adoção', () => {
  beforeEach(() => {
    // Faz login antes de cada teste
    cy.login('usuario@teste.com', 'senha123456')

    // Navega para página de cadastro de animal
    cy.visit('/area_logada/disponibilizar_animal')
  })

  // Cenário Principal: CP2-01 - Cadastro Completo de Animal com Fotos
  it('CP2-01: Deve cadastrar um novo animal com todos os campos preenchidos', () => {
    // Step 1: Validar que página de cadastro está carregada
    cy.contains('h1', 'Cadastrar animal para adoção').should('be.visible')

    // Step 2-5: Preencher formulário básico
    cy.get('input[type="text"]').first().type('Rex') // Nome

    // Selecionar tipo (dropdown)
    cy.get('button[role="combobox"]').first().click() // Abre dropdown de tipo
    cy.contains('[role="option"]', 'Cachorro').click() // Seleciona Cachorro

    // Selecionar gênero (dropdown)
    cy.get('button[role="combobox"]').eq(1).click() // Abre dropdown de gênero
    cy.contains('[role="option"]', 'Macho').click() // Seleciona Macho

    // Step 6: Preencher raça
    cy.get('input[type="text"]').eq(1).type('Labrador')

    // Step 7: Preencher descrição
    cy.get('textarea').type('Animal muito dócil e carinhoso e energético')

    // Validar contador de caracteres
    cy.get('textarea').should('have.value', 'Animal muito dócil e carinhoso e energético')

    // Step 8-9: Upload de fotos
    // Criar arquivo fictício e fazer upload
    cy.fixture('animal-photo.jpg', 'binary')
      .then((fileContent) => {
        cy.get('input[type="file"]').selectFile(
          {
            contents: Cypress.Buffer.from(fileContent),
            fileName: 'animal-photo.jpg',
            mimeType: 'image/jpeg',
          },
          { force: true },
        )
      })

    // Validar que foto foi adicionada
    cy.get('img[alt="animal picture"]').should('be.visible')

    // Step 10: Fazer submit do formulário
    cy.get('button').contains('Cadastrar').click()

    // Step 11: Validar sucesso
    cy.on('window:alert', (stringAlertText) => {
      expect(stringAlertText).to.include('Animal cadastrado com sucesso!')
    })

    // Step 12: Validar redirecionamento para "Meus Animais"
    cy.url()
      .should('include', '/area_logada/meus_animais')
      .then(() => {
        // Validar que animal aparece na lista
        cy.contains('Rex').should('be.visible')
      })
  })

  // Cenário Alternativo: CA2-01 - Cadastro sem Nome (Campo Obrigatório)
  it('CA2-01: Deve mostrar erro ao tentar cadastrar sem preenchimento de Nome', () => {
    // Não preenchemos nome, preenchemos outros campos
    cy.get('button[role="combobox"]').first().click()
    cy.contains('[role="option"]', 'Gato').click()

    cy.get('button[role="combobox"]').eq(1).click()
    cy.contains('[role="option"]', 'Fêmea').click()

    // Upload de foto
    cy.fixture('animal-photo.jpg', 'binary').then((fileContent) => {
      cy.get('input[type="file"]').selectFile(
        {
          contents: Cypress.Buffer.from(fileContent),
          fileName: 'animal-photo.jpg',
          mimeType: 'image/jpeg',
        },
        { force: true },
      )
    })

    // Tentar cadastrar
    cy.get('button').contains('Cadastrar').click()

    // Validar erro
    cy.get('span').contains('O nome é obrigatório').should('be.visible')
    cy.url().should('include', '/disponibilizar_animal')
  })

  // Cenário Alternativo: CA2-02 - Cadastro sem Foto
  it('CA2-02: Deve mostrar erro ao tentar cadastrar sem foto', () => {
    // Preencher todos os campos exceto foto
    cy.get('input[type="text"]').first().type('Miau')

    cy.get('button[role="combobox"]').first().click()
    cy.contains('[role="option"]', 'Gato').click()

    cy.get('button[role="combobox"]').eq(1).click()
    cy.contains('[role="option"]', 'Fêmea').click()

    cy.get('input[type="text"]').eq(1).type('Siamês')

    // Tentar cadastrar sem foto
    cy.get('button').contains('Cadastrar').click()

    // Validar erro
    cy.get('span')
      .contains('Adicione ao menos uma foto do animal')
      .should('be.visible')
    cy.url().should('include', '/disponibilizar_animal')
  })

  // Cenário Alternativo: CA2-03 - Limite de Fotos (máximo 5)
  it('CA2-03: Deve bloquear upload de mais de 5 fotos', () => {
    // Preencher campos obrigatórios
    cy.get('input[type="text"]').first().type('Bolinha')

    cy.get('button[role="combobox"]').first().click()
    cy.contains('[role="option"]', 'Cachorro').click()

    cy.get('button[role="combobox"]').eq(1).click()
    cy.contains('[role="option"]', 'Macho').click()

    // Fazer upload de até 5 fotos
    for (let i = 0; i < 5; i++) {
      cy.fixture('animal-photo.jpg', 'binary')
        .then((fileContent) => {
          cy.get('input[type="file"]').selectFile(
            {
              contents: Cypress.Buffer.from(fileContent),
              fileName: `photo-${i}.jpg`,
              mimeType: 'image/jpeg',
            },
            { force: true },
          )
        })
    }

    // Validar que botão "Adicionar" está desabilitado
    cy.get('input[type="file"]').should('be.disabled')

    // Tentar fazer upload de 6ª foto deve mostrar modal
    cy.fixture('animal-photo.jpg', 'binary')
      .then((fileContent) => {
        cy.get('input[type="file"]').should('be.disabled')
      })

    // Verificar que há 5 fotos no carrossel
    cy.get('img[alt="animal picture"]').should('have.length', 5)
  })

  // Cenário Alternativo: CA2-04 - Descrição no Limite de Caracteres
  it('CA2-04: Deve limitar descrição a 300 caracteres', () => {
    // Preencher campos obrigatórios
    cy.get('input[type="text"]').first().type('Toby')

    cy.get('button[role="combobox"]').first().click()
    cy.contains('[role="option"]', 'Cachorro').click()

    cy.get('button[role="combobox"]').eq(1).click()
    cy.contains('[role="option"]', 'Macho').click()

    // Preencher descrição com exatamente 300 caracteres
    const longDescription = 'A'.repeat(300)
    cy.get('textarea').type(longDescription)

    // Validar que não aceita mais caracteres
    cy.get('textarea').invoke('val', longDescription + 'B').trigger('input')

    // O valor deve permanecer com apenas 300 caracteres
    cy.get('textarea').invoke('val').should('have.length', 300)
  })

  // Cenário Alternativo: CA2-05 - Campos Opcionais Vazios (Raça e Descrição)
  it('CA2-05: Deve permitir cadastro com Raça e Descrição vazios', () => {
    // Preencher apenas campos obrigatórios
    cy.get('input[type="text"]').first().type('Duke') // Nome

    cy.get('button[role="combobox"]').first().click() // Tipo
    cy.contains('[role="option"]', 'Cachorro').click()

    cy.get('button[role="combobox"]').eq(1).click() // Gênero
    cy.contains('[role="option"]', 'Macho').click()

    // Fazer upload de foto
    cy.fixture('animal-photo.jpg', 'binary')
      .then((fileContent) => {
        cy.get('input[type="file"]').selectFile(
          {
            contents: Cypress.Buffer.from(fileContent),
            fileName: 'animal-photo.jpg',
            mimeType: 'image/jpeg',
          },
          { force: true },
        )
      })

    // Deixar Raça e Descrição vazios, fazer submit
    cy.get('button').contains('Cadastrar').click()

    // Deve ter sucesso
    cy.on('window:alert', (stringAlertText) => {
      expect(stringAlertText).to.include('Animal cadastrado com sucesso!')
    })

    cy.url().should('include', '/area_logada/meus_animais')
    cy.contains('Duke').should('be.visible')
  })
})
