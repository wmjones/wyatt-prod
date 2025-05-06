/**
 * Mock implementation of API service for testing
 *
 * This module mocks the api.ts functionality to allow for unit testing
 * without actual AWS API calls.
 *
 * Usage in tests:
 * 1. Automatic import: Jest automatically uses this mock when importing from '../services/api'
 * 2. Manual mock setup: jest.mock('../services/api') in your test file
 * 3. Configure behavior: Use the exported mock functions to set up test scenarios
 */

import {
  VisualizationParameters,
  ParameterHistory,
  ConnectionInfo
} from '../api';

// Mock data
const DEFAULT_PARAMS: VisualizationParameters = {
  paramId: 'normal_distribution_params',
  userId: 'test-user',
  mean: 0,
  stdDev: 1,
  timestamp: Date.now(),
  version: 'v1',
  lastUpdatedBy: 'System'
};

const DEFAULT_HISTORY: ParameterHistory[] = [
  {
    userId: 'test-user',
    timestamp: Date.now() - 1000 * 60 * 5,
    paramId: 'normal_distribution_params',
    paramName: 'mean',
    oldValue: 0,
    newValue: 0.5,
    updatedBy: 'test-user'
  },
  {
    userId: 'test-user',
    timestamp: Date.now() - 1000 * 60 * 10,
    paramId: 'normal_distribution_params',
    paramName: 'stdDev',
    oldValue: 1,
    newValue: 1.2,
    updatedBy: 'test-user'
  }
];

// Mock API state (used to store mock data during tests)
let mockApiState = {
  params: { ...DEFAULT_PARAMS },
  history: [...DEFAULT_HISTORY],
  connectionId: '',
  shouldFail: false,
  delay: 0
};

/**
 * Reset mock API state
 * Should be called in beforeEach() to ensure clean tests
 */
export const resetApiMockState = () => {
  mockApiState = {
    params: { ...DEFAULT_PARAMS },
    history: [...DEFAULT_HISTORY],
    connectionId: '',
    shouldFail: false,
    delay: 0
  };
};

/**
 * Configure API mock behavior
 */
export const configureApiMock = (config: {
  params?: Partial<VisualizationParameters>;
  history?: ParameterHistory[];
  shouldFail?: boolean;
  delay?: number;
}) => {
  if (config.params) {
    mockApiState.params = {
      ...mockApiState.params,
      ...config.params
    };
  }

  if (config.history) {
    mockApiState.history = config.history;
  }

  if (config.shouldFail !== undefined) {
    mockApiState.shouldFail = config.shouldFail;
  }

  if (config.delay !== undefined) {
    mockApiState.delay = config.delay;
  }
};

// API service class mock
class MockAPIService {
  private async simulateDelay() {
    if (mockApiState.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, mockApiState.delay));
    }
  }

  private checkShouldFail() {
    if (mockApiState.shouldFail) {
      throw new Error('API request failed');
    }
  }

  // Spy functions for tracking calls
  getVisualizationParametersSpy = jest.fn();
  updateVisualizationParametersSpy = jest.fn();
  getParameterHistorySpy = jest.fn();
  connectWebSocketSpy = jest.fn();
  disconnectWebSocketSpy = jest.fn();

  // Get parameters for a specific visualization
  async getVisualizationParameters(paramId: string, userId: string): Promise<VisualizationParameters> {
    this.getVisualizationParametersSpy(paramId, userId);
    await this.simulateDelay();
    this.checkShouldFail();

    return {
      ...mockApiState.params,
      paramId,
      userId
    };
  }

  // Update parameters for a visualization
  async updateVisualizationParameters(params: VisualizationParameters): Promise<VisualizationParameters> {
    this.updateVisualizationParametersSpy(params);
    await this.simulateDelay();
    this.checkShouldFail();

    // Update the stored params and return
    mockApiState.params = {
      ...params,
      timestamp: Date.now(),
      version: `v${Math.floor(Math.random() * 10) + 1}`,
      lastUpdatedBy: params.userId
    };

    return mockApiState.params;
  }

  // Get parameter history for a user
  async getParameterHistory(userId: string, paramId?: string): Promise<ParameterHistory[]> {
    this.getParameterHistorySpy(userId, paramId);
    await this.simulateDelay();
    this.checkShouldFail();

    // Filter history by paramId if provided
    return paramId
      ? mockApiState.history.filter(h => h.paramId === paramId)
      : mockApiState.history;
  }

  // Connect to WebSocket API
  async connectWebSocket(): Promise<string> {
    this.connectWebSocketSpy();
    await this.simulateDelay();
    this.checkShouldFail();

    mockApiState.connectionId = `ws-${Math.random().toString(36).substring(2, 15)}`;
    return mockApiState.connectionId;
  }

  // Disconnect from WebSocket API
  async disconnectWebSocket(connectionId: string): Promise<void> {
    this.disconnectWebSocketSpy(connectionId);
    await this.simulateDelay();
    this.checkShouldFail();

    if (mockApiState.connectionId === connectionId) {
      mockApiState.connectionId = '';
    }
  }
}

// Export singleton instance
export const apiService = new MockAPIService();

// Export types
export {
  VisualizationParameters,
  ParameterHistory,
  ConnectionInfo
};
