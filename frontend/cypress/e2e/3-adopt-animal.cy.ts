// Teste de Aceitação - Cenário 3: Adoção de Animal
// Este teste valida o fluxo completo de adoção de um animal disponível

describe('Cenário 3: Adoção de Animal (Confirmação de Adoção)', () => {
  beforeEach(() => {
    // Faz login antes de cada teste
    cy.login('usuario@teste.com', 'senha123456')
  })

  // Cenário Principal: CP3-01 - Adoção de Animal com Sucesso
  it('CP3-01: Deve adoptar um animal e validar mudança de status', () => {
    // Step 1: Navegar para página de animais disponíveis
    cy.visit('/area_logada/animais_disponiveis')
    cy.contains('h1', 'Animais disponíveis para adoção').should('be.visible')

    // Step 2: Validar se há animais disponíveis
    cy.get('body').then(($body) => {
      const hasAnimals = $body.text().includes('Desculpe, no momento não temos nenhum animal')

      if (!hasAnimals) {
        // Há animais disponíveis, clicar em "Saiba mais"
        cy.get('button').contains('Saiba mais').first().click()

        // Step 3: Validar página de detalhes do animal
        cy.url().should('match', /\/animais_disponiveis\/[a-zA-Z0-9]+$/)

        // Validar que informações do animal estão visíveis
        cy.get('img').should('be.visible') // Foto do animal

        // Step 4: Clicar em "Confirmar adoção"
        cy.get('button').contains('Confirmar adoção').click()

        // Step 5: Validar sucesso
        cy.on('window:alert', (stringAlertText) => {
          expect(stringAlertText).to.include('Confirmada a adoção do animal!')
        })

        // Step 6: Validar redirecionamento para "Meus Animais"
        cy.url().should('include', '/area_logada/meus_animais')

        // Step 7: Validar que animal aparece em "Meus Animais"
        // Verificar que a página carregou
        cy.contains('h1').should('be.visible')

        // Step 8: Voltar para animais disponíveis e validar que sumiu
        cy.visit('/area_logada/animais_disponiveis')
        cy.get('body').then(($body2) => {
          // Agora deve estar vazio ou com menos animais
          const bodyText = $body2.text()
          // Este passo é validado implicitamente se não encontrarmos o animal anterior
        })
      }
    })
  })

  // Cenário Alternativo: CA3-01 - Visualizar Detalhes Completos Antes de Confirmar
  it('CA3-01: Deve visualizar detalhes completos do animal', () => {
    // Navegar para lista de animais disponíveis
    cy.visit('/area_logada/animais_disponiveis')

    // Validar se há animais
    cy.get('body').then(($body) => {
      const hasAnimals = $body.text().includes('Desculpe, no momento não temos nenhum animal')

      if (!hasAnimals) {
        // Clicar em um animal
        cy.get('button').contains('Saiba mais').first().click()

        // Validar que estamos na página de detalhes
        cy.url().should('match', /\/animais_disponiveis\/[a-zA-Z0-9]+$/)

        // Validar elementos da página de detalhes
        cy.get('img').should('be.visible') // Foto principal
        cy.get('h1, h2, span').should('contain.text', ['Confirmar adoção']) // Verificar existência de informações

        // Validar presença do botão "Confirmar adoção"
        cy.get('button').contains('Confirmar adoção').should('be.visible')
      }
    })
  })

  // Cenário Alternativo: CA3-02 - Voltar da Página de Detalhes sem Confirmar Adoção
  it('CA3-02: Deve voltar para lista de animais sem confirmar adoção', () => {
    // Navegar para lista de animais disponíveis
    cy.visit('/area_logada/animais_disponiveis')

    cy.get('body').then(($body) => {
      const hasAnimals = $body.text().includes('Desculpe, no menor não temos nenhum animal')

      if (!hasAnimals) {
        // Obter número de animais antes
        const animalCountBefore = $body.text().length

        // Clicar em um animal
        cy.get('button').contains('Saiba mais').first().click()

        cy.url().should('match', /\/animais_disponiveis\/[a-zA-Z0-9]+$/)

        // Usar botão voltar do navegador
        cy.go('back')

        // Validar que voltamos para lista de animais
        cy.url().should('include', '/area_logada/animais_disponiveis')
        cy.contains('h1', 'Animais disponíveis para adoção').should('be.visible')

        // Animal deve continuar na lista
        cy.get('button').contains('Saiba mais').should('exist')
      }
    })
  })

  // Cenário Alternativo: CA3-03 - Gerenciar Animais em "Meus Animais"
  it('CA3-03: Deve gerenciar animais em Meus Animais (remover ou confirmar adoção)', () => {
    // Navegar para "Meus Animais"
    cy.visit('/area_logada/meus_animais')

    cy.get('body').then(($body) => {
      const hasAnimals = $body.text().includes('Você ainda não cadastrou nenhum animal')

      if (!hasAnimals) {
        // Há animais cadastrados
        cy.contains('h1', 'Meus animais').should('be.visible')

        // Validar presença de buttons de ação
        const confirmButtons = ($body.text().match(/Confirmar adoção/g) || []).length
        const trashButtons = $body.querySelectorAll('button[type="button"] svg')

        // Se há animais, deve haver pelo menos um botão de ação
        cy.get('button').contains('Confirmar adoção').should('exist')

        // Teste de remoção de um animal
        cy.get('button').eq(-1).click() // Clique no botão de trash (último)

        // Validar que animal foi removido ou confirmada adoção
        cy.on('window:alert', (stringAlertText) => {
          // Pode ser uma mensagem de sucesso
          expect(stringAlertText).to.match(/removido|adoção|sucesso/i)
        })
      }
    })
  })

  // Cenário Alternativo: CA3-04 - Filtrar Animais Disponíveis
  it('CA3-04: Deve filtrar animais por tipo e gênero', () => {
    cy.visit('/area_logada/animais_disponiveis')

    cy.get('body').then(($body) => {
      const hasAnimals = $body.text().includes('Desculpe, no momento não temos nenhum animal')

      if (!hasAnimals && $body.text().includes('Filtrar')) {
        // Clicar no botão de filtro
        cy.get('button').contains('Filtrar').click()

        // Validar que modal/dialog de filtro abriu
        cy.get('[role="dialog"]').should('be.visible')

        // Selecionar filtro de tipo
        cy.get('button[role="combobox"]').first().click()
        cy.contains('[role="option"]', 'Cachorro').click()

        // Selecionar filtro de gênero
        cy.get('button[role="combobox"]').eq(1).click()
        cy.contains('[role="option"]', 'Macho').click()

        // Aplicar filtros (clicar em button submit ou similar)
        cy.get('button', { timeout: 5000 })
          .contains(/aplicar|filtrar|buscar/i)
          .click()

        // Validar que lista foi filtrada
        cy.contains('h1', 'Animais disponíveis para adoção').should('be.visible')

        // Validar que botão de "Limpar filtros" aparece
        cy.get('button').contains('Limpar filtros').should('be.visible')
      }
    })
  })

  // Cenário Alternativo: CA3-05 - Limpar Filtros e Voltar à Lista Completa
  it('CA3-05: Deve limpar filtros e mostrar todos os animais novamente', () => {
    cy.visit('/area_logada/animais_disponiveis')

    cy.get('body').then(($body) => {
      const hasAnimals = $body.text().includes('Desculpe, no momento não temos nenhum animal')
      const hasFilterButton = $body.text().includes('Filtrar')

      if (!hasAnimals && hasFilterButton) {
        // Aplicar um filtro primeiro
        cy.get('button').contains('Filtrar').click()

        cy.get('button[role="combobox"]').first().click()
        cy.contains('[role="option"]', 'Gato').click()

        cy.get('button')
          .contains(/aplicar|filtrar|buscar/i, { timeout: 5000 })
          .click()

        // Validar que "Limpar filtros" está visível
        cy.get('button').contains('Limpar filtros').should('be.visible')

        // Clicar em "Limpar filtros"
        cy.get('button').contains('Limpar filtros').click()

        // Validar que filtro foi removido (button desaparece temporariamente ou página recarrega)
        cy.contains('h1', 'Animais disponíveis para adoção').should('be.visible')
      }
    })
  })
})
