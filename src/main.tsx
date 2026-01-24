// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';
import { AuthProvider } from './services/auth/authProvider/authProvider.tsx';

import 'antd/dist/reset.css'; // Importación de los estilos de Ant Design
import './styles/Index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
