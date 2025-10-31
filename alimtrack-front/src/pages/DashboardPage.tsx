// pages/DashboardPage.tsx
import { useAuth } from '../hooks/authProvider';
import { useNavigate } from 'react-router-dom';
import { ProduccionCard } from '../components/dashboard/ProductionsCard';
import { RecetasCard } from '../components/dashboard/RecipesCard';
import { Header } from '../components/dashboard/DashboardHeader';
import './DashboardPage.css'

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
            <Header
                title="AlimTrack"
                showImages={true}
            />

            {/* Main Content */}
            <main className="dashboard__main container">
                <div className="dashboard__welcome">
                    <h1 className="dashboard__welcome-title">
                        ¡Bienvenido, {user?.nombre}!
                    </h1>
                    <p className="dashboard__welcome-subtitle">
                        Sistema de gestión de producciones alimenticias - UNLu
                    </p>

                    <div className="dashboard__grid">
                        <ProduccionCard onNavigate={handleNavigation} />
                        <RecetasCard onNavigate={handleNavigation} />
                        {/* Agrega más cards según necesites */}
                    </div>
                </div>
            </main>
        </div>
    );
};