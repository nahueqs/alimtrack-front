import React from 'react';
import {Button, Form, Input, message} from 'antd';
import {LockOutlined, MailOutlined} from '@ant-design/icons';
import type {LoginRequest} from '@/services/auth/Auth.ts';
import './LoginForm.css';

interface LoginFormProps {
    onLogin: (credentials: LoginRequest) => Promise<void>;
    loading: boolean;
    onSwitchToRegister: () => void;
    error: string | null; // Cambiado a string | null
}

export const LoginForm: React.FC<LoginFormProps> = ({
                                                        onLogin,
                                                        loading,
                                                        onSwitchToRegister,
                                                        error, // Usando el string de error
                                                    }) => {
    const [form] = Form.useForm();

    const onFinish = async (values: LoginRequest) => {
        console.log('[LoginForm] Formulario enviado. Llamando a onLogin...');
        try {
            await onLogin(values);
            console.log('[LoginForm] onLogin completado sin errores.');
            message.success('¡Bienvenido de nuevo!');
        } catch (err) {
            console.log('[LoginForm] onLogin lanzó un error que fue capturado aquí.');
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('[LoginForm] Falló la validación del formulario:', errorInfo);
        message.error('Por favor, corrige los errores en el formulario.');
    };

    return (
        <div className={`login-form ${loading ? 'login-form--loading' : ''}`}>
            <h2 className="login-form__title">Iniciar Sesión</h2>

            {error && ( // Si hay un string de error, lo muestra
                <div className="login-form__error">
                    {/* El emoji se renderiza a través de CSS con ::before */}
                    {error} {/* Muestra el mensaje de error real */}
                </div>
            )}

            <Form
                form={form}
                name="login"
                initialValues={{remember: true}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="on"
                layout="vertical"
                disabled={loading}
            >
                <Form.Item
                    label="Correo Electrónico"
                    name="email"
                    rules={[
                        {required: true, message: 'Por favor ingresa tu correo electrónico!'},
                        {type: 'email', message: 'El formato del correo electrónico no es válido!'},
                    ]}
                >
                    <Input prefix={<MailOutlined/>} placeholder="email@unlu.edu.ar"/>
                </Form.Item>

                <Form.Item
                    label="Contraseña"
                    name="password"
                    rules={[{required: true, message: 'Por favor ingresa tu contraseña!'}]}
                >
                    <Input.Password prefix={<LockOutlined/>} placeholder="Tu contraseña"/>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Iniciar Sesión
                    </Button>
                </Form.Item>
            </Form>

            <div className="login-form__switch">
                <span>¿No tienes cuenta? </span>
                <Button type="link" onClick={onSwitchToRegister} disabled={loading}>
                    Regístrate aquí
                </Button>
            </div>


        </div>
    );
};
