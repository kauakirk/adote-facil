describe('Fluxo de Cadastro de Usuário', () => {
  it('deve permitir que um novo usuário se cadastre com sucesso', () => {
    cy.intercept('POST', '**/users').as('createUserRequest');

    cy.visit('http://localhost:3000/cadastro');

    const userEmail = `teste${Date.now()}@exemplo.com`;

    cy.get('input[name="name"]').type('Usuarioteste');
    cy.get('input[name="email"]').type(userEmail);
    cy.get('input[name="password"]').type('senha123');

    // CORREÇÃO: Usando o seletor correto que você encontrou
    cy.get('input[name="confirmPassword"]').type('senha123');

    cy.get('button[type="submit"]').click();

    cy.wait('@createUserRequest').its('response.statusCode').should('eq', 201);

    cy.url().should('include', '/login');
  });
});