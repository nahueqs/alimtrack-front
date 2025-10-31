import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect } from 'react';

import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { useAuth } from './hooks/useAuth';
import { ThemeProvider } from './contexts/ThemeContexts';

import './components/shared//ThemeToggle.css';
import './components/shared/Input.css';
import './components/shared/Button.css';
import './components/auth/LoginForm.css'; 
import './components/auth/RegisterForm.css'; 
import './pages/LoginPage.css';
import './pages/DashboardPage.css';
import './index.css'



// Componente de prueba en ruta específica
const DeploymentTest = () => {
    useEffect(() => {
        console.log('✅ Deployment Test Component');
        console.log('Environment:', process.env.NODE_ENV);
        console.log('API URL:', process.env.REACT_APP_API_URL);
        console.log('App Name:', process.env.REACT_APP_NAME);
    }, []);

    return (
        <div style={{
            padding: '20px',
            margin: '20px',
            border: '2px solid green',
            borderRadius: '10px',
            backgroundColor: '#f0fff0',
            textAlign: 'center'
        }}>
            <h2>✅ ¡App desplegada en Vercel correctamente!</h2>
            <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
            <p><strong>API URL:</strong> {process.env.REACT_APP_API_URL || 'No configurada'}</p>
            <p><strong>App Name:</strong> {process.env.REACT_APP_NAME || 'No configurado'}</p>
            <p><strong>Build Date:</strong> {new Date().toLocaleString()}</p>

            <div style={{ marginTop: '20px' }}>
                <a href="/login" style={{ marginRight: '10px' }}>Ir a Login</a>
                <a href="/dashboard">Ir a Dashboard</a>
            </div>
        </div>
    );
};

function App() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Cargando...</p>
            </div>
        );
    }

    const initialRoute = user ? "/dashboard" : "/login";

    return (
        <ThemeProvider>
            <Router>
                <Routes>
                    {/* 🔥 NUEVA RUTA SOLO PARA PRUEBAS - acceder via /deploy-test */}
                    <Route path="/deploy-test" element={<DeploymentTest />} />

                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/" element={<Navigate to={initialRoute} replace />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;