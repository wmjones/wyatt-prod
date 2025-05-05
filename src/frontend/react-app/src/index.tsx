import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Initialize MSW in development environment
async function prepareApp() {
  if (process.env.NODE_ENV === 'development') {
    // Conditionally import MSW only in development
    const { worker } = await import('./mocks/browser');
    // Start the MSW worker
    await worker.start({ onUnhandledRequest: 'bypass' });
  }
}

// Render the application
const renderApp = () => {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Prepare and then render the app
prepareApp().then(renderApp);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
