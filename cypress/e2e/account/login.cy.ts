describe('Login Component', () => {
  beforeEach(() => {
    cy.viewport(1500, 1200)
    cy.visit('/login')
  })

  it('renders the login form', () => {
    cy.get('.login-card').should('exist')
    cy.get('.login-title').should('contain', 'Log in')
    cy.get('.email-input').should('exist')
    cy.get('.password-input').should('exist')
    cy.get('.login-button').should('exist')
    cy.get('.signup-link').should('have.attr', 'href', '/sign-up')
  })

  it('requires valid email', () => {
    cy.get('.login-button').should('be.disabled')
    cy.get('.password-input').type('testpassword')
    cy.get('.login-button').should('be.disabled')
    cy.get('.email-input').type('invalidemail')
    cy.get('.login-button').should('be.disabled')
  })

  it('requires password', () => {
    cy.get('.login-button').should('be.disabled')
    cy.get('.email-input').type('validemail@test.com')
    cy.get('.login-button').should('be.disabled')
  })

  it('signup button redirects to the signup page', () => {
    cy.get('.signup-link').click()
    cy.url().should('include', '/sign-up')
  })

  it('does not log in with invalid credentials', () => {
    cy.get('.email-input').type('invalidemail@test.com')
    cy.get('.password-input').type('invalidpassword')
    cy.get('.login-button').click()
    cy.url().should('include', '/login')
  })

  it('logging in redirects to sites page', () => {
    cy.login('paul')
    cy.url().should('include', '/sites')
  })

  it('logs in, logs out, logs in as different user', () => {
    cy.login('paul')
    cy.get('.account-logout-button').click()
    cy.get('#navbar-logout').click()
    cy.get('.account-logout-button').should('not.exist')
    cy.visit('/login')
    cy.login('jane')
  })

  it('user stays logged in after reload', () => {
    cy.login('john')
    cy.url().should('include', '/sites')
    cy.reload()
    cy.url().should('include', '/sites')
  })
})
