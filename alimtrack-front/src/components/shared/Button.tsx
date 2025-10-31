import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    loading = false,
    type = 'button', 
    ...props
}) => {
    return (
        <button
            {...props}
            type={type}
            className={`btn btn--${variant} ${loading ? 'btn--loading' : ''} ${props.className || ''}`}
            disabled={loading || props.disabled}
        >
            {loading ? 'Cargando...' : children}
        </button>
    );
};