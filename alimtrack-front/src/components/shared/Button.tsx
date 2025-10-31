import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    loading = false,
    ...props
}) => {
    return (
        <button
            {...props}
            className={`btn btn-${variant} ${loading ? 'btn-loading' : ''}`}
            disabled={loading || props.disabled}
        >
            {loading ? 'Cargando...' : children}
        </button>
    );
};