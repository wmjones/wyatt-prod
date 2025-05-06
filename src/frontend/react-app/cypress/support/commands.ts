// ***********************************************
// This file can be used to define custom commands
// and overwrite existing commands.
// ***********************************************

// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands

// Cypress.Commands.add('login', (email, password) => { ... })
// Cypress.Commands.add('dragAndDrop', (subject, target) => { ... })

// -- This is a parent command --
Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/');
  cy.findByLabelText(/username/i).type(username);
  cy.findByLabelText(/password/i).type(password);
  cy.findByRole('button', { name: /sign in/i }).click();
});

// Simulates Cognito authentication by setting local storage items
Cypress.Commands.add('mockAuth', () => {
  const fakeJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  localStorage.setItem('amplify-signin-with-hostedUI', 'true');
  localStorage.setItem('CognitoIdentityServiceProvider.MOCK_CLIENT_ID.LastAuthUser', 'TEST_USER');
  localStorage.setItem('CognitoIdentityServiceProvider.MOCK_CLIENT_ID.TEST_USER.accessToken', fakeJwt);
  localStorage.setItem('CognitoIdentityServiceProvider.MOCK_CLIENT_ID.TEST_USER.idToken', fakeJwt);
  localStorage.setItem('CognitoIdentityServiceProvider.MOCK_CLIENT_ID.TEST_USER.refreshToken', 'MOCK_REFRESH_TOKEN');
});

// Custom command to test D3 visualizations
Cypress.Commands.add('getD3Element', (selector: string) => {
  return cy.get(selector);
});

// Custom command to hover over a specific point in an SVG
Cypress.Commands.add('hoverSvgPoint', (svgSelector: string, x: number, y: number) => {
  cy.get(svgSelector)
    .trigger('mousemove', { clientX: x, clientY: y, force: true });
});

// Declare types for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>;
      mockAuth(): Chainable<void>;
      getD3Element(selector: string): Chainable<JQuery<HTMLElement>>;
      hoverSvgPoint(svgSelector: string, x: number, y: number): Chainable<void>;
    }
  }
}
