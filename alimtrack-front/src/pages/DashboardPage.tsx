import React, { useState} from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContexts';
import { ThemeToggle } from '../components/shared/ThemeToggle';
import logoCideta from '../assets/logoCideta.png';


// Definir los iconos correctamente
const MenuIcon = () => (
    <svg className="dashboard__menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const UserIcon = () => (
    <svg className="dashboard__menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export const DashboardPage: React.FC = () => {
    const { user, logout } = useAuth();
    const { theme } = useTheme();
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
        return (
            <div className="dashboard">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cerrando sesión...</p>
                </div>
            </div>
        );
    }
    return (
        <div className="dashboard">
            {/* Header */}
            <header className="dashboard__header">
                <nav className="dashboard__nav container">
                    {/* Logo y nombre */}
                    <div className="dashboard__brand">
                        <img src={logoCideta} alt="logoCideta"  className="dashboard_nav__image">
                        </img>
                        <span className="dashboard__app-name">AlimTrack</span>
                        <span className="dashboard__badge">Dashboard</span>
                    </div>

                    {/* Menú hamburguesa y controles */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {/* Toggle del tema */}
                        <ThemeToggle />

                        {/* Menú hamburguesa */}
                        <button
                            className="dashboard__menu-toggle"
                            onClick={toggleMenu}
                            aria-label="Abrir menú"
                        >
                            <MenuIcon />
                        </button>

                        {/* Menú de usuario */}
                        <div className="dashboard__user-menu">
                            <div className="dashboard__user-info">
                                <div className="dashboard__user-name">{user?.nombre}</div>
                                <div className="dashboard__user-role">{user?.rol.toLowerCase()}</div>
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
            </header>

            {/* Main Content */}
            <main className="dashboard__main container">
                <div className="dashboard__welcome">
                    <h1 className="dashboard__welcome-title">
                        ¡Bienvenido, {user?.nombre}!
                    </h1>
                    <p className="dashboard__welcome-subtitle">
                        Sistema de gestión de producciones alimenticias - UNLU
                    </p>

                    <div className="dashboard__grid">
                        {/* Producciones */}
                        <div className="dashboard__card">
                            <h3 className="dashboard__card-title">Producciones</h3>
                            <p className="dashboard__card-description">
                                Gestiona y monitorea las producciones en curso. Inicia nuevas producciones y realiza seguimiento.
                            </p>
                            <div className="dashboard__card-actions">
                                <button
                                    className="dashboard__card-btn dashboard__card-btn--primary"
                                    onClick={() => handleNavigation('/producciones/nueva')}
                                >
                                    Iniciar Producción
                                </button>
                                <button
                                    className="dashboard__card-btn"
                                    onClick={() => handleNavigation('/producciones')}
                                >
                                    Ver Activas
                                </button>
                            </div>
                        </div>

                        {/* Recetas */}
                        <div className="dashboard__card">
                            <h3 className="dashboard__card-title">Recetas</h3>
                            <p className="dashboard__card-description">
                                Administra las recetas y sus versiones. Crea nuevas recetas o modifica las existentes.
                            </p>
                            <div className="dashboard__card-actions">
                                <button
                                    className="dashboard__card-btn dashboard__card-btn--primary"
                                    onClick={() => handleNavigation('/recetas/nueva')}
                                >
                                    Crear Receta
                                </button>
                                <button
                                    className="dashboard__card-btn"
                                    onClick={() => handleNavigation('/recetas')}
                                >
                                    Ver Listado
                                </button>
                            </div>
                        </div>

                        {/* Reportes */}
                        <div className="dashboard__card">
                            <h3 className="dashboard__card-title">Reportes</h3>
                            <p className="dashboard__card-description">
                                Genera reportes detallados y análisis de las producciones realizadas.
                            </p>
                            <div className="dashboard__card-actions">
                                <button
                                    className="dashboard__card-btn dashboard__card-btn--primary"
                                    onClick={() => handleNavigation('/reportes')}
                                >
                                    Generar Reporte
                                </button>
                                <button
                                    className="dashboard__card-btn"
                                    onClick={() => handleNavigation('/analiticas')}
                                >
                                    Ver Análiticas
                                </button>
                            </div>
                        </div>

                        {/* Configuración */}
                        <div className="dashboard__card">
                            <h3 className="dashboard__card-title">Configuración</h3>
                            <p className="dashboard__card-description">
                                Personaliza la aplicación y gestiona tus preferencias.
                            </p>
                            <div className="dashboard__card-actions">
                                <button
                                    className="dashboard__card-btn"
                                    onClick={() => handleNavigation('/configuracion')}
                                >
                                    Preferencias
                                </button>
                                <button
                                    className="dashboard__card-btn"
                                    onClick={() => {/* Lógica para cambiar tema */ }}
                                >
                                    Modo Oscuro
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};