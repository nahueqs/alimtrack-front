import React, { useState, useEffect } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useNavigate } from 'react-router-dom';
import logoUnlu from '../assets/logoUnlu.png';
import logoCideta from '../assets/logoCideta.png'
import { useAuth } from '../hooks/authProvider';
import './LoginPage.css';


export const LoginPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { login, register, loading, error, clearError, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('🔐 LoginPage - Estado:', {
            isAuthenticated,
            user,
            loading,
            hasUser: !!user
        });

        if (isAuthenticated && user && !loading) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, user, loading, navigate]);


    const handleLogin = async (credentials: any) => {
        try {
            const result = await login(credentials);
        } catch (err) {
            console.error('Login error:', err);
        }
    };

    const handleRegister = async (userData: any) => {
        try {
            const result =  await register(userData);
        } catch (err) {
            console.error('Register error:', err);
        }
    };

    const handleSwitchForm = () => {
        clearError();
        setIsLogin(!isLogin);
    };

    const { loading: authLoading } = useAuth();

    if (authLoading) {
        return (
            <div className="login-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Verificando sesión...</p>
                </div>
            </div>
        );
    }

    if (isAuthenticated && user) {
        console.log('🔐 LoginPage - Usuario autenticado, mostrando loading de redirección...');
        return (
            <div className="login-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Redirigiendo al dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="login-page">
            <div className="login-page__container">
                <div className="login-page__header">
                    <div className="login-page__images">
                        <img
                            src={logoUnlu}
                            alt="Imagen 1"
                            className="login-page__image"
                        />
                        <img
                            src={logoCideta}
                            alt="Imagen 2"
                            className="login-page__image"
                        />
                    </div>
                    <h1 className="login-page__title">AlimTrack</h1>
                    <p className="login-page__subtitle">Sistema de Gestión de Producciones</p>
                </div>

                <div className="login-page__card">
                    {isLogin ? (
                        <LoginForm
                            onLogin={handleLogin}
                            loading={loading}
                            onSwitchToRegister={handleSwitchForm}
                            error={error}
                        />
                    ) : (
                        <RegisterForm
                            onRegister={handleRegister}
                            loading={loading}
                            onSwitchToLogin={handleSwitchForm}
                            error={error}
                        />
                    )}
                </div>

                <div className="login-page__info">
                    <p className="login-page__info-text">
                        {import.meta.env.VITE_API_BASE_URL
                            ? `Conectado a: ${import.meta.env.VITE_API_BASE_URL}`
                            : 'Conectando a backend...'
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};