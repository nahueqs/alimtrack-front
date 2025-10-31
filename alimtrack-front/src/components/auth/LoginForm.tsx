import React, { useState } from 'react';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import type { LoginRequest } from '../../types/auth';
import './LoginForm.css'; // ← Importar el CSS

interface LoginFormProps {
    onLogin: (credentials: LoginRequest) => Promise<void>;
    loading?: boolean;
    onSwitchToRegister: () => void;
    error?: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
    onLogin,
    loading = false,
    onSwitchToRegister,
    error
}) => {
    const [formData, setFormData] = useState<LoginRequest>({
        email: '',
        password: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className={`login-form ${loading ? 'login-form--loading' : ''}`}>
            <h2 className="login-form__title">Iniciar Sesión</h2>

            {error && (
                <div className="login-form__error">
                    ⚠ {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="login-form__form">
                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="tuemail@unlu.edu.ar"
                    disabled={loading}
                />
                <Input
                    label="Contraseña"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    disabled={loading}
                />
                <Button type="submit" loading={loading}>
                    {loading ? 'Ingresando...' : 'Ingresar'}
                </Button>
            </form>

            <div className="login-form__switch">
                <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="login-form__switch-button"
                    disabled={loading}
                >
                    ¿No tenes cuenta? Registrarse
                </button>
            </div>
        </div>
    );
};