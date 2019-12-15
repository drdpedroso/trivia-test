/// <reference types="cypress" />
describe('Game', () => {
    // beforeEach(() => {
    //     cy.visit('http://localhost:3000/')
    // })

    it('should have all elements', () => {
        const pName = 'Jogador 1'
        const minExpectedScoreValue = 10 + 25
        cy.addPlayer(pName)
        cy.server()
        cy.clock()
        cy.route('/api.php?amount=5').as('api')
        cy.visit('http://localhost:3000/game')
        cy.wait('@api')
        cy.get('[data-testid="header-player-name"]').contains(pName)
        const score = cy.get('[data-testid="header-score"]')
        score.contains('0')
        cy.get('[data-testid="question-category"]').should('not.be.empty')
        cy.get('[data-testid="question-text"]').should('not.be.empty')
        cy.tick(5000)
        cy.get('[data-testid="timer"]').contains('25')
        cy.get('[data-testid="correct-answer"]').click();
        cy.get('[data-testid="header-score"]').then(($span) => {
            const elementScore = $span.text();
            expect(Number(elementScore)).to.be.gt(minExpectedScoreValue)
        })
        cy.get('[data-testid="btn-next"]').click()
        cy.tick(5000)
        cy.get('[data-testid="timer"]').contains('25')
        cy.get('[data-testid="correct-answer"]').click();
        cy.get('[data-testid="header-score"]').then(($span) => {
            const elementScore = $span.text();
            expect(Number(elementScore)).to.be.gt(minExpectedScoreValue + minExpectedScoreValue)
        })
        cy.get('[data-testid="btn-next"]').click()
        cy.tick(5000)
        cy.get('[data-testid="timer"]').contains('25')
        cy.get('[data-testid="wrong-answer-0"]').click();
        cy.get('[data-testid="header-score"]').then(($span) => {
            const elementScore = $span.text();
            expect(Number(elementScore)).to.be.gt(minExpectedScoreValue + minExpectedScoreValue)
        })
        cy.get('[data-testid="btn-next"]').click()
        cy.tick(30000)
        cy.get('[data-testid="timer"]').contains('0')
        // cy.get('[data-testid="wrong-answer-0"]').click();
        cy.get('[data-testid="header-score"]').then(($span) => {
            const elementScore = $span.text();
            expect(Number(elementScore)).to.be.gt(minExpectedScoreValue + minExpectedScoreValue)
        })
        cy.get('[data-testid="btn-next"]').click()
        cy.tick(5000)
        cy.get('[data-testid="timer"]').contains('25')
        cy.get('[data-testid="correct-answer"]').click();
        cy.get('[data-testid="header-score"]').then(($span) => {
            const elementScore = $span.text();
            expect(Number(elementScore)).to.be.gt(minExpectedScoreValue * 3)
        })
        cy.get('[data-testid="btn-next"]').click()
        cy.get('[data-testid="Jogador 1"]').then(($span) => {
            const elementScore = $span.text();
            const s = elementScore.split('-')[1]
            expect(Number(s)).to.be.gt(minExpectedScoreValue * 3)
        })

    })
})