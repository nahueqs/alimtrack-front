import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
    return (
        <div className="input-group">
            {label && (
                <label className="input-label">
                    {label}
                    {props.required && <span className="input-required">*</span>}
                </label>
            )}
            <input
                {...props}
                className={`input-field ${error ? 'input-field--error' : ''}`}
            />
            {error && (
                <p className="input-error">
                    <span>⚠</span>
                    {error}
                </p>
            )}
        </div>
    );
};