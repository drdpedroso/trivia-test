/// <reference types="cypress" />
describe('Game', () => {
    beforeEach(() => {
        cy.setToken()
    })
    it('should finish the complete game flow', () => {
        const pName = 'Jogador 1'
        const minExpectedScoreValue = 10 + 25
        cy.addPlayer(pName)
        cy.server()
        cy.clock()
        cy.route(`/api.php?*`).as('api')
        cy.visit('http://localhost:3000/game')
        cy.wait('@api')
        cy.get('[data-testid="header-player-name"]').contains(pName)
        cy.get('[data-testid="header-profile-picture"]')
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
        cy.wait(100)
        cy.tick(5000)
        cy.get('[data-testid="timer"]').contains('25')
        cy.get('[data-testid="correct-answer"]').click();
        cy.get('[data-testid="header-score"]').then(($span) => {
            const elementScore = $span.text();
            expect(Number(elementScore)).to.be.gt(minExpectedScoreValue + minExpectedScoreValue)
        })
        cy.get('[data-testid="btn-next"]').click()
        cy.wait(100)
        cy.tick(5000)
        cy.get('[data-testid="timer"]').contains('25')
        cy.get('[data-testid="wrong-answer-1"]').click();
        cy.get('[data-testid="header-score"]').then(($span) => {
            const elementScore = $span.text();
            expect(Number(elementScore)).to.be.gt(minExpectedScoreValue + minExpectedScoreValue)
        })
        cy.get('[data-testid="btn-next"]').click()
        cy.wait(100)
        cy.tick(30000)
        cy.get('[data-testid="timer"]').contains('0')
        // cy.get('[data-testid="wrong-answer-0"]').click();
        cy.get('[data-testid="header-score"]').then(($span) => {
            const elementScore = $span.text();
            expect(Number(elementScore)).to.be.gt(minExpectedScoreValue + minExpectedScoreValue)
        })
        cy.get('[data-testid="btn-next"]').click()
        cy.wait(100)
        cy.tick(5000)
        cy.get('[data-testid="timer"]').contains('25')
        cy.get('[data-testid="correct-answer"]').click();
        cy.get('[data-testid="header-score"]').then(($span) => {
            const elementScore = $span.text();
            expect(Number(elementScore)).to.be.gt(minExpectedScoreValue * 3)
        })
        cy.get('[data-testid="btn-next"]').click()
    })
    it('should show error message in case token is invalid', () => {
        localStorage.setItem('token', 'invalidtoken1234')
        cy.server()
        cy.route(`/api.php?*`).as('api')
        cy.visit('http://localhost:3000/game')
        cy.wait('@api')
        cy.get('[data-testid="input-player-name"]')
    })
})