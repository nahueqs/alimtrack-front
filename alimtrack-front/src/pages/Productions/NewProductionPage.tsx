// pages/NewProductionPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/authProvider.tsx';
import { ThemeToggle } from '../../components/shared/ThemeToggle.tsx';
import logoCideta from '../../assets/logoCideta.png';

// Reutilizamos los mismos iconos
const MenuIcon = () => (
  <svg className="dashboard__menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const UserIcon = () => (
  <svg className="dashboard__menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg className="dashboard__menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);

export interface ProductionFormData {
  nombre: string;
  descripcion: string;
  recetaId: string;
  cantidad: number;
  fechaInicio: string;
  prioridad: 'alta' | 'media' | 'baja';
}

export const NewProductionPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [formData, setFormData] = useState<ProductionFormData>({
    nombre: '',
    descripcion: '',
    recetaId: '',
    cantidad: 0,
    fechaInicio: new Date().toISOString().split('T')[0],
    prioridad: 'media',
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí va la lógica para guardar la producción
    console.log('Datos de producción:', formData);

    // Simulamos el envío exitoso
    alert('Producción iniciada exitosamente');
    navigate('/dashboard'); // Volvemos al dashboard
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cantidad' ? Number(value) : value,
    }));
  };

  const handleBack = () => {
    navigate('/dashboard');
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
      {/* Header - Mismo que en DashboardPage */}
      <header className="dashboard__header">
        <nav className="dashboard__nav container">
          <div className="dashboard__brand">
            <img src={logoCideta} alt="logoCideta" className="dashboard_nav__image" />
            <span className="dashboard__app-name">AlimTrack</span>
            <span className="dashboard__badge">Nueva Producción</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ThemeToggle />

            <button className="dashboard__menu-toggle" onClick={toggleMenu} aria-label="Abrir menú">
              <MenuIcon />
            </button>

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

                <div
                  className={`dashboard__dropdown-menu ${isUserMenuOpen ? 'dashboard__dropdown-menu--open' : ''}`}
                >
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
                  <button className="dashboard__dropdown-item" onClick={handleLogout}>
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
        <div className="dashboard__new-production">
          {/* Header con botón de volver */}
          <div className="dashboard__new-production-header">
            <button
              onClick={handleBack}
              className="btn btn--secondary btn--icon"
              style={{ marginBottom: '1rem' }}
            >
              <ArrowLeftIcon />
              Volver al Dashboard
            </button>

            <h1 className="dashboard__welcome-title">Iniciar Nueva Producción</h1>
            <p className="dashboard__welcome-subtitle">
              Completa los datos para iniciar una nueva producción
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="dashboard__production-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="nombre" className="form-label">
                  Nombre de la Producción *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="form-input"
                  required
                  placeholder="Ej: Producción de Pan Integral - Lote 001"
                />
              </div>

              <div className="form-group">
                <label htmlFor="recetaId" className="form-label">
                  Receta *
                </label>
                <select
                  id="recetaId"
                  name="recetaId"
                  value={formData.recetaId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Seleccionar receta...</option>
                  <option value="1">Pan Blanco Tradicional</option>
                  <option value="2">Pan Integral</option>
                  <option value="3">Facturas</option>
                  <option value="4">Pizza Precocida</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="cantidad" className="form-label">
                  Cantidad a Producir *
                </label>
                <input
                  type="number"
                  id="cantidad"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleChange}
                  className="form-input"
                  required
                  min="1"
                  placeholder="Ej: 100"
                />
              </div>

              <div className="form-group">
                <label htmlFor="fechaInicio" className="form-label">
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  id="fechaInicio"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="prioridad" className="form-label">
                  Prioridad
                </label>
                <select
                  id="prioridad"
                  name="prioridad"
                  value={formData.prioridad}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label htmlFor="descripcion" className="form-label">
                  Descripción
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  className="form-textarea"
                  rows={3}
                  placeholder="Descripción opcional de la producción..."
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={handleBack} className="btn btn--secondary">
                Cancelar
              </button>
              <button type="submit" className="btn btn--primary">
                Iniciar Producción
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
