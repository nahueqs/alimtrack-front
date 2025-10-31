import React, { useState } from 'react';

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

    // ✅ Manejar el submit previniendo el comportamiento por defecto
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // 👈 Esto evita que la página se recargue

        if (!userData.name || !userData.email || !userData.password) {
            return;
        }

        if (userData.password !== userData.confirmPassword) {
            // Manejar error de contraseñas que no coinciden
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

            {/* ✅ Añadir form tag y manejar onSubmit */}
            <form className="register-form__form" onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="name" className="input-label">
                        Nombre Completo
                        <span className="input-required">*</span>
                    </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        className="input-field"
                        placeholder="Tu nombre completo"
                        value={userData.name}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />
                </div>

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
                        placeholder="tu@email.com"
                        value={userData.email}
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
                        value={userData.password}
                        onChange={handleChange}
                        disabled={loading}
                        required
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="confirmPassword" className="input-label">
                        Confirmar Contraseña
                        <span className="input-required">*</span>
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        className="input-field"
                        placeholder="Confirma tu contraseña"
                        value={userData.confirmPassword}
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
                    {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </button>
            </form>

            <div className="register-form__switch">
                <span>¿Ya tienes cuenta? </span>
                <button
                    type="button" // 👈 Importante: type="button" para que no envíe el form
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