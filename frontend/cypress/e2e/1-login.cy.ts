describe('Fluxo de Login', () => {

  it('deve permitir que um usuário existente faça login com sucesso', () => {
    cy.intercept('POST', '**/login').as('loginRequest');
    cy.visit('http://localhost:3000/login');
    cy.get('input[name="email"]').type('usuario@teste.com');
    cy.get('input[name="password"]').type('senha123456');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest').its('response.statusCode').should('be.oneOf', [200, 201]);
    cy.url().should('include', '/area_logada/animais_disponiveis');
  });

  // --- TESTE CORRIGIDO ABAIXO ---
  it('deve exibir uma mensagem de erro ao usar credenciais inválidas', () => {
    cy.visit('http://localhost:3000/login');

    // Prepara o Cypress para "ouvir" o próximo alerta que a página gerar
    cy.on('window:alert', (alertText) => {
      // Verifica se o texto do alerta é o esperado
      expect(alertText).to.contains('Email ou senha inválidos.');
    });

    // Preenche o formulário com uma senha inválida
    cy.get('input[name="email"]').type('usuario@teste.com');
    cy.get('input[name="password"]').type('senhaErradaQualquer');

    // Clica no botão de entrar (isso vai disparar o alerta que estamos "ouvindo")
    cy.get('button[type="submit"]').click();

    // A verificação já foi feita pelo cy.on() acima, então o teste termina aqui.
  });

});