/// <reference types="cypress" />
describe('Home', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/')
    })

    it('should have all elements', () => {
        cy.get('[data-testid="input-player-name"]').type('Jogador 1')
        cy.get('[data-testid="input-gravatar-email"]').type('email@test.com')
        cy.get('[data-testid="header-profile-picture"]')
        // const btn = cy.get('[data-testid="btn-play"]')
        cy.get('[data-testid="btn-play"]').should('not.be.disabled')
        // btn.click()
    })

    it('should disable button if any info is not provided', () => {
        cy.get('[data-testid="input-player-name"]')
        cy.get('[data-testid="input-gravatar-email"]')
        cy.get('[data-testid="header-profile-picture"]')
        cy.get('[data-testid="btn-play"]').should('be.disabled')
    })


    it('should disable button if name is not provided', () => {
        cy.get('[data-testid="input-player-name"]')
        cy.get('[data-testid="input-gravatar-email"]').type('email@test.com')
        cy.get('[data-testid="header-profile-picture"]')
        cy.get('[data-testid="btn-play"]').should('be.disabled')
    })


    it('should disable button if email is not provided', () => {
        cy.get('[data-testid="input-player-name"]').type('Jogador 1')
        cy.get('[data-testid="input-gravatar-email"]')
        cy.get('[data-testid="header-profile-picture"]')
        cy.get('[data-testid="btn-play"]').should('be.disabled')
    })
})