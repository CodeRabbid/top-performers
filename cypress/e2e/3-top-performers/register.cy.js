/// <reference types="cypress" />

describe("registers", () => {
  beforeEach(() => {
    const frontend_port = Cypress.env("frontend_port");
    cy.visit("http://localhost:" + frontend_port);
  });

  it("register existing user", () => {
    cy.get("#register").click();
    cy.get("#name").click();
    cy.get("#name").type("Existing User");
    cy.get("#email").click();
    cy.get("#email").type("existing@user.de");
    cy.get("#password").click();
    cy.get("#password").type("1234");
    cy.get("#confirmPassword").click();
    cy.get("#confirmPassword").type("1234");
    cy.get("form").submit();
    cy.get(".Toastify__toast-body").should("have.text", "User already exists");
  });
});
