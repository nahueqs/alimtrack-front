import React, { useState } from 'react';
import './LoginForm.css';

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        console.log('🔴 1. handleSubmit ejecutado - preventDefault llamado');

        if (loading) {
            console.log('🔴 2. Loading activo - deteniendo submit');
            return;
        }

        if (!credentials.email || !credentials.password) {
            console.log('🔴 3. Campos vacíos - deteniendo submit');

            return;
        }
        console.log('🔴 4. Llamando a onLogin...');

        try {
            await onLogin(credentials);
            console.log('🔴 5. onLogin completado');

        } catch (err) {
            // El error ya se maneja en el hook useAuth
            console.log('🔴 6. Error en onLogin:', err);

        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
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

            {/* ✅ Añadir form tag y manejar onSubmit */}
            <form
                className="login-form__form"
                onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email" className="input-label">
                        Correo Electrónico
                        <span className="input-required">*</span>
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        className="input-field"
                        placeholder="email@unlu.edu.ar"
                        value={credentials.email}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="password" className="input-label">
                        Contraseña
                        <span className="input-required">*</span>
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        className="input-field"
                        placeholder="Tu contraseña"
                        value={credentials.password}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />
                </div>

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
                    type="button" //  Importante: type="button" para que no envíe el form
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