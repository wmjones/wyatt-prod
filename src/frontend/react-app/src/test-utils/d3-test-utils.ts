import { fireEvent, RenderResult, screen, waitFor } from '@testing-library/react';
import React from 'react';
// Import d3 with type checking disabled in tests
const d3 = require('d3');

/**
 * D3 Testing Utilities
 * These functions help with testing D3 visualizations in React components
 */

/**
 * Creates a mock ref suitable for d3 visualization testing
 * @returns A mocked React.RefObject with a real SVG element
 */
export function createMockD3Ref(): React.RefObject<SVGSVGElement> {
  const mockSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  // Add some basic dimensions to the SVG
  mockSvg.setAttribute('width', '500');
  mockSvg.setAttribute('height', '300');

  // Add g elements that d3 commonly works with
  const gAxis = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gAxis.setAttribute('class', 'axis');
  mockSvg.appendChild(gAxis);

  const gContent = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gContent.setAttribute('class', 'content');
  mockSvg.appendChild(gContent);

  return { current: mockSvg };
}

/**
 * Sets up React.useRef mock for D3 testing
 * Call this in your test setup (beforeEach) to mock useRef
 * @returns The mock ref object that was created
 */
export function setupD3RefMock(): React.RefObject<SVGSVGElement> {
  const mockRef = createMockD3Ref();
  jest.spyOn(React, 'useRef').mockReturnValue(mockRef);
  return mockRef;
}

/**
 * Finds and returns a D3 selection within a component
 * @param selector CSS selector for the D3 element
 * @param container Container element (optional)
 * @returns D3 selection
 */
export function getD3Selection(
  selector: string,
  container: Element | null = document.body
): d3.Selection<d3.BaseType, unknown, null, undefined> {
  return d3.select(container).select(selector);
}

/**
 * Gets all D3 selections matching a selector
 * @param selector CSS selector for the D3 elements
 * @param container Container element (optional)
 * @returns D3 selection of multiple elements
 */
export function getAllD3Selections(
  selector: string,
  container: Element | null = document.body
): d3.Selection<d3.BaseType, unknown, null, undefined> {
  return d3.select(container).selectAll(selector);
}

/**
 * Gets a path's data from a D3 path element
 * @param pathSelector CSS selector for the path
 * @param container Container element (optional)
 * @returns Array of data points or null if path not found
 */
export function getD3PathData(
  pathSelector: string,
  container: Element | null = document.body
): { x: number, y: number }[] | null {
  const path = getD3Selection(pathSelector, container).node();
  if (!path) return null;

  // For a path with a datum (common in D3)
  return d3.select(path).datum() as { x: number, y: number }[] | null;
}

/**
 * Simulates a mouse hover on a D3 element
 * @param selector CSS selector for the D3 element to hover
 * @param x X coordinate for the hover
 * @param y Y coordinate for the hover
 * @param container Container element (optional)
 */
export function simulateD3MouseHover(
  selector: string,
  x: number,
  y: number,
  container: Element | null = document.body
): void {
  const element = container?.querySelector(selector) as SVGElement;
  if (!element) {
    throw new Error(`Element with selector "${selector}" not found`);
  }

  // Create a custom mouse event
  const mouseOverEvent = new MouseEvent('mouseover', {
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y
  });

  const mouseMoveEvent = new MouseEvent('mousemove', {
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y
  });

  // Dispatch the events
  element.dispatchEvent(mouseOverEvent);
  element.dispatchEvent(mouseMoveEvent);
}

/**
 * Simulates a mouse leave on a D3 element
 * @param selector CSS selector for the D3 element
 * @param container Container element (optional)
 */
export function simulateD3MouseLeave(
  selector: string,
  container: Element | null = document.body
): void {
  const element = container?.querySelector(selector) as SVGElement;
  if (!element) {
    throw new Error(`Element with selector "${selector}" not found`);
  }

  // Create a custom mouse event
  const mouseLeaveEvent = new MouseEvent('mouseleave', {
    bubbles: true,
    cancelable: true
  });

  // Dispatch the event
  element.dispatchEvent(mouseLeaveEvent);
}

/**
 * Gets attributes from a D3 element
 * @param selector CSS selector for the D3 element
 * @param attributes Array of attribute names to extract
 * @param container Container element (optional)
 * @returns Object with attribute name-value pairs
 */
export function getD3Attributes(
  selector: string,
  attributes: string[],
  container: Element | null = document.body
): Record<string, string | null> {
  const selection = getD3Selection(selector, container);
  const element = selection.node();

  if (!element) {
    throw new Error(`Element with selector "${selector}" not found`);
  }

  const result: Record<string, string | null> = {};
  attributes.forEach(attr => {
    result[attr] = (element as SVGElement).getAttribute(attr);
  });

  return result;
}

/**
 * Waits for a D3 transition to complete
 * @param container Container element with the D3 animation
 * @returns Promise that resolves when transitions are complete
 */
export async function waitForD3Transitions(
  container: Element | null = document.body
): Promise<void> {
  // Get all transitioning elements
  const transitioningElements = d3.select(container).selectAll('*').filter(function() {
    return d3.active(this);
  });

  // If no transitions, resolve immediately
  if (transitioningElements.empty()) {
    return Promise.resolve();
  }

  // Otherwise wait for transitions to complete
  // This is a simplified approach; actual transition time may vary
  return new Promise(resolve => {
    setTimeout(resolve, 1100); // Add a small buffer to the default 1000ms
  });
}

/**
 * Verifies the presence of specific D3 visualization components
 * @param container Container element
 * @param selectors Object mapping meaningful names to CSS selectors
 * @returns Object with boolean values indicating presence of each component
 */
export function checkD3Components(
  container: Element | null = document.body,
  selectors: Record<string, string>
): Record<string, boolean> {
  const results: Record<string, boolean> = {};

  Object.entries(selectors).forEach(([name, selector]) => {
    const element = container?.querySelector(selector);
    results[name] = !!element;
  });

  return results;
}

/**
 * Creates a basic D3 mock implementation for tests
 * Used to replace the d3 module in tests
 */
export function createD3Mock() {
  // Create a chainable mock function that returns itself
  const createChainableMock = () => {
    const mock = jest.fn();
    mock.mockReturnThis = function() {
      return this;
    };

    // Add methods that return the mock itself for chaining
    const methods = [
      'select', 'selectAll', 'append', 'attr', 'style', 'text', 'data', 'datum',
      'enter', 'exit', 'remove', 'call', 'on', 'transition', 'duration', 'ease',
      'filter', 'ticks', 'tickFormat', 'innerRadius', 'outerRadius', 'x', 'y',
      'y0', 'y1', 'domain', 'range', 'nice', 'curve'
    ];

    methods.forEach(method => {
      mock[method] = jest.fn().mockReturnValue(mock);
    });

    // Add special methods with custom returns
    mock.node = jest.fn().mockReturnValue({
      getBoundingClientRect: () => ({ width: 100, height: 100 }),
      getTotalLength: () => 100
    });

    mock.empty = jest.fn().mockReturnValue(false);

    return mock;
  };

  // Create the base chainable mock
  const chainableMock = createChainableMock();

  // Create mock d3 implementation
  return {
    select: jest.fn(() => chainableMock),
    selectAll: jest.fn(() => chainableMock),

    // Scale mocks
    scaleLinear: jest.fn(() => {
      const scale = jest.fn(value => value);
      scale.domain = jest.fn().mockReturnValue(scale);
      scale.range = jest.fn().mockReturnValue(scale);
      scale.nice = jest.fn().mockReturnValue(scale);
      return scale;
    }),

    // Random data functions
    randomNormal: jest.fn(() => jest.fn(() => 0.5)),

    // Transition management
    active: jest.fn(() => null),

    // Array functions
    min: jest.fn(arr => arr ? Math.min(...arr) : 0),
    max: jest.fn(arr => arr ? Math.max(...arr) : 1),
    extent: jest.fn(arr => arr ? [Math.min(...arr), Math.max(...arr)] : [0, 1]),

    // Shape generators
    line: jest.fn(() => {
      const lineGen = jest.fn(() => 'M0,0L1,1');
      lineGen.x = jest.fn().mockReturnValue(lineGen);
      lineGen.y = jest.fn().mockReturnValue(lineGen);
      lineGen.curve = jest.fn().mockReturnValue(lineGen);
      return lineGen;
    }),
    area: jest.fn(() => {
      const areaGen = jest.fn(() => 'M0,0L1,1L1,0Z');
      areaGen.x = jest.fn().mockReturnValue(areaGen);
      areaGen.y0 = jest.fn().mockReturnValue(areaGen);
      areaGen.y1 = jest.fn().mockReturnValue(areaGen);
      areaGen.curve = jest.fn().mockReturnValue(areaGen);
      return areaGen;
    }),

    // Axis generators
    axisBottom: jest.fn(() => createChainableMock()),
    axisLeft: jest.fn(() => createChainableMock()),

    // Curve types
    curveBasis: {},
    easeLinear: {},

    // Math functions
    range: jest.fn(n => Array.from({ length: n }, (_, i) => i)),

    // For pie charts
    pie: jest.fn(() => ({
      value: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      startAngle: jest.fn().mockReturnThis(),
      endAngle: jest.fn().mockReturnThis(),
      padAngle: jest.fn().mockReturnThis()
    })),
    arc: jest.fn(() => ({
      innerRadius: jest.fn().mockReturnThis(),
      outerRadius: jest.fn().mockReturnThis(),
      startAngle: jest.fn().mockReturnThis(),
      endAngle: jest.fn().mockReturnThis(),
      padAngle: jest.fn().mockReturnThis()
    }))
  };
}
