import React from 'react';
import {InfoCircleOutlined} from '@ant-design/icons';
import type {VersionRecetaResponseDTO} from '@/pages/Protected/VersionRecetas/types/RecipeVersions.ts';
import './NuevaProduccionForm.css'; // Asumiendo que los estilos están aquí

interface VersionDetailsProps {
    version: VersionRecetaResponseDTO;
}

export const VersionDetails: React.FC<VersionDetailsProps> = ({version}) => (
    <div className="nueva-produccion-form__version-details">
        <div className="nueva-produccion-form__version-details-header">
            <InfoCircleOutlined style={{color: '#1890ff', marginRight: '8px'}}/>
            <strong>Detalles de la Versión Seleccionada:</strong>
        </div>

        <div className="nueva-produccion-form__version-details-content">
            <div className="nueva-produccion-form__version-detail-row">
                <span className="nueva-produccion-form__version-detail-label">Código:</span>
                <span className="nueva-produccion-form__version-detail-value">
          {version.codigoVersionReceta}
        </span>
            </div>

            <div className="nueva-produccion-form__version-detail-row">
                <span className="nueva-produccion-form__version-detail-label">Nombre:</span>
                <span className="nueva-produccion-form__version-detail-value">
          {version.nombre}
        </span>
            </div>

            {version.descripcion && (
                <div className="nueva-produccion-form__version-detail-row">
                    <span className="nueva-produccion-form__version-detail-label">Descripción:</span>
                    <span className="nueva-produccion-form__version-detail-value">{version.descripcion}</span>
                </div>
            )}

            {version.codigoRecetaPadre && (
                <div className="nueva-produccion-form__version-detail-row">
                    <span className="nueva-produccion-form__version-detail-label">Receta Padre:</span>
                    <span className="nueva-produccion-form__version-detail-value">
            {version.codigoRecetaPadre}
          </span>
                </div>
            )}
        </div>
    </div>
);
