// Copyright (c) 2019 Applitools
// https://github.com/cypress-io/cypress-example-realworld

describe('Login', () => {
  before(() => cy.registerUserIfNeeded())
  beforeEach(() => {
    cy.visit('/')
    // we are not logged in
  })

  it('does not work with weak password', () => {
    cy.contains('a.nav-link', 'Sign in').click()

    cy.get('input[type="text"]').type('wrong@email.com')
    cy.get('input[type="password"]').type('no-such-user')
    cy.get('button[type="submit"]').click()

    // error message is shown and we remain on the login page
    cy.contains('.error-messages li', 'Bad Request: password too weak')
    cy.url().should('contain', '/login')
  })

  it('does not work with password too short', () => {
    cy.contains('a.nav-link', 'Sign in').click()

    cy.get('input[type="text"]').type('wrong@email.com')
    cy.get('input[type="password"]').type('noR!')
    cy.get('button[type="submit"]').click()

    // error message is shown and we remain on the login page
    cy.contains(
      '.error-messages li',
      'Bad Request: password must be longer than or equal to 8 characters',
    )
    cy.url().should('contain', '/login')
  })

  it('does not work with wrong credentials', () => {
    cy.contains('a.nav-link', 'Sign in').click()

    cy.get('input[type="text"]').type('wrong@email.com')
    cy.get('input[type="password"]').type('no-such-user12R!!')
    cy.get('button[type="submit"]').click()

    // error message is shown and we remain on the login page
    cy.contains('.error-messages li', 'Bad Request: Invalid credentials')
    cy.url().should('contain', '/login')
  })

  it('logs in', () => {
    cy.contains('a.nav-link', 'Sign in').click()

    const user = Cypress.env('user')
    cy.get('input[type="text"]').type(user.username)
    cy.get('input[type="password"]').type(user.password)
    cy.get('button[type="submit"]').click()

    cy.contains('.banner .container .logo-font', user.username)

    cy.url().should('not.contain', '/login')
  })
})
