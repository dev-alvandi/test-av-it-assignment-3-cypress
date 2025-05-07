import {LOGIN_URL} from "@/utils/constants"

describe('Login Tests', () => {
    it('Login with valid user: Stina', () => {
        cy.visit(LOGIN_URL);
        cy.get('input[name="username"]').type('stina');
        cy.get('input[name="password"]').type('fåGelskådning');
        cy.get('button[type="submit"]').click();
        cy.contains('Search for photos').should('be.visible');
    });

    it('Login with valid user: Johan', () => {
        cy.visit(LOGIN_URL);
        cy.get('input[name="username"]').type('johan');
        cy.get('input[name="password"]').type('FotoGrafeRing1!');
        cy.get('button[type="submit"]').click();
        cy.contains('Search for photos').should('be.visible');
    });

    it('Invalid login: wrong password', () => {
        cy.visit(LOGIN_URL);
        cy.get('input[name="username"]').type('stina');
        cy.get('input[name="password"]').type('wrongPassword');
        cy.get('button[type="submit"]').click();
        cy.contains('Invalid username or password').should('be.visible');
    });

    it('Invalid login: unknown username', () => {
        cy.visit(LOGIN_URL);
        cy.get('input[name="username"]').type('nonexistentuser');
        cy.get('input[name="password"]').type('somePassword');
        cy.get('button[type="submit"]').click();
        cy.contains('Invalid username or password').should('be.visible');
    });

    it('Invalid login: username filled, password empty (UI validation)', () => {
        cy.visit(LOGIN_URL);
        cy.get('input[name="username"]').type('stina');
        cy.get('button[type="submit"]').click();
        cy.get('input[name="password"]').then($el => {
            const input = $el[0] as HTMLInputElement;
            expect(input.validationMessage).to.not.be.empty;
        });
    });

    it('Invalid login: password filled, username empty (UI validation)', () => {
        cy.visit(LOGIN_URL);
        cy.get('input[name="password"]').type('fåGelskådning');
        cy.get('button[type="submit"]').click();
        cy.get('input[name="username"]').then($el => {
            const input = $el[0] as HTMLInputElement;
            expect(input.validationMessage).to.not.be.empty;
        });
    });

    it('Invalid login: both fields empty (UI validation)', () => {
        cy.visit(LOGIN_URL);
        cy.get('button[type="submit"]').click();
        cy.get('input[name="username"]').then($el => {
            const input = $el[0] as HTMLInputElement;
            expect(input.validationMessage).to.not.be.empty;
        });
    });
});
