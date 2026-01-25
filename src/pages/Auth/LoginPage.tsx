import React, { useEffect, useState } from 'react';
import { LoginForm } from './components/LoginForm.tsx';
import { RegisterForm } from './components/RegisterForm.tsx';
import { useNavigate } from 'react-router-dom';
import logoUnlu from '@/assets/logoUnlu.png';
import logoCideta from '@/assets/logoCideta.png';
import { useAuth } from '@/context/auth/AuthProvider.tsx';
import { Card } from '@/components/ui';
import './LoginPage.css';
import { ScheduleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import type { LoginRequest, RegisterRequest } from '@/services/auth/Auth.ts';

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, loading, error, clearError, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user && !loading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, loading, navigate]);

  const handleLogin = async (credentials: LoginRequest) => {
    try {
      await login(credentials);
    } catch (err) {
      throw err;
    }
  };

  const handleRegister = async (userData: RegisterRequest) => {
    try {
      await register(userData);
    } catch (err) {
      throw err;
    }
  };

  const handleSwitchForm = () => {
    clearError();
    setIsLogin(!isLogin);
  };

  return (
    <div className="login-page">
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>

      <div className="login-page__container">
        <div className="login-page__header">
          <div className="login-page__images">
            <img src={logoUnlu} alt="Logo UNLu" className="login-page__image" />
            <img src={logoCideta} alt="Logo CIDETA" className="login-page__image" />
          </div>
          <h1 className="login-page__title">AlimTrack</h1>
          <p className="login-page__subtitle">Sistema de Gestión de Producciones</p>
        </div>

        <Card
          className="login-page__card"
          variant="elevated"
          size="lg"
          hoverEffect={true}
          style={{ width: '100%', maxWidth: '450px' }}
        >
          {isLogin ? (
            <LoginForm
              onLogin={handleLogin}
              onSwitchToRegister={handleSwitchForm}
              loading={loading}
              error={error}
            />
          ) : (
            <RegisterForm
              onRegister={handleRegister}
              onSwitchToLogin={handleSwitchForm}
              loading={loading}
              error={error}
            />
          )}
          <Button
            type="primary"
            icon={<ScheduleOutlined />}
            onClick={() => navigate('/public/producciones')}
          >
            Producciones públicas
          </Button>
        </Card>

        <div className="login-page__info">
          <p className="login-page__info-text">
            {import.meta.env.VITE_API_BASE_URL
              ? `Conectado a: ${import.meta.env.VITE_API_BASE_URL}`
              : 'Conectando a backend...'}
          </p>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
