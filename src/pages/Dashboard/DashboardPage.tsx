// pages/DashboardPage.tsx
import { useAuth } from '../Login/auth/authProvider.tsx';
import { useNavigate } from 'react-router-dom';
import { ProductionsCard } from './ProductionsCard.tsx';
import { RecetasCard } from './RecipesCard.tsx';
import { Header } from './DashboardHeader.tsx';
import './DashboardPage.css';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth(); // ProtectedRoute ya verificó el user
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Ya NO necesitas verificar !user porque ProtectedRoute se encarga
  // El componente solo se renderiza si el usuario está autenticado

  return (
    <div className="dashboard">
      {/* Header */}
      <Header title="AlimTrack" showImages={true} />

      {/* Main Content */}
      <main className="dashboard__main container">
        <div className="dashboard__welcome">
          <h1 className="dashboard__welcome-title">¡Bienvenido, {user?.nombre}!</h1>
          <p className="dashboard__welcome-subtitle">
            Sistema de gestión de producciones alimenticias - UNLu
          </p>

          <div className="dashboard__grid">
            <ProductionsCard onNavigate={handleNavigation} />
            <RecetasCard onNavigate={handleNavigation} />
          </div>
        </div>
      </main>
    </div>
  );
};
