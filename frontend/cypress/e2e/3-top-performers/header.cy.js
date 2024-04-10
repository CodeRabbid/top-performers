/// <reference types="cypress" />

describe('visit top performers', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  })

  it('displays title', () => {
    cy.get('#title').should('have.text', 'Top Performers')
  })
})



