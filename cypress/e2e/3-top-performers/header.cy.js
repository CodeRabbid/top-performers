/// <reference types="cypress" />

describe('visit top performers', () => {
  beforeEach(() => {
    cy.visit('https://upward-sales.onrender.com/');
  })

  it('displays title', () => {
    cy.get('#title').should('have.text', 'Top Performers')
  })
})



