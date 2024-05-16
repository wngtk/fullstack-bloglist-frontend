describe('Blog app', function () {
  beforeEach(function () {
    cy.visit('http://localhost:5174')
  })

  it('Login form is shown', function () {
    cy.contains('login').click()
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function () {
    beforeEach(()=>{
      cy.contains('login').click()
    })

    it('succeeds with correct credentials', function () {
      cy.get('input:first').type('root')
      cy.get('input:last').type('123456')
      cy.get('#login-button').click()
      cy.contains('root logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('input:first').type('root')
      cy.get('input:last').type('wrongpassword')
      cy.get('#login-button').click()
      cy.contains('root logged in').should('not.exist')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.contains('login').click()
      cy.get('input:first').type('root')
      cy.get('input:last').type('123456')
      cy.get('#login-button').click()      
    })

    it('A blog can be created', function () {
      cy.contains('create new blog').click()
      cy.get('#blog-title').type('a new blog')
      cy.get('#blog-author').type('root')
      cy.get('#blog-url').type('no url')
      cy.get('#create-blog-button').click()
    })
  })
})