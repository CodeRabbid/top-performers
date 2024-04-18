/// <reference types="cypress" />
const frontend_port = Cypress.env("frontend_port");

describe("registers", () => {
  const user_name = "Max Mustermann";
  const email = "max@mustermann.de";
  const password = "1234";
  const homepage_uri = "http://localhost:" + frontend_port + "/";

  beforeEach(() => {
    cy.visit(homepage_uri);
  });

  it("register user", () => {
    cy.get("#register").click();
    cy.get("#name").click();
    cy.get("#name").type(user_name);
    cy.get("#email").click();
    cy.get("#email").type(email);
    cy.get("#password").click();
    cy.get("#password").type(password);
    cy.get("#confirmPassword").click();
    cy.get("#confirmPassword").type(password);
    cy.get("form").submit();
    cy.url().should("eq", homepage_uri);
    cy.contains(user_name).should("be.visible");

    // logout

    cy.contains(user_name).click();
    cy.contains("Logout").click();
    cy.contains("Email").should("be.visible");
    cy.contains("Password").should("be.visible");
  });

  it("register existing user", () => {
    cy.get("#register").click();
    cy.get("#name").click();
    cy.get("#name").type(user_name);
    cy.get("#email").click();
    cy.get("#email").type(email);
    cy.get("#password").click();
    cy.get("#password").type(password);
    cy.get("#confirmPassword").click();
    cy.get("#confirmPassword").type(password);
    cy.get("form").submit();
    cy.get(".Toastify__toast-body").should("have.text", "User already exists");
  });
});
