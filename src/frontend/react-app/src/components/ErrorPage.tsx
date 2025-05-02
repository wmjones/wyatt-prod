import React from 'react';

const ErrorPage: React.FC = () => {
  return (
    <section className="error-container">
      <h2>Error</h2>
      <p>Something went wrong. Please try again later.</p>
      <div style={{ marginTop: '20px' }}>
        <a href="/" className="button">Return to Home</a>
      </div>
    </section>
  );
};

export default ErrorPage;
