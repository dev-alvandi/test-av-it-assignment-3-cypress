import type {ImageResponse} from "@/utils/constants"
import {BASE_URL, LOGIN_URL, IMAGE_API_URL} from "@/utils/constants"


describe('Image Search Tests', () => {
    let keywords: string[] = [];

    beforeEach(() => {
        cy.visit(LOGIN_URL);
        cy.get('input[name="username"]').type('stina');
        cy.get('input[name="password"]').type('fåGelskådning');
        cy.get('button[type="submit"]').click();

        cy.request<ImageResponse>(IMAGE_API_URL).then((res) => {
            const allWords = res.body.results.flatMap((img) =>
                (img.description ?? '').split(/\s+/).map((w) => w.toLowerCase())
            );
            keywords = [...new Set(allWords.filter((word) => word.length > 2))];
        });
    });

    it('Search for a real keyword from API', () => {
        cy.then(() => {
            const keyword = keywords[0] ?? 'cat';
            cy.get('input[name="search_terms"]').type(keyword);
            cy.get('button[type="submit"]').click();
            cy.get('#searchResultsContainer').should('be.visible');
            cy.get('#searchResults img').its('length').should('be.gt', 0);
        });
    });

    it('Search is case insensitive', () => {
        cy.then(() => {
            const keyword = (keywords[1] ?? 'FLOWERS').toUpperCase();
            cy.get('input[name="search_terms"]').type(keyword);
            cy.get('button[type="submit"]').click();
            cy.get('#searchResultsContainer').should('be.visible');
            cy.get('#searchResults img').its('length').should('be.gt', 0);
        });
    });

    it('Invalid keyword returns no results', () => {
        cy.get('input[name="search_terms"]').type('invalidsearch123456');
        cy.get('button[type="submit"]').click();
        cy.get('#searchTermWithoutResults').should('be.visible');
    });

    it('Empty search input does not crash', () => {
        cy.get('input[name="search_terms"]').clear();
        cy.get('button[type="submit"]').click();
        cy.get('input[name="search_terms"]').should('exist');
    });
});
