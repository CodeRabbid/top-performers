/// <reference types="cypress" />

describe("visit top performers", () => {
  beforeEach(() => {
    // const port = process.env.FRONTEND_PORT;
    const port = Cypress.env("port");
    cy.visit("http://localhost:" + port);
  });

  it("displays title", () => {
    cy.get("#logo").should("have.text", "Top Performers");
  });

  it("navigates to register page", () => {
    cy.get("#register").should("have.text", "Register");
    cy.get("#register").click();
    cy.contains("Name").should("be.visible");
    cy.contains("Email").should("be.visible");
    cy.contains("Password").should("be.visible");
  });
});
