import React, { useState } from 'react';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import type { RegisterRequest } from '../../types/auth';
import './RegisterForm.css'; // ← Importar el CSS

interface RegisterFormProps {
    onRegister: (userData: RegisterRequest) => Promise<void>;
    loading?: boolean;
    onSwitchToLogin: () => void;
    error?: string | null;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
    onRegister,
    loading = false,
    onSwitchToLogin,
    error
}) => {
    const [formData, setFormData] = useState<RegisterRequest>({
        nombre: '',
        username: '',
        email: '',
        password: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onRegister(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className={`register-form ${loading ? 'register-form--loading' : ''}`}>
            <h2 className="register-form__title">Crear Cuenta</h2>

            {error && (
                <div className="register-form__error">
                    ⚠ {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="register-form__form">
                <Input
                    label="Nombre Completo"
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Juan Pérez"
                    disabled={loading}
                />
                <Input
                    label="Usuario"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="juanperez"
                    disabled={loading}
                />
                <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="tu@email.com"
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
                    minLength={6}
                    disabled={loading}
                />
                <Button type="submit" loading={loading}>
                    {loading ? 'Creando cuenta...' : 'Registrarse'}
                </Button>
            </form>

            <div className="register-form__switch">
                <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="register-form__switch-button"
                    disabled={loading}
                >
                    ¿Ya tienes cuenta? Inicia sesión
                </button>
            </div>
        </div>
    );
};