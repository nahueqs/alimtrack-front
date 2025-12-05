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
        guardarMetadata,
        updateFieldResponse,
        updateTableCellResponse,
        updateProductionState,
        updateProductionMetadata,
    } = useProductionData(codigoProduccion);

    useProductionWebSocket({
        codigoProduccion,
        estadoActual,
        estructura,
        getUltimasRespuestas,
        updateFieldResponse,
        updateTableCellResponse,
        updateProductionState,
        updateProductionMetadata,
    });

    const {
        debouncedCampoChange,
        debouncedTablaChange,
        debouncedMetadataChange,
        handleCambioEstado,
    } = useProductionActions({
        isSaving,
        guardarRespuestaCampo,
        guardarRespuestaCeldaTabla,
        cambiarEstadoProduccion,
        guardarMetadata,
        estadoActual,
        estructura,
    });

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
                onMetadataChange={debouncedMetadataChange}
                onCambioEstado={handleCambioEstado}
                HeaderComponent={AppHeader}
            />
        </ProductionStatusDisplay>
    );
};

export default DetalleProduccionProtectedPage;
