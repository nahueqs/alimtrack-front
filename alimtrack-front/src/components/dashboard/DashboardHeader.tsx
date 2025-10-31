import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/authProvider';
import { ThemeToggle } from '../../components/shared/ThemeToggle';
import { MenuIcon, UserIcon } from '../../utils/Icons';
import logoCideta from '../../assets/logoCideta.png';

interface HeaderProps {
    title?: string;
    badge?: string;
    showImages?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
    title = "AlimTrack",
    badge,
    showImages = false
}) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        setIsUserMenuOpen(false);
    };

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
        setIsMenuOpen(false);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        setIsMenuOpen(false);
        setIsUserMenuOpen(false);
    };

    if (!user) {
        return null;
    }

    return (
        <header className="dashboard__header">
            <nav className="dashboard__nav container">
                <div className="dashboard__brand">
                    <img src={logoCideta} alt="logoCideta" className="dashboard_nav__image" />
                    <span className="dashboard__app-name">{title}</span>
                    {badge && <span className="dashboard__badge">{badge}</span>}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <ThemeToggle />

                    <button
                        className="dashboard__menu-toggle"
                        onClick={toggleMenu}
                        aria-label="Abrir menú"
                    >
                        <MenuIcon />
                    </button>

                    <div className="dashboard__user-menu">
                        <div className="dashboard__user-info">
                            <div className="dashboard__user-name">{user.nombre}</div>
                            <div className="dashboard__user-role">{user.rol.toLowerCase()}</div>
                        </div>

                        <div className="dashboard__dropdown">
                            <button
                                className="dashboard__menu-toggle"
                                onClick={toggleUserMenu}
                                aria-label="Menú de usuario"
                            >
                                <UserIcon />
                            </button>

                            <div className={`dashboard__dropdown-menu ${isUserMenuOpen ? 'dashboard__dropdown-menu--open' : ''}`}>
                                <button
                                    className="dashboard__dropdown-item"
                                    onClick={() => handleNavigation('/profile')}
                                >
                                    Mi Perfil
                                </button>
                                <button
                                    className="dashboard__dropdown-item"
                                    onClick={() => handleNavigation('/settings')}
                                >
                                    Configuración
                                </button>
                                <hr style={{ margin: '0.5rem 0', borderColor: 'var(--border-light)' }} />
                                <button
                                    className="dashboard__dropdown-item"
                                    onClick={handleLogout}
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {showImages && (
                <div className="dashboard_nav__images">
                    {/* Tus imágenes aquí si las necesitas */}
                </div>
            )}
        </header>
    );
};