/// <reference types="cypress" />
describe('Ranking', () => {
    it('should display all elements and correct value in correct ranking order', () => {
        cy.addRanking([
            {name: 'Jogador 1', score: 100},
            {name: 'Jogador 2', score: 120},
            {name: 'Jogador 3', score: 82},
        ])
        cy.visit('http://localhost:3000/ranking')
        cy.get('[data-testid="Jogador 1-2"]')
        cy.get('[data-testid="profile-picture-1"]')
        cy.get('[data-testid="Jogador 2-1"]')
        cy.get('[data-testid="profile-picture-2"]')
        cy.get('[data-testid="Jogador 3-3"]')
        cy.get('[data-testid="profile-picture-3"]')
    })
})