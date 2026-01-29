import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Space } from 'antd';
import { LoginOutlined, ScheduleOutlined } from '@ant-design/icons';
import './PublicHeader.css';
import { useAuth } from '@/context/auth/AuthProvider';

export const PublicHeader: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <header className="public-dashboard-header">
      <h1
        className="public-dashboard-header__title"
        onClick={() => navigate('/public/producciones')}
        style={{ cursor: 'pointer' }}
      >
        AlimTrack UNLu
      </h1>
      <Space>
        <Button
          type="link"
          icon={<ScheduleOutlined />}
          onClick={() => navigate('/public/producciones')}
        >
          Producciones
        </Button>
        <Button
          type="link"
          icon={<LoginOutlined />}
          onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
        >
          {isAuthenticated ? 'Ir al Dashboard' : 'Iniciar Sesión'}
        </Button>
      </Space>
    </header>
  );
};
