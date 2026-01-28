import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth/AuthProvider';
import logoCideta from '../../assets/logoCideta.png';
import './AppHeader.css';
import { MenuIcon, UserIcon } from 'lucide-react';

interface HeaderProps {
  title?: string;
}

export const AppHeader: React.FC<HeaderProps> = ({ title = 'AlimTrack' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header" ref={headerRef}>
      <nav className="header__nav">
        <div
          className="header__brand"
          onClick={() => handleNavigation('/dashboard')}
          style={{ cursor: 'pointer' }}
        >
          <img src={logoCideta} alt="Logo Cideta" className="header__brand-logo" />
          <span className="header__brand-title">{title}</span>
        </div>

        {user && (
          <div className="header__actions">
            {/* NAVEGACIÓN DE ESCRITORIO */}
            <div className="header__desktop-nav">
              <a className="header__nav-link" onClick={() => handleNavigation('/dashboard')}>
                Dashboard
              </a>
              <a className="header__nav-link" onClick={() => handleNavigation('/producciones')}>
                Producciones
              </a>
              <a className="header__nav-link" onClick={() => handleNavigation('/recetas/versiones')}>
                Recetas
              </a>

              <div className="header__user-menu">
                <div className="header__user-activator">
                  <UserIcon className="header__user-icon" />
                  <span>{user.nombre}</span>
                </div>
                <div className="header__user-dropdown">
                  <a className="header__dropdown-item" onClick={() => handleNavigation('/profile')}>
                    Mi Perfil
                  </a>
                  <hr className="header__separator" />
                  <a className="header__dropdown-item" onClick={logout}>
                    Cerrar Sesión
                  </a>
                </div>
              </div>
            </div>

            {/* NAVEGACIÓN MÓVIL */}
            <div className="header__mobile-nav">
              <button
                className="header__hamburger"
                aria-label="Abrir menú"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <MenuIcon className="header__hamburger-icon" />
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* CONTENIDO DEL MENÚ MÓVIL */}
      {user && (
        <div
          className={`header__mobile-menu-content ${isMobileMenuOpen ? 'header__mobile-menu-content--open' : ''}`}
        >
          <a className="header__dropdown-item" onClick={() => handleNavigation('/dashboard')}>
            Dashboard
          </a>
          <a className="header__dropdown-item" onClick={() => handleNavigation('/producciones')}>
            Producciones
          </a>
          <a className="header__dropdown-item" onClick={() => handleNavigation('/recetas/versiones')}>
            Recetas
          </a>
          <hr className="header__separator" />
          <div className="header__mobile-user-info">
            <p>
              <strong>{user.nombre}</strong>
            </p>
            <p className="header__mobile-user-role">{user.rol}</p>
          </div>
          <a className="header__dropdown-item" onClick={() => handleNavigation('/profile')}>
            Mi Perfil
          </a>
          <hr className="header__separator" />
          <a className="header__dropdown-item" onClick={logout}>
            Cerrar Sesión
          </a>
        </div>
      )}
    </header>
  );
};
