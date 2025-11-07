// components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './authProvider.tsx';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Muestra un loading mientras verifica la autenticación
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Verificando autenticación...</p>
      </div>
    );
  }

  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    // Guarda la ubicación actual para redirigir después del login
    console.log('Usuario no autenticado, redirigiendo a login desde:', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // Si está autenticado, muestra el contenido protegido
  return <>{children}</>;
};
