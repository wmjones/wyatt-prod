import React from 'react';

const HomePage: React.FC = () => {
  return (
    <>
      <section className="welcome">
        <h2>Welcome to Your Visualization Hub</h2>
        <p>This React application features:</p>
        <ul>
          <li>Interactive D3.js visualizations</li>
          <li>User authentication via AWS Cognito</li>
          <li>Real-time collaborative editing</li>
          <li>Parameter history tracking</li>
        </ul>
      </section>

      <section className="status">
        <h2>Current Status</h2>
        <div className="status-card">
          <div className="status-indicator deployed"></div>
          <div className="status-details">
            <h3>React SPA</h3>
            <p>Deployed and working</p>
          </div>
        </div>

        <div className="status-card">
          <div className="status-indicator deployed"></div>
          <div className="status-details">
            <h3>DynamoDB Infrastructure</h3>
            <p>Deployed and ready for testing</p>
          </div>
        </div>

        <div className="status-card">
          <div className="status-indicator in-progress"></div>
          <div className="status-details">
            <h3>User Authentication</h3>
            <p>In development</p>
          </div>
        </div>

        <div className="status-card">
          <div className="status-indicator in-progress"></div>
          <div className="status-details">
            <h3>Interactive Visualizations</h3>
            <p>In development - see <a href="/demo" style={{ color: 'var(--primary-color)' }}>Demo</a></p>
          </div>
        </div>
      </section>

      <section className="infrastructure">
        <h2>DynamoDB Infrastructure</h2>
        <p>Our serverless backend uses DynamoDB for data storage with the following tables:</p>

        <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: 1, minWidth: '300px', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '10px' }}>Parameter Table</h3>
            <p><strong>Purpose:</strong> Stores visualization parameters</p>
            <p><strong>Features:</strong></p>
            <ul>
              <li>Partition key: paramId</li>
              <li>Sort key: timestamp</li>
              <li>GSI: UserIdIndex for user-specific queries</li>
              <li>Version tracking for parameter updates</li>
            </ul>
          </div>

          <div style={{ flex: 1, minWidth: '300px', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '10px' }}>History Table</h3>
            <p><strong>Purpose:</strong> Tracks parameter change history</p>
            <p><strong>Features:</strong></p>
            <ul>
              <li>Partition key: userId</li>
              <li>Sort key: timestamp</li>
              <li>GSIs: ParamNameIndex and ParamIdIndex</li>
              <li>Tracks old and new values for each change</li>
            </ul>
          </div>

          <div style={{ flex: 1, minWidth: '300px', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '10px' }}>Connection Table</h3>
            <p><strong>Purpose:</strong> Manages WebSocket connections</p>
            <p><strong>Features:</strong></p>
            <ul>
              <li>Partition key: connectionId</li>
              <li>GSI: UserConnectionsIndex</li>
              <li>TTL: Automatic cleanup of stale connections</li>
              <li>Supports real-time collaborative editing</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <a href="/demo" className="button">Try the Demo</a>
        </div>
      </section>
    </>
  );
};

export default HomePage;
