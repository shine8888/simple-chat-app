/// <reference types="cypress" />

context('Home Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('Should be display a login page with an img', () => {
    cy.get('div').find('img').should('have.attr', 'alt');
  });

  it('Should be display a login page with 2 Buttons', () => {
    cy.get('div').find('button').should('have.length', 2);
  });

  it('Should be display a login page with Google Button', () => {
    cy.get('div')
      .find('button')
      .first()
      .children('svg')
      .should('have.attr', 'data-testid')
      .should('equal', 'GoogleIcon');
  });

  it('Should be display a login page with Facebook Button', () => {
    cy.get('div')
      .find('button')
      .last()
      .children('svg')
      .should('have.attr', 'data-testid')
      .should('equal', 'FacebookIcon');
  });

  it('Can login and view the main page', () => {
    cy.get('div').find('button').first().children('svg').click();
    cy.visit('http://localhost:3000/');
  });
});
