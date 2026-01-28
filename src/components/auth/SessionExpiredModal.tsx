import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, message, Alert } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { authService } from '@/services/auth/AuthService';
import type { User } from '@/services/auth/User';

interface SessionExpiredModalProps {
  open: boolean;
  user: User | null;
  onSuccess: (token: string, user: User) => void;
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

  // Resetear form cuando se abre/cierra
  useEffect(() => {
    if (open) {
      form.resetFields();
    }
  }, [open, form]);

  const handleLogin = async (values: any) => {
    setLoading(true);
    try {
      // Identidad estricta: Si hay usuario en contexto, DEBE ser ese email.
      const targetEmail = user?.email || values.email;

      if (!targetEmail) {
        message.error('Error de identidad: No se pudo determinar el usuario.');
        return;
      }

      const response = await authService.login({
        email: targetEmail,
        password: values.password,
      });

      if (response.access_token && response.user) {
        // Validación extra de seguridad: Verificar que el ID coincida si teníamos usuario previo
        if (user && response.user.id !== user.id) {
            message.error('Error de seguridad: La cuenta ingresada no coincide con la sesión actual.');
            // No hacemos onSuccess, forzamos al usuario a intentar de nuevo o cancelar (logout)
            return;
        }

        message.success('Sesión restaurada correctamente');
        onSuccess(response.access_token, response.user);
      } else {
        throw new Error('Respuesta incompleta del servidor');
      }
    } catch (error: any) {
      console.error('Error restaurando sesión:', error);
      // Mostrar error específico si viene del backend (ej: password incorrecto)
      const msg = error.message || 'Credenciales incorrectas o error de conexión.';
      message.error(msg);
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
      zIndex={2000}
      width={400}
    >
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <Alert 
            message="Por seguridad, tu sesión ha sido pausada." 
            description="Ingresa tu contraseña para continuar donde lo dejaste sin perder datos."
            type="warning" 
            showIcon 
            style={{ textAlign: 'left', marginBottom: '1rem' }}
        />
      </div>

      <Form form={form} onFinish={handleLogin} layout="vertical">
        {/* Caso 1: Usuario conocido (Contexto existe) - Email Bloqueado */}
        {user?.email && (
          <div style={{ 
              marginBottom: '1.5rem', 
              padding: '12px', 
              background: '#f5f5f5', 
              borderRadius: '6px',
              border: '1px solid #d9d9d9',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
          }}>
            <UserOutlined style={{ color: '#1890ff', fontSize: '18px' }} />
            <div>
                <div style={{ fontSize: '12px', color: '#888' }}>Usuario actual</div>
                <div style={{ fontWeight: 600, color: '#333' }}>{user.email}</div>
            </div>
          </div>
        )}

        {/* Caso 2: Usuario desconocido (Contexto perdido) - Email Editable */}
        {!user?.email && (
          <Form.Item
            name="email"
            label="Correo Electrónico"
            rules={[
                { required: true, message: 'Ingresa tu email' },
                { type: 'email', message: 'Email inválido' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="ejemplo@alimtrack.com" />
          </Form.Item>
        )}

        <Form.Item
          name="password"
          label="Contraseña"
          rules={[{ required: true, message: 'Ingresa tu contraseña' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Tu contraseña" size="large" />
        </Form.Item>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <Button 
            onClick={onCancel} 
            danger 
            type="text"
            disabled={loading}
          >
            Cerrar Sesión y Salir
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            size="large"
            style={{ minWidth: '140px' }}
          >
            Restaurar
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
