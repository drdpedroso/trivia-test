/// <reference types="cypress" />
describe('Feedback', () => {
   before(() => {
       cy.setToken()
   })
    afterEach(() => {
        cy.clearLocalStorage()
    })

    it('should display all elements and correct value if less than 3 corrects', () => {
        cy.addPlayer('Jogador 2', 34, 2)
        cy.visit('http://localhost:3000/feedback')
        cy.get('[data-testid="feedback-text"]').contains('Podia ser melhor...')
        cy.get('[data-testid="feedback-total-question"]').contains('2')
        cy.get('[data-testid="feedback-total-score"]').contains('34')
        cy.get('[data-testid="header-score"]').contains('34')
    })

    it('should display all elements and correct value if more than 3 corrects', () => {
        cy.addPlayer('Jogador 2', 108, 5)
        cy.visit('http://localhost:3000/feedback')
        cy.get('[data-testid="feedback-text"]').contains('Mandou bem!')
        cy.get('[data-testid="feedback-total-question"]').contains('5')
        cy.get('[data-testid="feedback-total-score"]').contains('108')
        cy.get('[data-testid="header-score"]').contains('108')
    })
})