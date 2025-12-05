import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useAuth} from './authProvider.tsx';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
    const {isAuthenticated, initialLoading} = useAuth();
    const location = useLocation();

    // Mientras el AuthProvider está validando el token, no renderizamos nada.
    // El AuthProvider ya está mostrando un spinner de pantalla completa.
    if (initialLoading) {
        return null;
    }

    // Si la carga inicial terminó y el usuario NO está autenticado, redirige a login.
    if (!isAuthenticated) {
        if (import.meta.env.DEV) {
            console.log('[ProtectedRoute] Usuario no autenticado, redirigiendo a /login desde:', location.pathname);
        }
        return <Navigate to="/login" state={{from: location}} replace/>;
    }

    // Si la carga inicial terminó y el usuario SÍ está autenticado, muestra la página protegida.
    return <>{children}</>;
};
