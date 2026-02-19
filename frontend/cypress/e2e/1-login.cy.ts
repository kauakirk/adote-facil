// Teste de Aceitação - Cenário 1: Login e Visualização de Animais
// Este teste valida o fluxo de autenticação e visualização de animais disponíveis

describe('Cenário 1: Login e Visualização de Animais Disponíveis', () => {
  beforeEach(() => {
    // Visita a página de login antes de cada teste
    cy.visit('/login')
  })

  // Cenário Principal: CP1-01 - Login com Credenciais Válidas
  it('CP1-01: Deve fazer login com credenciais válidas e visualizar animais disponíveis', () => {
    // Step 1: Validar que página de login está carregada
    cy.contains('h1', 'Faça login em nossa plataforma').should('be.visible')

    // Step 2: Preencher campo de email
    cy.get('input[type="email"]').type('usuario@teste.com').should('have.value', 'usuario@teste.com')

    // Step 3: Preencher campo de senha
    cy.get('input[type="password"]')
      .type('senha123456')
      .should('have.value', 'senha123456')

    // Step 4: Clicar no botão de login
    cy.get('button').contains('Login').click()

    // Step 5: Aguardar redirecionamento e validar URL
    cy.url()
      .should('include', '/area_logada/animais_disponiveis')
      .then(() => {
        // Step 6: Validar que título da página de animais aparece
        cy.contains('h1', 'Animais disponíveis para adoção').should('be.visible')
      })

    // Step 7: Validar lista de animais (se houver)
    // Aguarda o carregamento da página
    cy.get('p', { timeout: 5000 }).then(($content) => {
      const text = $content.text()
      // Se houver animais, validar lista; se não, validar mensagem de vazio
      if (text.includes('Desculpe')) {
        // Nenhum animal disponível
        cy.contains('Desculpe, no momento não temos nenhum animal disponível para adoção').should(
          'be.visible',
        )
      } else {
        // Há animais disponíveis
        cy.get('button').contains('Saiba mais').should('exist')
      }
    })
  })

  // Cenário Alternativo: CA1-01 - Login com Email Inválido
  it('CA1-01: Deve validar email inválido (sem @)', () => {
    // Step 1-3: Preencher forma com email inválido
    cy.get('input[type="email"]').type('email-invalido')
    cy.get('input[type="password"]').type('senha123456')

    // Step 4: Tentar fazer login
    cy.get('button').contains('Login').click()

    // Step 5: Validar que há mensagem de erro e não há redirecionamento
    cy.url().should('include', '/login')
    cy.get('span').contains('Email inválido').should('be.visible')
  })

  // Cenário Alternativo: CA1-02 - Login com Credenciais Incorretas
  it('CA1-02: Deve exibir erro ao fazer login com senha incorreta', () => {
    // Step 1-3: Preencher com email correto e senha incorreta
    cy.get('input[type="email"]').type('usuario@teste.com')
    cy.get('input[type="password"]').type('senhaErrada123')

    // Step 4: Fazer login
    cy.get('button').contains('Login').click()

    // Step 5: Validar erro e permanência na página de login
    cy.url().should('include', '/login')
    // Alert é mostrado pelo navegador
    cy.on('window:alert', (stringAlertText) => {
      expect(stringAlertText).to.contain('Email ou senha inválidos.')
    })
  })

  // Cenário Alternativo: CA1-03 - Senha Muito Curta (validação de client)
  it('CA1-03: Deve validar comprimento mínimo de senha (8 caracteres)', () => {
    // Step 1-3: Preencher com senha curta
    cy.get('input[type="email"]').type('usuario@teste.com')
    cy.get('input[type="password"]').type('123')

    // Step 4: Tentar fazer login
    cy.get('button').contains('Login').click()

    // Step 5: Validar mensagem de erro de validação
    cy.url().should('include', '/login')
    cy.get('span')
      .contains('A senha deve conter no mínimo 8 caracteres')
      .should('be.visible')
  })

  // Cenário Alternativo: CA1-04 - Link para Cadastro
  it('CA1-04: Deve exibir link para página de cadastro', () => {
    // Validar link "Cadastre-se"
    cy.contains('a', 'Cadastre-se').should('be.visible').should('have.attr', 'href', '/cadastro')
  })
})
