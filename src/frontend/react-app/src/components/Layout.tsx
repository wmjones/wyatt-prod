import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="container">
      <header>
        <h1>D3 Visualization Dashboard</h1>
        <p>A platform for interactive data visualization</p>
        <div className="nav-links" style={{ textAlign: 'center', marginTop: '15px' }}>
          <a href="/" style={{ margin: '0 10px', color: 'var(--primary-color)', textDecoration: 'none' }}>Home</a>
          <a href="/demo" style={{ margin: '0 10px', color: 'var(--primary-color)', textDecoration: 'none' }}>Demo</a>
        </div>
      </header>

      <main>{children}</main>

      <footer>
        <p>D3 Visualization Dashboard - Deployed via CI/CD Pipeline</p>
      </footer>
    </div>
  );
};

export default Layout;
