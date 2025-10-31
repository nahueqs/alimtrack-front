// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/authProvider';
import { ThemeProvider } from './contexts/ThemeContexts';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { NewProductionPage } from './pages/NewProductionPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ProductionsListPage } from './pages/ProductionsListPage';
import { PublicRoute } from './components/auth/PublicRoute';
import './components/shared/Button.css'
import './components/shared/InputBasic.css'
import './components/shared/ThemeToggle.css'
import './App.css';



export const App: React.FC = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <div className="app">
                        <Routes>
                            <Route
                                path="/login"
                                element={
                                    <PublicRoute>
                                        <LoginPage />
                                    </PublicRoute>
                                }
                            />

                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <DashboardPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/producciones/nueva"
                                element={
                                    <ProtectedRoute>
                                        <NewProductionPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/producciones/"
                                element={
                                    <ProtectedRoute>
                                        <ProductionsListPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/producciones/finalizadas"
                                element={
                                    <ProtectedRoute>
                                        <div>Lista de Producciones finalizadas</div>
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/recetas"
                                element={
                                    <ProtectedRoute>
                                        <div>Lista de Recetas</div>
                                    </ProtectedRoute>
                                }
                            />

       

                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </div>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
};

