import React from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import { AuthProvider } from './hooks/authProvider';
import { ThemeProvider } from './contexts/ThemeContexts';
import { routes } from './routes';

// Import global styles
import './components/ui/Button/Button.css';
import './components/ui/Input/Input.css';
import './components/shared/ThemeToggle.css';
import './App.css';

const AppRoutes = () => useRoutes(routes);

export const App: React.FC = () => (
  <ThemeProvider>
    <AuthProvider>
      <Router>
        <div className="app">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  </ThemeProvider>
);

