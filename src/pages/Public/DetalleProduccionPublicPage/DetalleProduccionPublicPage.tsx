import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {Alert, Spin} from 'antd';
import {DetalleProduccionPage} from '@/pages/common/DetalleProduccion/DetalleProduccionPage';
import {usePublicService} from '@/services/public/usePublicService';
import {PublicHeader} from "@/components/layout/PublicHeader/PublicHeader.tsx";
import {useProductionWebSocket} from '@/hooks/useProductionWebSocket';

const DetalleProduccionPublicPage: React.FC = () => {
    const {codigoProduccion} = useParams<{ codigoProduccion: string }>();
    const {
        loading,
        error,
        estructura,
        respuestas,
        getEstructuraProduccion,
        getUltimasRespuestasProduccion,
        updateFieldResponse,
        updateTableCellResponse,
        updateProductionState,
        updateProductionMetadata,
    } = usePublicService();

    useProductionWebSocket({
        codigoProduccion,
        estadoActual: respuestas,
        estructura,
        getUltimasRespuestas: getUltimasRespuestasProduccion,
        updateFieldResponse,
        updateTableCellResponse,
        updateProductionState,
        updateProductionMetadata,
    });

    useEffect(() => {
        if (codigoProduccion) {
            Promise.all([
                getEstructuraProduccion(codigoProduccion),
                getUltimasRespuestasProduccion(codigoProduccion),
            ]);
        }
    }, [codigoProduccion, getEstructuraProduccion, getUltimasRespuestasProduccion]);

    if (loading && !respuestas) {
        return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}><Spin
            size="large"/></div>;
    }

    if (error) {
        return <Alert message="Error" description={error} type="error" showIcon/>;
    }

    if (!estructura || !respuestas) {
        return <Alert message="No se encontraron datos para esta producción." type="warning" showIcon/>;
    }

    return (
        <DetalleProduccionPage
            estructura={estructura}
            respuestas={respuestas}
            isEditable={false}
            HeaderComponent={PublicHeader}
        />
    );
};

export default DetalleProduccionPublicPage;
