/// <reference types="cypress" />

describe("visit top performers", () => {
  beforeEach(() => {
    const frontend_port = Cypress.env("frontend_port");
    cy.visit("http://localhost:" + frontend_port);
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
