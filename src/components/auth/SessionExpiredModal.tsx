import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { authService } from '@/services/auth/AuthService';
import type { User } from '@/services/auth/User';

interface SessionExpiredModalProps {
  open: boolean;
  user: User | null;
  onSuccess: (token: string) => void;
  onCancel: () => void;
}

export const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({
  open,
  user,
  onSuccess,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      // Si tenemos el usuario, usamos su email. Si no, usamos el del form.
      const email = user?.email || values.email;

      if (!email) {
        message.error('No se pudo identificar el usuario.');
        return;
      }

      const response = await authService.login({
        email: email,
        password: values.password,
      });

      if (response.access_token) {
        message.success('Sesión restaurada');
        onSuccess(response.access_token);
        form.resetFields();
      }
    } catch (error) {
      message.error('Credenciales incorrectas o error al conectar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Sesión Expirada"
      open={open}
      footer={null}
      closable={false}
      maskClosable={false}
      centered
      zIndex={2000} // Asegurar que esté por encima de todo
    >
      <p style={{ marginBottom: '1.5rem' }}>
        Tu sesión ha expirado. Por favor, ingresa tu contraseña para continuar sin perder tu trabajo.
      </p>
      <Form form={form} onFinish={handleLogin} layout="vertical">
        {/* Si no hay usuario en contexto (raro pero posible), pedimos email */}
        {!user?.email && (
          <Form.Item
            name="email"
            label="Correo Electrónico"
            rules={[{ required: true, message: 'Ingresa tu email' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>
        )}

        {/* Si hay usuario, mostramos quién es */}
        {user?.email && (
          <div style={{ marginBottom: '1rem', color: '#666' }}>
            Usuario: <strong>{user.email}</strong>
          </div>
        )}

        <Form.Item
          name="password"
          label="Contraseña"
          rules={[{ required: true, message: 'Ingresa tu contraseña' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Tu contraseña" />
        </Form.Item>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: '1rem' }}>
          <Button onClick={onCancel} danger>
            Salir
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Restaurar Sesión
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
