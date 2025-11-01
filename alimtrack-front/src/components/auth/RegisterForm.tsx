import React, { useState } from 'react';
import './RegisterForm.css';
import { Input } from '../ui/input2/input2.tsx';

interface RegisterFormProps {
    onRegister: (userData: any) => Promise<void>;
    loading: boolean;
    onSwitchToLogin: () => void;
    error: string | null;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
                                                              onRegister,
                                                              loading,
                                                              onSwitchToLogin,
                                                              error
                                                          }) => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationErrors({});

        const errors: Record<string, string> = {};

        if (!userData.name.trim()) {
            errors.name = 'El nombre es requerido';
        }

        if (!userData.email.trim()) {
            errors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
            errors.email = 'El formato del email no es válido';
        }

        if (!userData.password) {
            errors.password = 'La contraseña es requerida';
        } else if (userData.password.length < 6) {
            errors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (!userData.confirmPassword) {
            errors.confirmPassword = 'Confirma tu contraseña';
        } else if (userData.password !== userData.confirmPassword) {
            errors.confirmPassword = 'Las contraseñas no coinciden';
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        try {
            await onRegister(userData);
        } catch (err) {
            // El error ya se maneja en el hook useAuth
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData(prev => ({
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
        <div className={`register-form ${loading ? 'register-form--loading' : ''}`}>
            <h2 className="register-form__title">Crear Cuenta</h2>

            {error && (
                <div className="register-form__error">
                    <span>⚠️</span>
                    {error}
                </div>
            )}

            <form className="register-form__form" onSubmit={handleSubmit} noValidate>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    label="Nombre Completo"
                    value={userData.name}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    required
                    disabled={loading}
                    error={validationErrors.name}
                />

                <Input
                    id="email"
                    name="email"
                    type="email"
                    label="Correo Electrónico"
                    value={userData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    required
                    disabled={loading}
                    error={validationErrors.email}
                />

                <Input
                    id="password"
                    name="password"
                    type="password"
                    label="Contraseña"
                    value={userData.password}
                    onChange={handleChange}
                    placeholder="Tu contraseña"
                    required
                    disabled={loading}
                    error={validationErrors.password}
                />

                <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    label="Confirmar Contraseña"
                    value={userData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirma tu contraseña"
                    required
                    disabled={loading}
                    error={validationErrors.confirmPassword}
                />

                <button
                    type="submit"
                    className="btn btn--primary btn--full"
                    disabled={loading}
                >
                    {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </button>
            </form>

            <div className="register-form__switch">
                <span>¿Ya tienes cuenta? </span>
                <button
                    type="button"
                    className="register-form__switch-button"
                    onClick={onSwitchToLogin}
                    disabled={loading}
                >
                    Inicia sesión aquí
                </button>
            </div>
        </div>
    );
};