import React, { useState } from 'react';
import './LoginForm.css';
import { Input } from '../ui/input2/input2.tsx';

interface LoginFormProps {
    onLogin: (credentials: any) => Promise<void>;
    loading: boolean;
    onSwitchToRegister: () => void;
    error: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
                                                        onLogin,
                                                        loading,
                                                        onSwitchToRegister,
                                                        error
                                                    }) => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (loading) {
            return;
        }

        setValidationErrors({});

        const errors: Record<string, string> = {};

        if (!credentials.email.trim()) {
            errors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
            errors.email = 'El formato del email no es válido';
        }

        if (!credentials.password) {
            errors.password = 'La contraseña es requerida';
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        try {
            await onLogin(credentials);
        } catch (err) {
            // El error ya se maneja en el hook useAuth
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));

        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    return (
        <div className={`login-form ${loading ? 'login-form--loading' : ''}`}>
            <h2 className="login-form__title">Iniciar Sesión</h2>

            {error && (
                <div className="login-form__error">
                    <span>⚠️</span>
                    {error}
                </div>
            )}

            <form className="login-form__form" onSubmit={handleSubmit} noValidate>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    label="Correo Electrónico"
                    value={credentials.email}
                    onChange={handleChange}
                    placeholder="email@unlu.edu.ar"
                    required
                    disabled={loading}
                    error={validationErrors.email}
                />

                <Input
                    id="password"
                    name="password"
                    type="password"
                    label="Contraseña"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Tu contraseña"
                    required
                    disabled={loading}
                    error={validationErrors.password}
                />

                <button
                    type="submit"
                    className="btn btn--primary btn--full"
                    disabled={loading}
                >
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>
            </form>

            <div className="login-form__switch">
                <span>¿No tienes cuenta? </span>
                <button
                    type="button"
                    className="login-form__switch-button"
                    onClick={onSwitchToRegister}
                    disabled={loading}
                >
                    Regístrate aquí
                </button>
            </div>
        </div>
    );
};