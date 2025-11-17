import { Navigate, type RouteObject } from 'react-router-dom';
import { ProtectedRoute } from './pages/Login/auth/ProtectedRoute.tsx';
import { PublicRoute } from './pages/Login/auth/PublicRoute.tsx';
import { DashboardPage } from './pages/Dashboard/DashboardPage.tsx';
import LoginPage from './pages/Login/LoginPage.tsx';
import { NewProductionPage } from './pages/Productions/CreationPage/NewProductionPage.tsx';
import { ProductionsPage } from './pages/Productions/ProductionsPage.tsx';
import { RecipeVersionsPage } from './pages/RecipeVersions/RecipeVersionsPage.tsx';

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/producciones/nueva',
    element: (
      <ProtectedRoute>
        <NewProductionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/producciones',
    element: (
      <ProtectedRoute>
        <ProductionsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/producciones/activas',
    element: (
      <ProtectedRoute>
        <ProductionsPage
          showHeader={true}
          hideSearch={false}
          initialFilters={{ estado: 'EN_PROCESO' }}
        />
      </ProtectedRoute>
    ),
  },
  {
    path: '/producciones/finalizadas',
    element: (
      <ProtectedRoute>
        <ProductionsPage
          showHeader={true}
          hideSearch={false}
          initialFilters={{ estado: 'FINALIZADA' }}
        />
      </ProtectedRoute>
    ),
  },
  {
    path: '/recetas/versiones',
    element: (
      <ProtectedRoute>
        <RecipeVersionsPage showHeader={true} hideSearch={false} />
      </ProtectedRoute>
    ),
  },
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
];

// Exportar rutas como predeterminado
export default routes;
