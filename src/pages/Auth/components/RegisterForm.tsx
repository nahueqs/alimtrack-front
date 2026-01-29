import React from 'react';
import { Button, Form, Input, message, Alert } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import type { RegisterRequest } from '@/services/auth/Auth.ts';
import './RegisterForm.css';

interface RegisterFormProps {
  onRegister: (userData: RegisterRequest) => Promise<void>;
  loading: boolean;
  onSwitchToLogin: () => void;
  error: string | null;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegister,
  loading,
  onSwitchToLogin,
  error,
}) => {
  const [form] = Form.useForm();

  // Deshabilitamos temporalmente el registro
  const isRegistrationDisabled = true;

  const onFinish = async (values: RegisterRequest) => {
    if (isRegistrationDisabled) {
      message.warning('El registro de nuevos usuarios está deshabilitado temporalmente.');
      return;
    }

    try {
      await onRegister(values);
      message.success('Registro exitoso. ¡Bienvenido!');
    } catch (err) {
      // El error ya fue manejado y mostrado por apiClient.
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    if (import.meta.env.DEV) {
      console.log('Failed:', errorInfo);
    }
    message.error('Por favor, corrige los errores en el formulario.');
  };

  return (
    <div className={`register-form ${loading ? 'register-form--loading' : ''}`}>
      <h2 className="register-form__title">Crear Cuenta</h2>

      {isRegistrationDisabled && (
        <Alert
          message="Registro Deshabilitado"
          description="Por el momento no se permiten nuevos registros. Contacte al administrador."
          type="warning"
          showIcon
          style={{ marginBottom: '1rem' }}
        />
      )}

      {error && !isRegistrationDisabled && (
        <div className="register-form__error">
          {error}
        </div>
      )}

      <Form
        form={form}
        name="register"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
        disabled={loading || isRegistrationDisabled} // Deshabilitamos todo el formulario
      >
        <Form.Item
          label="Nombre Completo"
          name="nombre"
          rules={[{ required: true, message: 'Por favor ingresa tu nombre completo!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Tu nombre completo" />
        </Form.Item>

        <Form.Item
          label="Correo Electrónico"
          name="email"
          rules={[
            { required: true, message: 'Por favor ingresa tu correo electrónico!' },
            { type: 'email', message: 'El formato del correo electrónico no es válido!' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="tu@email.com" />
        </Form.Item>

        <Form.Item
          label="Contraseña"
          name="password"
          rules={[
            { required: true, message: 'Por favor ingresa tu contraseña!' },
            { min: 6, message: 'La contraseña debe tener al menos 6 caracteres!' },
          ]}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Tu contraseña" />
        </Form.Item>

        <Form.Item
          label="Confirmar Contraseña"
          name="confirmPassword"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Por favor confirma tu contraseña!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('¡Las dos contraseñas que ingresaste no coinciden!')
                );
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Confirma tu contraseña" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading} disabled={isRegistrationDisabled}>
            Crear Cuenta
          </Button>
        </Form.Item>
      </Form>

      <div className="register-form__switch">
        <span>¿Ya tienes cuenta? </span>
        <Button type="link" onClick={onSwitchToLogin} disabled={loading}>
          Inicia sesión aquí
        </Button>
      </div>
    </div>
  );
};
