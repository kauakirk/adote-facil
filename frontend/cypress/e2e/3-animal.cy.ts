Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

describe('Fluxo de Cadastro de Animal', () => {
  it('deve permitir que um usuário logado cadastre um novo animal para adoção', () => {
    cy.viewport(1280, 720);

    // --- ETAPA DE LOGIN ---
    cy.visit('http://localhost:3000/login');
    cy.get('input[name="email"]').type('usuario@teste.com');
    cy.get('input[name="password"]').type('senha123456');
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/area_logada/animais_disponiveis');

    // --- NAVEGAÇÃO DIRETA PARA O FORMULÁRIO ---
    cy.visit('http://localhost:3000/area_logada/disponibilizar_animal');

    // --- PREENCHIMENTO DO FORMULÁRIO ---
    cy.intercept('POST', '**/animals').as('createAnimalRequest');
    const petName = `PetDeTeste-${Date.now()}`;
    cy.get('input[name="name"]').type(petName);
    cy.get('input[name="race"]').type('Vira-lata Caramelo');
    cy.get('textarea[name="description"]').type('Um pet muito dócil e amigável.');
    
    // --- CORREÇÃO FINAL PARA OS MENUS ---
    // Seleciona o Tipo
    cy.contains('button', 'Selecione um tipo').click();
    cy.wait(500); // Espera o menu renderizar
    cy.get('[role="option"]').contains('Cachorro').click();

    // Seleciona o Gênero
    cy.contains('button', 'Selecione um gênero').click(); // <-- CORRIGIDO AQUI
    cy.wait(500); // Espera o menu renderizar
    cy.get('[role="option"]').contains('Macho').click();    // <-- CORRIGIDO AQUI
    
    cy.get('input[type="file"]').selectFile('cypress/fixtures/pet.webp', { force: true });
    cy.get('button[type="submit"]').click({ force: true });
    
    // --- VERIFICAÇÃO FINAL ---
    cy.wait('@createAnimalRequest').its('response.statusCode').should('eq', 201);
    cy.url().should('include', '/area_logada/meus_animais');
    cy.contains(petName).should('be.visible');
  });
});