describe('Contacts', () => {
  function fillAndSubmitForm(name = '', lastName, email, phoneNumber) {
    if (name) cy.get('input[name="name"]').type(name)
    if (lastName) cy.get('input[name="lastName"]').type(lastName)
    if (email) cy.get('input[name="email"]').type(email)
    if (phoneNumber) cy.get('input.PhoneInputInput').type(phoneNumber)
    cy.get('.btn[type=submit]').click()
  }
  before(() => {
    cy.registerUserIfNeeded()
    cy.login()
  })
  beforeEach(() => {
    cy.visit('/')
    const user = Cypress.env('user')
    cy.get('input[type="text"]').type(user.username)
    cy.get('input[type="password"]').type(user.password)
    cy.get('button[type="submit"]').click()
  })

  it('Being in the front page width empty results', () => {
    const user = Cypress.env('user')

    cy.contains('.banner .container .logo-font', user.username)

    cy.url().should('not.contain', '/login')
  })

  it('Typing an empty name form', () => {
    cy.get('a.nav-link[href="/editor"]').click()
    fillAndSubmitForm(
      undefined,
      'last name',
      'example@of.email',
      '+34666666666',
    )
    cy.contains('.error-messages li', 'Bad Request: name should not be empty')
  })
  it('Typing an empty last name form', () => {
    cy.get('a.nav-link[href="/editor"]').click()
    fillAndSubmitForm('name', undefined, 'example@of.email', '+34666666666')
    cy.contains(
      '.error-messages li',
      'Bad Request: lastName should not be empty',
    )
  })
  it('Typing an empty email form', () => {
    cy.get('a.nav-link[href="/editor"]').click()
    fillAndSubmitForm('name', 'last name', undefined, '+34666666666')
    cy.contains('.error-messages li', 'Bad Request: email should not be empty')
  })
  it('Typing an empty phone number form', () => {
    cy.get('a.nav-link[href="/editor"]').click()
    fillAndSubmitForm('name', 'last name', 'example@of.email', undefined)
    cy.contains(
      '.error-messages li',
      'Bad Request: phoneNumber should not be empty',
    )
  })
  it('Typing a wrong email form', () => {
    cy.get('a.nav-link[href="/editor"]').click()
    fillAndSubmitForm('name', 'last name', 'wrong@email', '+34666666666')
    cy.contains('.error-messages li', 'Bad Request: email must be an email')
  })
  it('Typing a wrong phone number form', () => {
    cy.get('a.nav-link[href="/editor"]').click()
    fillAndSubmitForm('name', 'last name', 'example@of.email', '+346666666')
    cy.contains(
      '.error-messages li',
      'Bad Request: phoneNumber must be a valid phone number',
    )
  })
  it('Create and remove contact', () => {
    cy.get('a.nav-link[href="/editor"]').click()
    fillAndSubmitForm('name', 'last name', 'example@of.email', '+34666666666')
    cy.contains('h2', 'last name')
    cy.get('.btn.btn-danger[type="submit"]').click()
    cy.contains('.contact-preview', 'No contacts are here... yet.')
  })
  it('Email already exists', () => {
    cy.get('a.nav-link[href="/editor"]').click()
    fillAndSubmitForm('name', 'last name', 'example@of.email', '+34666666666')
    cy.get('a.nav-link[href="/editor"]').click()
    fillAndSubmitForm('name', 'last name', 'example@of.email', '+34666666666')
    cy.contains('.error-messages li', 'Duplicate entry: Email already exists')
    cy.visit('/')
    cy.get('.btn.btn-danger[type="submit"]').click()
    cy.contains('.contact-preview', 'No contacts are here... yet.')
  })
})
