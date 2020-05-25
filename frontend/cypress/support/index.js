// import '@cypress/code-coverage/support';

const apiUrl = Cypress.env('apiUrl')

// a custom Cypress command to login using XHR call
// and then set the received token in the local storage
// can log in with default user or with a given one
Cypress.Commands.add('login', (user = Cypress.env('user')) => {
  cy.request(
    'POST',
    `${apiUrl}/auth/signin`,
    Cypress._.pick(user, ['username', 'password']),
  )
    .its('body.accessToken')
    .should('exist')
    .then(token => {
      localStorage.setItem('token', token)
      // with this token set, when we visit the page
      // the web application will have the user logged in
    })

  cy.visit('/')
})

// creates a user with email and password
// defined in cypress.json environment variables
// if the user already exists, ignores the error
// or given user info parameters
Cypress.Commands.add('registerUserIfNeeded', (options = {}) => {
  const defaults = {
    ...Cypress.env('user'),
  }
  const user = Cypress._.defaults({}, options, defaults)
  cy.request({
    method: 'POST',
    url: `${apiUrl}/auth/signup`,
    body: user,
    failOnStatusCode: false,
  })
})
