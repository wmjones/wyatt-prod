// Mock implementation of D3
// This is imported by the tests, do not add tests to this file
const createChainableMock = () => {
  const mock = jest.fn();

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
const d3 = {
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

  scaleBand: jest.fn(() => {
    const scale = jest.fn(value => value);
    scale.domain = jest.fn().mockReturnValue(scale);
    scale.range = jest.fn().mockReturnValue(scale);
    scale.padding = jest.fn().mockReturnValue(scale);
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

module.exports = d3;
