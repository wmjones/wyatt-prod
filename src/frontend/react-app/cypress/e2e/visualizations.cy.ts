describe('Visualization Features', () => {
  beforeEach(() => {
    // Mock the auth state
    cy.mockAuth();

    // Visit the visualization/demo page
    cy.visit('/demo');

    // Wait for the visualization to load
    cy.get('svg.chart').should('exist');
  });

  it('renders the normal distribution visualization', () => {
    // Check that the curve exists
    cy.getD3Element('#distribution-curve').should('exist');

    // Check that axes exist
    cy.getD3Element('.x-axis').should('exist');
    cy.getD3Element('.y-axis').should('exist');

    // Check that mean line exists
    cy.getD3Element('#mean-line').should('exist');

    // Check that standard deviation ranges exist
    cy.getD3Element('#std-dev-range-1').should('exist');
    cy.getD3Element('#std-dev-range-2').should('exist');
    cy.getD3Element('#std-dev-range-3').should('exist');
  });

  it('displays tooltips on hover interaction', () => {
    // Wait for D3 transitions to complete
    cy.wait(1200);

    // Hover over the distribution curve area
    cy.hoverSvgPoint('svg.chart', 300, 150);

    // Check that tooltip appears with correct format
    cy.contains('Value:').should('be.visible');
    cy.contains('Density:').should('be.visible');

    // Move mouse away
    cy.get('body').trigger('mousemove', { clientX: 0, clientY: 0 });

    // Check that tooltip disappears
    cy.contains('Value:').should('not.be.visible');
  });

  it('shows the last updated by text', () => {
    // Check for the last updated by text
    cy.contains(/Last updated by:/i).should('exist');
  });

  it('displays mean and standard deviation labels', () => {
    // Check for labels showing μ and σ values
    cy.getD3Element('#mean-label').should('exist');
    cy.getD3Element('#mean-label').invoke('text').should('match', /μ = .* σ = .*/);
  });

  it('has the correct standard deviation range labels', () => {
    // Check the standard deviation labels
    cy.getD3Element('#std-dev-label-1').should('exist').contains('68.2%');
    cy.getD3Element('#std-dev-label-2').should('exist').contains('95.4%');
    cy.getD3Element('#std-dev-label-3').should('exist').contains('99.7%');
  });
});
