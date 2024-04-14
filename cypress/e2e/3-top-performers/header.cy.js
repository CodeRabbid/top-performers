/// <reference types="cypress" />

describe("visit top performers", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5000");
  });

  it("displays title", () => {
    cy.get("#logo").should("have.text", "Top Performers");
  });
});
