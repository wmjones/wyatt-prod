describe('Home Page', () => {
  beforeEach(() => {
    // Start from the home page
    cy.visit('/');

    // Mock the auth state to simulate a logged-in user
    cy.mockAuth();
  });

  it('displays the header with correct title', () => {
    // Check that the header is visible
    cy.get('header').should('be.visible');

    // Check for the title text
    cy.findByRole('heading', { name: /d3 visualization dashboard/i }).should('exist');
  });

  it('navigates to demo page correctly', () => {
    // Find and click a link/button to the demo page
    cy.findByRole('link', { name: /demo/i }).click();

    // Check that we're on the demo page
    cy.url().should('include', '/demo');

    // Wait for the page to load and verify a demo page element
    cy.findByText(/normal distribution/i).should('exist');
  });

  it('loads and displays visualization properly', () => {
    // Navigate to the demo or visualization page
    cy.findByRole('link', { name: /demo/i }).click();

    // Check that the SVG element for visualization exists
    cy.get('svg.chart').should('exist');

    // Check that specific D3 elements render
    cy.getD3Element('#distribution-curve').should('exist');
    cy.getD3Element('.x-axis').should('exist');
    cy.getD3Element('.y-axis').should('exist');

    // Wait for animation to complete
    cy.wait(1200);

    // Test hover interaction
    cy.hoverSvgPoint('svg.chart', 300, 150);

    // Check that tooltip appears
    cy.contains('Value:').should('be.visible');
    cy.contains('Density:').should('be.visible');
  });

  it('handles authentication error correctly', () => {
    // First clear the mock auth
    cy.clearLocalStorage();

    // Reload the page to trigger auth check
    cy.reload();

    // Check for login or auth error elements
    cy.findByText(/sign in/i).should('exist');
    // OR if there's an error message:
    // cy.findByText(/authentication required/i).should('exist');
  });
});
