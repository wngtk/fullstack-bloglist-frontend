describe('Blog app', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5174')
  })

  it('Login form is shown', () => {
    cy.contains('login').click()
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', () => {
    beforeEach(()=>{
      cy.contains('login').click()
    })

    it('succeeds with correct credentials', () => {
      cy.get('input:first').type('root')
      cy.get('input:last').type('123456')
      cy.get('#login-button').click()
      cy.contains('root logged in')
    })

    it('fails with wrong credentials', () => {
      cy.get('input:first').type('root')
      cy.get('input:last').type('wrongpassword')
      cy.get('#login-button').click()
      cy.contains('root logged in').should('not.exist')
    })
  })
})