import React from 'react';
import { useTheme } from '../../contexts/ThemeContexts';
import './ThemeToggle.css';

export const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button 
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
            title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
        >
            <div className="theme-toggle__track">
                <div className="theme-toggle__thumb">
                    {theme === 'light' ? (
                        // Icono de sol (modo claro)
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"/>
                            <path d="M12 1v2"/>
                            <path d="M12 21v2"/>
                            <path d="m4.22 4.22 1.42 1.42"/>
                            <path d="m18.36 18.36 1.42 1.42"/>
                            <path d="M1 12h2"/>
                            <path d="M21 12h2"/>
                            <path d="m4.22 19.78 1.42-1.42"/>
                            <path d="m18.36 5.64 1.42-1.42"/>
                        </svg>
                    ) : (
                        // Icono de luna (modo oscuro)
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                        </svg>
                    )}
                </div>
            </div>
            <span className="theme-toggle__label">
                {theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
            </span>
        </button>
    );
};