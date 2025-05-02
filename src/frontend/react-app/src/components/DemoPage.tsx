import React, { useState, useEffect } from 'react';
import NormalDistribution from './visualization/NormalDistribution';

const DemoPage: React.FC = () => {
  const [mean, setMean] = useState<number>(0);
  const [stdDev, setStdDev] = useState<number>(1);
  const [userId, setUserId] = useState<string>('demo-user');
  const [paramId, setParamId] = useState<string>('normal_distribution_params');
  const [wsStatus, setWsStatus] = useState<'connected' | 'disconnected' | 'connecting'>('disconnected');
  const [lastUpdatedBy, setLastUpdatedBy] = useState<string>('System');
  const [logs, setLogs] = useState<Array<{time: string, message: string, type: 'info' | 'error' | 'success'}>>([
    { time: new Date().toTimeString().split(' ')[0], message: 'Demo page loaded. Use the controls above to test functionality.', type: 'info' }
  ]);

  // Simulated table data
  const [parameterData, setParameterData] = useState<any>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [connectionData, setConnectionData] = useState<any>(null);

  const addLog = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0];
    setLogs(prev => [...prev, { time: timeString, message, type }]);
  };

  const fetchParameters = async () => {
    try {
      addLog(`Fetching parameters for user ${userId}, parameter ${paramId}...`);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate response data
      const responseData = {
        mean: 0,
        stdDev: 1,
        lastUpdatedBy: 'System (Demo)',
        lastUpdatedAt: Date.now(),
        paramId: paramId,
        userId: userId,
        version: 'v1'
      };

      // Update the visualization parameters
      setMean(responseData.mean);
      setStdDev(responseData.stdDev);
      setLastUpdatedBy(responseData.lastUpdatedBy);

      // Update parameter status display
      setParameterData(responseData);

      // Add a history item
      setHistoryData([{
        parameter: 'mean',
        oldValue: 0,
        newValue: 0,
        time: new Date().toLocaleString(),
        updatedBy: 'System (Demo)'
      }]);

      addLog('Parameters fetched successfully', 'success');
    } catch (error) {
      addLog(`Error fetching parameters: ${error instanceof Error ? error.message : String(error)}`, 'error');
    }
  };

  const updateParameters = async () => {
    try {
      // Validate inputs
      if (isNaN(mean) || isNaN(stdDev)) {
        addLog('Invalid parameters. Please enter numeric values.', 'error');
        return;
      }

      if (stdDev <= 0) {
        addLog('Standard deviation must be positive.', 'error');
        return;
      }

      addLog(`Updating parameters: mean = ${mean}, stdDev = ${stdDev}, userId = ${userId}`);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update parameter status
      const timestamp = Date.now();
      const version = 'v' + (parseInt(String(Math.random() * 5)) + 1);

      setParameterData({
        paramId: paramId,
        mean: mean,
        stdDev: stdDev,
        lastUpdatedAt: timestamp,
        lastUpdatedBy: `${userId} (Demo)`,
        version: version
      });

      setLastUpdatedBy(`${userId} (Demo)`);

      // Add history entry
      const param = Math.random() > 0.5 ? 'mean' : 'stdDev';
      const oldValue = (Math.random() * 2).toFixed(1);
      const newValue = (Math.random() * 2).toFixed(1);

      setHistoryData(prev => [{
        parameter: param,
        oldValue,
        newValue,
        time: new Date().toLocaleString(),
        updatedBy: `${userId} (Demo)`
      }, ...prev]);

      addLog('Parameters updated successfully', 'success');
    } catch (error) {
      addLog(`Error updating parameters: ${error instanceof Error ? error.message : String(error)}`, 'error');
    }
  };

  const toggleWebSocketConnection = () => {
    if (wsStatus === 'connected') {
      // Disconnect
      setWsStatus('disconnected');
      setConnectionData(null);
      addLog('WebSocket disconnected', 'info');
    } else {
      // Connect
      setWsStatus('connecting');
      addLog('Connecting to WebSocket...', 'info');

      // Simulate connection delay
      setTimeout(() => {
        // Simulate successful connection
        setWsStatus('connected');

        // Generate a fake connection ID
        const connectionId = 'demo-conn-' + Math.random().toString(36).substring(2, 10);

        // Update connection status
        setConnectionData({
          connectionId,
          userId,
          connectedAt: new Date().toLocaleString(),
          ttl: new Date(Date.now() + 86400000).toLocaleString()
        });

        addLog(`WebSocket connected. Connection ID: ${connectionId}`, 'success');

        // Simulate parameter updates from other users occasionally
        simulateUpdates();
      }, 1500);
    }
  };

  const simulateUpdates = () => {
    if (wsStatus === 'connected') {
      setTimeout(() => {
        // Random chance of update
        if (Math.random() > 0.7) {
          // Simulate receiving a message
          const randomMean = parseFloat((Math.random() * 4 - 2).toFixed(1));
          const randomStdDev = parseFloat((Math.random() * 1.5 + 0.5).toFixed(1));
          const randomUser = 'user-' + Math.floor(Math.random() * 1000);

          addLog(`Received parameter update from ${randomUser}`, 'info');

          setMean(randomMean);
          setStdDev(randomStdDev);
          setLastUpdatedBy(`${randomUser} (Demo)`);

          // Update parameter status
          const timestamp = Date.now();
          const version = 'v' + (parseInt(String(Math.random() * 5)) + 1);

          setParameterData({
            paramId: paramId,
            mean: randomMean,
            stdDev: randomStdDev,
            lastUpdatedAt: timestamp,
            lastUpdatedBy: `${randomUser} (Demo)`,
            version: version
          });

          // Add history entry
          const param = Math.random() > 0.5 ? 'mean' : 'stdDev';
          const oldValue = (Math.random() * 2).toFixed(1);
          const newValue = (Math.random() * 2).toFixed(1);

          setHistoryData(prev => [{
            parameter: param,
            oldValue,
            newValue,
            time: new Date().toLocaleString(),
            updatedBy: `${randomUser} (Demo)`
          }, ...prev]);
        }

        // Continue simulation if still connected
        if (wsStatus === 'connected') {
          simulateUpdates();
        }
      }, 5000 + Math.random() * 10000); // Random interval between 5-15 seconds
    }
  };

  // Initial fetch of parameters
  useEffect(() => {
    fetchParameters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="visualizer">
      <h2>Normal Distribution Visualizer</h2>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            marginRight: '8px',
            backgroundColor:
              wsStatus === 'connected' ? 'var(--success-color)' :
              wsStatus === 'connecting' ? 'var(--warning-color)' :
              'var(--error-color)'
          }}
        ></div>
        <span>{
          wsStatus === 'connected' ? 'Connected' :
          wsStatus === 'connecting' ? 'Connecting...' :
          'Disconnected'
        }</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: '200px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 500 }} htmlFor="mean">Mean (μ)</label>
          <input
            type="number"
            id="mean"
            value={mean}
            onChange={e => setMean(parseFloat(e.target.value))}
            step="0.1"
            style={{ padding: '8px', border: '1px solid var(--light-gray)', borderRadius: '4px' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', minWidth: '200px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 500 }} htmlFor="stdDev">Standard Deviation (σ)</label>
          <input
            type="number"
            id="stdDev"
            value={stdDev}
            onChange={e => setStdDev(parseFloat(e.target.value))}
            min="0.1"
            step="0.1"
            style={{ padding: '8px', border: '1px solid var(--light-gray)', borderRadius: '4px' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', minWidth: '200px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 500 }} htmlFor="user-id">User ID</label>
          <input
            type="text"
            id="user-id"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            style={{ padding: '8px', border: '1px solid var(--light-gray)', borderRadius: '4px' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', minWidth: '200px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 500 }} htmlFor="param-id">Parameter ID</label>
          <input
            type="text"
            id="param-id"
            value={paramId}
            onChange={e => setParamId(e.target.value)}
            style={{ padding: '8px', border: '1px solid var(--light-gray)', borderRadius: '4px' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', minWidth: '200px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 500 }}>&nbsp;</label>
          <button
            onClick={updateParameters}
            style={{
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '10px 15px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Update Parameters
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', minWidth: '200px' }}>
          <label style={{ marginBottom: '5px', fontWeight: 500 }}>&nbsp;</label>
          <button
            onClick={toggleWebSocketConnection}
            style={{
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '10px 15px',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            {wsStatus === 'connected' ? 'Disconnect WebSocket' : 'Connect WebSocket'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
        <NormalDistribution mean={mean} stdDev={stdDev} updatedBy={lastUpdatedBy} />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
        <div style={{ flex: 1, minWidth: '250px', border: '1px solid var(--light-gray)', borderRadius: '4px', padding: '10px' }}>
          <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px', borderBottom: '1px solid var(--light-gray)', paddingBottom: '5px' }}>
            Parameter Table
          </h4>
          <div>
            {parameterData ? (
              <>
                <div>Parameter ID: {parameterData.paramId}</div>
                <div>Mean: {parameterData.mean}</div>
                <div>StdDev: {parameterData.stdDev}</div>
                <div>Last Updated: {new Date(parameterData.lastUpdatedAt).toLocaleString()}</div>
                <div>Last Updated By: {parameterData.lastUpdatedBy}</div>
                <div>Version: {parameterData.version}</div>
              </>
            ) : (
              "Not fetched yet"
            )}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '250px', border: '1px solid var(--light-gray)', borderRadius: '4px', padding: '10px' }}>
          <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px', borderBottom: '1px solid var(--light-gray)', paddingBottom: '5px' }}>
            History Table
          </h4>
          <div>
            {historyData.length > 0 ? (
              historyData.map((item, index) => (
                <div key={index} style={{ borderBottom: '1px dashed #eee', padding: '5px 0', fontSize: '0.9em' }}>
                  <div>Parameter: {item.parameter}</div>
                  <div>Changed from {item.oldValue} to {item.newValue}</div>
                  <div>Time: {item.time}</div>
                  <div>By: {item.updatedBy}</div>
                </div>
              ))
            ) : (
              "No history yet"
            )}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '250px', border: '1px solid var(--light-gray)', borderRadius: '4px', padding: '10px' }}>
          <h4 style={{ color: 'var(--primary-dark)', marginBottom: '10px', borderBottom: '1px solid var(--light-gray)', paddingBottom: '5px' }}>
            Connection Table
          </h4>
          <div>
            {connectionData ? (
              <>
                <div>Connection ID: {connectionData.connectionId}</div>
                <div>User ID: {connectionData.userId}</div>
                <div>Connected At: {connectionData.connectedAt}</div>
                <div>TTL: {connectionData.ttl}</div>
              </>
            ) : (
              "Not connected"
            )}
          </div>
        </div>
      </div>

      <div style={{
        maxHeight: '200px',
        overflowY: 'auto',
        border: '1px solid var(--light-gray)',
        padding: '10px',
        borderRadius: '4px',
        fontFamily: 'monospace',
        backgroundColor: '#f8f8f8',
        marginTop: '20px'
      }}>
        {logs.map((log, index) => (
          <div key={index} style={{ marginBottom: '5px', padding: '3px 0', borderBottom: '1px solid #eee' }}>
            <span style={{ color: '#888', marginRight: '8px' }}>[{log.time}]</span>
            <span style={{
              color: log.type === 'error' ? 'var(--error-color)' :
                    log.type === 'success' ? 'var(--success-color)' :
                    'var(--primary-color)'
            }}>
              {log.message}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DemoPage;
