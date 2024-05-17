describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users', {
      username: 'root',
      password: '123456',
    })
    cy.visit('http://localhost:5173')
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
      cy.contains('create new blog').as('btn')
      cy.get('@btn').click()
      cy.get('#blog-title').type('a blog')
      cy.get('#blog-author').type('root')
      cy.get('#blog-url').type('no url')
      cy.get('#create-blog-button').click()
    })

    describe('and a blog exists', function () {
      beforeEach(() => {
        cy.contains('create new blog').click()
        cy.get('#blog-title').type('another blog')
        cy.get('#blog-author').type('root')
        cy.get('#blog-url').type('no url')
        cy.get('#create-blog-button').click()
      })

      it.only('user can like a blog', function() {
        cy.contains('view').click()
        cy.contains('like').click()
      })
    })
  })
})