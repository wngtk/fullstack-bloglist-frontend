describe('Blog app', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5174')
  })

  it('Login form is shown', () => {
    cy.contains('login').click()
    cy.contains('username')
    cy.contains('password')
  })
})