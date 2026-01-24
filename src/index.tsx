import { Navigate, type RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@/services/auth/authProvider/ProtectedRoute.tsx';
import { PublicRoute } from '@/services/auth/authProvider/PublicRoute.tsx';
import { DashboardPage } from '@/pages/Protected/DashboardProtected/DashboardPage.tsx';
import LoginPage from '@/pages/Public/IniciarSesionPage/LoginPage.tsx';
import { NuevaProduccionPage } from '@/pages/Protected/NuevaProduccionPage/NuevaProduccionPage.tsx';
import ProductionsResultPage from '@/pages/Protected/ListadoProduccionesProtected/ProduccionesPage.tsx';
import DetalleProduccionPublicPage from '@/pages/Public/DetalleProduccionPublicPage/DetalleProduccionPublicPage.tsx';
import DetalleProduccionProtectedPage from '@/pages/Protected/DetalleProduccionProtected/DetalleProduccionProtectedPage.tsx';
import { ListadoProducciones } from '@/pages/Public/ListadoProduccionesPublic/ListadoProducciones.tsx';
import { VersionRecetasPage } from '@/pages/Protected/VersionRecetas/listado/VersionRecetasPage.tsx';
import type { ProduccionFilterRequestDTO } from '@/pages/common/DetalleProduccion/types/Productions.ts';

const produccionesActivasFilters: ProduccionFilterRequestDTO = { estado: 'EN_PROCESO' };
const produccionesFinalizadasFilters: ProduccionFilterRequestDTO = { estado: 'FINALIZADA' };

export const routes: RouteObject[] = [
  // --- Rutas Públicas ---
  {
    path: '/login',
    element: (
      <PublicRoute>
        {' '}
        {/* This PublicRoute is correct for login, redirects if authenticated */}
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/public/producciones',
    element: (
      // Removed PublicRoute wrapper to allow authenticated users to view this page
      <ListadoProducciones />
    ),
  },
  {
    path: '/public/producciones/ver/:codigoProduccion',
    element: (
      // Removed PublicRoute wrapper to allow authenticated users to view this page
      <DetalleProduccionPublicPage />
    ),
  },

  // --- Rutas Protegidas ---
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
        <NuevaProduccionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/producciones/ver/:codigoProduccion', // Nueva ruta protegida
    element: (
      <ProtectedRoute>
        <DetalleProduccionProtectedPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/producciones',
    element: (
      <ProtectedRoute>
        <ProductionsResultPage key="producciones-all" />
      </ProtectedRoute>
    ),
  },
  {
    path: '/producciones/activas',
    element: (
      <ProtectedRoute>
        <ProductionsResultPage
          key="producciones-activas"
          initialFilters={produccionesActivasFilters}
        />
      </ProtectedRoute>
    ),
  },
  {
    path: '/producciones/finalizadas',
    element: (
      <ProtectedRoute>
        <ProductionsResultPage
          key="producciones-finalizadas"
          initialFilters={produccionesFinalizadasFilters}
        />
      </ProtectedRoute>
    ),
  },
  {
    path: '/recetas/versiones',
    element: (
      <ProtectedRoute>
        <VersionRecetasPage />
      </ProtectedRoute>
    ),
  },

  // --- Redirecciones ---
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
];

export default routes;
