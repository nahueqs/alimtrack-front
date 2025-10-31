/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/dashboard/DashboardHeader';
import { ArrowLeftIcon, EyeIcon } from '../utils/Icons';
import { useProductions } from '../hooks/useProductions';
import { getEstadoBadgeClass, getEstadoDisplayText } from '../utils/productionUtils';
import { formatDate, formatTime } from '../utils/dateUtils';
import './ProductionsListPage.css';

export const ProductionsListPage: React.FC = () => {
    const navigate = useNavigate();
    const [paginaActual, setPaginaActual] = useState(1);

    const {
        productions,
        loading,
        error,
        totalPaginas,
        totalRegistros,
        refreshProductions
    } = useProductions({
        page: paginaActual,
        size: 10
    });

    const handleVerDetalle = (codigoProduccion: string) => {
        navigate(`/produccion/${codigoProduccion}`);
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    const handlePaginaAnterior = () => {
        if (paginaActual > 1) {
            setPaginaActual(paginaActual - 1);
        }
    };

    const handlePaginaSiguiente = () => {
        if (paginaActual < totalPaginas) {
            setPaginaActual(paginaActual + 1);
        }
    };

    // Efecto para recargar cuando cambia la página
    React.useEffect(() => {
        refreshProductions({ page: paginaActual, size: 10 });
    }, [paginaActual]);

    return (
        <div className="dashboard">
            <Header
                title="AlimTrack"
                badge="Lista de Producciones"
            />

            <main className="dashboard__main container">
                <div className="productions-list">
                    {/* Header con botón de volver */}
                    <div className="productions-list__header">
                        <div className="productions-list__nav">
                            <button
                                onClick={handleBackToDashboard}
                                className="btn btn--secondary btn--icon"
                            >
                                <ArrowLeftIcon />
                                Volver al Dashboard
                            </button>
                            <button
                                onClick={() => refreshProductions({ page: paginaActual, size: 10 })}
                                className="btn btn--outline"
                                disabled={loading}
                            >
                                {loading ? 'Actualizando...' : 'Actualizar'}
                            </button>
                        </div>

                        <h1 className="productions-list__title">
                            Lista de Producciones
                        </h1>
                        <p className="productions-list__subtitle">
                            {totalRegistros} producciones encontradas
                        </p>
                    </div>

                    {/* Lista de producciones */}
                    <div className="productions-list__content">
                        {error ? (
                            <div className="error-state">
                                <p>{error}</p>
                                <button
                                    onClick={() => refreshProductions({ page: paginaActual, size: 10 })}
                                    className="btn btn--primary"
                                >
                                    Reintentar
                                </button>
                            </div>
                        ) : loading ? (
                            <div className="loading-container">
                                <div className="loading-spinner"></div>
                                <p>Cargando producciones...</p>
                            </div>
                        ) : productions.length === 0 ? (
                            <div className="empty-state">
                                <p>No hay producciones registradas</p>
                                <button
                                    onClick={() => refreshProductions({ page: 1, size: 10 })}
                                    className="btn btn--primary"
                                >
                                    Actualizar
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="productions-table">
                                    {/* Header de la tabla */}
                                    <div className="productions-table__header">
                                        <div className="table-cell">Código</div>
                                        <div className="table-cell">Versión</div>
                                        <div className="table-cell">Encargado</div>
                                        <div className="table-cell">Lote</div>
                                        <div className="table-cell">Estado</div>
                                        <div className="table-cell">Fecha Inicio</div>
                                        <div className="table-cell">Fecha Fin</div>
                                        <div className="table-cell table-cell--actions">Acciones</div>
                                    </div>

                                    {/* Filas de datos */}
                                    <div className="productions-table__body">
                                        {productions.map((production, index) => (
                                            <div key={production.codigoProduccion}
                                                className={`production-row ${index % 2 === 0 ? 'production-row--even' : 'production-row--odd'}`}>
                                                <div className="table-cell" title={production.codigoProduccion}>
                                                    {production.codigoProduccion}
                                                </div>
                                                <div className="table-cell" title={production.codigoVersion}>
                                                    {production.codigoVersion}
                                                </div>
                                                <div className="table-cell" title={production.encargado}>
                                                    {production.encargado}
                                                </div>
                                                <div className="table-cell" title={production.lote}>
                                                    {production.lote}
                                                </div>
                                                <div className="table-cell">
                                                    <span className={`production-badge ${getEstadoBadgeClass(production.estado)}`}>
                                                        {getEstadoDisplayText(production.estado)}
                                                    </span>
                                                </div>
                                                <div className="table-cell">
                                                    <div className="fecha-hora">
                                                        <div className="fecha">{formatDate(production.fechaInicio)}</div>
                                                        <div className="hora">{formatTime(production.fechaInicio)}</div>
                                                    </div>
                                                </div>
                                                <div className="table-cell">
                                                    <div className="fecha-hora">
                                                        <div className="fecha">{formatDate(production.fechaFin || '')}</div>
                                                        <div className="hora">{formatTime(production.fechaFin || '')}</div>
                                                    </div>
                                                </div>
                                                <div className="table-cell table-cell--actions">
                                                    <button
                                                        onClick={() => handleVerDetalle(production.codigoProduccion)}
                                                        className="btn btn--primary btn--icon btn--sm"
                                                        title="Ver detalles"
                                                    >
                                                        <EyeIcon />
                                                        <span className="action-text">Ver</span>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Paginación */}
                                {totalPaginas > 1 && (
                                    <div className="pagination">
                                        <button
                                            onClick={handlePaginaAnterior}
                                            disabled={paginaActual === 1 || loading}
                                            className="pagination__btn pagination__btn--prev"
                                        >
                                            Anterior
                                        </button>

                                        <div className="pagination__info">
                                            Página {paginaActual} de {totalPaginas}
                                            <span className="pagination__total">({totalRegistros} registros)</span>
                                        </div>

                                        <button
                                            onClick={handlePaginaSiguiente}
                                            disabled={paginaActual === totalPaginas || loading}
                                            className="pagination__btn pagination__btn--next"
                                        >
                                            Siguiente
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};