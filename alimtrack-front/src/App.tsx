import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { useAuth } from './hooks/useAuth';
import { ThemeProvider } from './contexts/ThemeContexts';
import './styles/globals.css';

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
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/" element={<Navigate to={initialRoute} replace />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;