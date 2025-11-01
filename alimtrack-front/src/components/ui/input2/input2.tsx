import React from 'react';
import './Input2.css';

interface InputProps {
    id?: string;
    name: string;
    type?: 'text' | 'email' | 'password' | 'tel' | 'number';
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    className?: string;
}

export const Input: React.FC<InputProps> = ({
                                                id,
                                                name,
                                                type = 'text',
                                                label,
                                                value,
                                                onChange,
                                                placeholder = '',
                                                required = false,
                                                disabled = false,
                                                error,
                                                className = ''
                                            }) => {
    const inputId = id || name;

    return (
        <div className={`input-group ${className}`}>
            <label htmlFor={inputId} className="input-label">
                {label}
                {required && <span className="input-required">*</span>}
            </label>

            <input
                id={inputId}
                name={name}
                type={type}
                className={`input-field ${error ? 'input-field--error' : ''}`}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                required={required}
            />

            {error && (
                <div className="input-error">
                    <span>⚠️</span>
                    {error}
                </div>
            )}
        </div>
    );
};