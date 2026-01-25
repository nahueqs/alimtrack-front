import React, { useMemo } from 'react';
import { Col, Row } from 'antd';
import { InfoProduccionCard } from './components/InfoProduccionCard';
import { EstructuraProduccion } from './components/EstructuraProduccion';
import { FloatingActionButtons } from './components/FloatingActionButtons';
import { ProgresoProduccionCard } from './components/ProgresoProduccionCard';
import { RespuestasContext } from './context/RespuestasContext';
import type {
  EstructuraProduccionDTO,
  ProduccionMetadataModifyRequestDTO,
  RespuestasProduccionProtectedDTO,
  RespuestasProduccionPublicDTO,
} from '@/types/production';
import { TipoDatoCampo } from '@/pages/Recetas/types/TipoDatoCampo';
import { ProductionState } from '@/constants/ProductionStates';
// import { PublicHeader } from "@/components/layout/PublicHeader/PublicHeader.tsx"; // Removed direct import

type RespuestasProduccion = RespuestasProduccionPublicDTO | RespuestasProduccionProtectedDTO;

interface ProductionDisplayProps {
  estructura: EstructuraProduccionDTO;
  respuestas: RespuestasProduccion;
  isEditable?: boolean;
  // Actualizamos las firmas para devolver Promise<void>
  onCampoChange?: (idCampo: number, valor: string, tipoDato: TipoDatoCampo) => Promise<void>;
  onTablaChange?: (
    idTabla: number,
    idFila: number,
    idColumna: number,
    valor: string,
    tipoDato: TipoDatoCampo
  ) => Promise<void>;
  onMetadataChange?: (data: ProduccionMetadataModifyRequestDTO) => void;
  onCambioEstado?: (nuevoEstado: ProductionState) => void;
  HeaderComponent: React.ElementType; // New prop for the header component
}

const noOp = async () => {};

export const DetalleProduccionPage: React.FC<ProductionDisplayProps> = ({
  estructura,
  respuestas,
  isEditable = false,
  onCampoChange = noOp,
  onTablaChange = noOp,
  onMetadataChange = noOp,
  onCambioEstado,
  HeaderComponent, // Destructure the new prop
}) => {
  const respuestasCamposMap = useMemo(() => {
    return respuestas.respuestasCampos.reduce(
      (acc, resp) => {
        acc[resp.idCampo] = resp.valor;
        return acc;
      },
      {} as Record<number, string>
    );
  }, [respuestas.respuestasCampos]);

  const contextValue = useMemo(
    () => ({
      respuestasCampos: respuestasCamposMap,
      respuestasTablas: respuestas.respuestasTablas,
      onCampoChange,
      onTablaChange,
    }),
    [respuestasCamposMap, respuestas.respuestasTablas, onCampoChange, onTablaChange]
  );

  return (
    <>
      <HeaderComponent /> {/* Render the passed HeaderComponent */}
      <div id="production-content" style={{ padding: '24px' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <InfoProduccionCard
              produccion={respuestas.produccion}
              versionReceta={estructura}
              isEditable={isEditable}
              onCambioEstado={onCambioEstado}
              onMetadataChange={onMetadataChange}
            />
          </Col>
          <Col xs={24} lg={8}>
            <ProgresoProduccionCard progreso={respuestas.progreso} />
          </Col>
        </Row>

        <RespuestasContext.Provider value={contextValue}>
          <EstructuraProduccion estructura={estructura.estructura} isEditable={isEditable} />
        </RespuestasContext.Provider>

        <FloatingActionButtons />
      </div>
    </>
  );
};
