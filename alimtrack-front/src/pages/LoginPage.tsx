import React, { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import logoUnlu from '../assets/logoUnlu.png';
import logoCideta from '../assets/logoCideta.png';



export const LoginPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { login, register, loading, error, clearError } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (credentials: any) => {
        try {
            await login(credentials);
            // ✅ Navegar DIRECTAMENTE después del login exitoso
            navigate('/dashboard', { replace: true });
        } catch (err) {
            console.error('Login error:', err);
        }
    };

    const handleRegister = async (userData: any) => {
        try {
            await register(userData);
            // ✅ Navegar DIRECTAMENTE después del registro exitoso
            navigate('/dashboard', { replace: true });
        } catch (err) {
            console.error('Register error:', err);
        }
    };

    const handleSwitchForm = () => {
        clearError();
        setIsLogin(!isLogin);
    };

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