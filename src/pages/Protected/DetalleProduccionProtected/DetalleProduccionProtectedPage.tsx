import React from 'react';
import {useParams} from 'react-router-dom';
import {DetalleProduccionPage} from '@/pages/common/DetalleProduccion/DetalleProduccionPage';
import { AppHeader } from "@/components/AppHeader/AppHeader.tsx";
import { useProductionData } from '@/hooks/useProductionData';
import { useProductionWebSocket } from '@/hooks/useProductionWebSocket';
import { useProductionActions } from '@/hooks/useProductionActions';
import { ProductionStatusDisplay } from '@/components/ProductionStatusDisplay';
import { SavingIndicator } from '@/components/SavingIndicator';

const DetalleProduccionProtectedPage: React.FC = () => {
    const {codigoProduccion} = useParams<{ codigoProduccion: string }>();

    // Use the custom hook for data fetching and state management
    const {
        loading: loadingData,
        error: errorData,
        estadoActual,
        estructura,
        getUltimasRespuestas,
        isSaving,
        guardarRespuestaCampo,
        guardarRespuestaCeldaTabla,
        cambiarEstadoProduccion,
        updateFieldResponse,
        updateTableCellResponse,
        updateProductionState,
        updateProductionMetadata,
    } = useProductionData(codigoProduccion);

    // Use the custom hook for WebSocket management
    useProductionWebSocket({
        codigoProduccion,
        estadoActual,
        getUltimasRespuestas,
        updateFieldResponse,
        updateTableCellResponse,
        updateProductionState,
        updateProductionMetadata,
    });

    // Use the custom hook for production actions
    const {
        debouncedCampoChange,
        debouncedTablaChange,
        handleCambioEstado,
    } = useProductionActions({
        isSaving,
        guardarRespuestaCampo,
        guardarRespuestaCeldaTabla,
        cambiarEstadoProduccion,
        estadoActual,
        estructura,
    });

    // Removed: console.log("[DetalleProduccionProtectedPage] Component rendered.");

    // Determine if the production is editable based on its status
    const isProductionEditable = estadoActual?.produccion.estado === 'EN_PROCESO';

    return (
        <ProductionStatusDisplay
            loading={loadingData}
            error={errorData}
            estructura={estructura}
            estadoActual={estadoActual}
        >
            <SavingIndicator isSaving={isSaving} />
            <DetalleProduccionPage
                estructura={estructura!}
                respuestas={estadoActual!}
                isEditable={isProductionEditable}
                onCampoChange={debouncedCampoChange}
                onTablaChange={debouncedTablaChange}
                onCambioEstado={handleCambioEstado}
                HeaderComponent={AppHeader}
            />
        </ProductionStatusDisplay>
    );
};

export default DetalleProduccionProtectedPage;
