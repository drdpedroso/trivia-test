/// <reference types="cypress" />
describe('Home', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/')
    })

    it('should have all elements', () => {
        cy.get('[data-testid="input-player-name"]').type('Jogador 1')
        const btn = cy.get('[data-testid="btn-play"]')
        btn.click()
    })
})