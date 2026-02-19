// Support file for E2E tests
// Add custom commands and global hooks here

// Cypress allows you to write custom commands
// Example command to login:
Cypress.Commands.add(
  'login',
  (email: string, password: string) => {
    cy.visit('/login')
    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)
    cy.get('button').contains('Login').click()
    cy.url().should('include', '/animais_disponiveis')
  },
)

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
    }
  }
}

export {}
