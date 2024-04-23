/// <reference types="cypress" />
const frontend_port = Cypress.env("frontend_port");

describe("purchases", () => {
  const email = "test@user.com";
  const password = "1234";
  const login_uri = "http://localhost:" + frontend_port + "/login";
  const purchases_uri = "http://localhost:" + frontend_port + "/purchases";

  beforeEach(() => {
    cy.visit(login_uri);

    cy.get("#email").click();
    cy.get("#email").type(email);
    cy.get("#password").click();
    cy.get("#password").type(password);
    cy.get("#submit_login").click();
    cy.contains("Test User");

    cy.visit(purchases_uri);
  });

  it("view purchases", () => {
    cy.contains("Purchase Date").should("be.visible");
    cy.contains("adidas").should("be.visible");
  });
});
