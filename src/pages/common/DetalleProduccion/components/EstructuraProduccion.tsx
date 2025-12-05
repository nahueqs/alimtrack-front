import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, Form, Typography, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { debounce } from 'lodash';
import { useRespuestas } from '../context/RespuestasContext';
import { DebouncedInput } from './form/DebouncedInput';
import type {
    SeccionResponseDTO,
    GrupoCamposResponseDTO,
    TablaResponseDTO,
} from '../types/Productions';
import { useIsMobile } from '@/hooks/useIsMobile';
import '../DetalleProduccionPage.css';

const { Title } = Typography;

// =====================================================================================
// 1. COMPONENTES ESTRUCTURALES (USAN DEBOUNCEDINPUT Y CONSUMEN CONTEXTO)
// =====================================================================================

const GrupoDeCampos: React.FC<{ grupo: GrupoCamposResponseDTO; isEditable: boolean; }> = React.memo(({ grupo, isEditable }) => {
    // Este componente ahora consume el contexto directamente.
    const { respuestasCampos, onCampoChange } = useRespuestas();
    return (
        <div className="group-card">
            <Title level={5} className="group-title">{grupo.subtitulo}</Title>
            {grupo.campos.map(campo => (
                <Form.Item key={campo.id} label={campo.nombre}>
                    <DebouncedInput
                        value={respuestasCampos[campo.id] || ''}
                        onChange={(valor) => onCampoChange(campo.id, valor)}
                        placeholder={`Ingrese ${campo.nombre.toLowerCase()}`}
                        disabled={!isEditable}
                    />
                </Form.Item>
            ))}
        </div>
    );
});

type DataType = { key: number; idFila: number; nombreFila: string; };

const TablaProduccion: React.FC<{ tabla: TablaResponseDTO; isEditable: boolean; }> = React.memo(({ tabla, isEditable }) => {
    const isMobile = useIsMobile();
    const { respuestasTablas, onTablaChange } = useRespuestas();
    const dataSource: DataType[] = tabla.filas?.map(fila => ({ key: fila.id, idFila: fila.id, nombreFila: fila.nombre })) || [];

    const columns: ColumnsType<DataType> = [
        { title: 'Concepto', dataIndex: 'nombreFila', key: 'nombreFila', render: (text: string) => <strong>{text}</strong>, fixed: !isMobile ? 'left' : false, width: 150 },
        ...(tabla.columnas?.map(col => ({
            title: col.nombre,
            dataIndex: col.id.toString(),
            key: col.id,
            render: (_: any, record: DataType) => {
                const valor = respuestasTablas.find(c => c.idFila === record.idFila && c.idColumna === col.id)?.valor || '';
                return (
                    <DebouncedInput
                        value={valor}
                        onChange={(nuevoValor) => onTablaChange(tabla.id, record.idFila, col.id, nuevoValor)}
                        placeholder={col.nombre}
                        disabled={!isEditable}
                    />
                );
            },
        })) || []),
    ];

    return (
        <div className="production-table-container">
            <h5 className="production-table-title">{tabla.nombre}</h5>
            {tabla.descripcion && <p className="production-table-description">{tabla.descripcion}</p>}
            <Table columns={columns} dataSource={dataSource} pagination={false} bordered size="small" scroll={{ x: 'max-content' }} />
        </div>
    );
});

// =====================================================================================
// 2. COMPONENTE DE SECCIÓN (SIMPLIFICADO)
// =====================================================================================

interface SeccionProduccionProps {
    seccion: SeccionResponseDTO;
    numeroSeccion: number;
    isEditable: boolean;
}

const SeccionProduccion: React.FC<SeccionProduccionProps> = React.memo(({ seccion, numeroSeccion, isEditable }) => {
    const { respuestasCampos, respuestasTablas, onCampoChange } = useRespuestas();
    const [progreso, setProgreso] = useState({ respondidos: 0, total: 0 });

    const recalcularProgresoSeccion = useCallback(() => {
        const camposSimplesTotal = seccion.camposSimples.length;
        const camposSimplesRespondidos = seccion.camposSimples.filter(c => respuestasCampos[c.id]?.trim()).length;

        const camposEnGruposTotal = seccion.gruposCampos.reduce((sum, g) => sum + g.campos.length, 0);
        const camposEnGruposRespondidos = seccion.gruposCampos.reduce((sum, g) => sum + g.campos.filter(c => respuestasCampos[c.id]?.trim()).length, 0);

        const celdasTotal = seccion.tablas.reduce((sum, t) => sum + (t.filas?.length || 0) * (t.columnas?.length || 0), 0);
        const celdasRespondidas = seccion.tablas.reduce((sum, t) => sum + respuestasTablas.filter(rt => rt.idTabla === t.id && rt.valor?.trim()).length, 0);

        setProgreso({
            total: camposSimplesTotal + camposEnGruposTotal + celdasTotal,
            respondidos: camposSimplesRespondidos + camposEnGruposRespondidos + celdasRespondidas,
        });
    }, [seccion, respuestasCampos, respuestasTablas]);

    const debouncedRecalcular = useMemo(() => debounce(recalcularProgresoSeccion, 500), [recalcularProgresoSeccion]);

    useEffect(() => {
        debouncedRecalcular();
        return () => debouncedRecalcular.cancel();
    }, [respuestasCampos, respuestasTablas, debouncedRecalcular]);

    return (
        <Card className="section-card">
            <Title level={4} className="section-title">
                <span className="section-number">{numeroSeccion}</span>
                {seccion.titulo}
                {progreso.total > 0 && <span className="section-progress-text">({progreso.respondidos} / {progreso.total})</span>}
            </Title>
            <Form layout="vertical">
                {seccion.camposSimples.map(campo => (
                    <Form.Item key={campo.id} label={campo.nombre}>
                        <DebouncedInput
                            value={respuestasCampos[campo.id] || ''}
                            onChange={(valor) => onCampoChange(campo.id, valor)}
                            placeholder={`Ingrese ${campo.nombre.toLowerCase()}`}
                            disabled={!isEditable}
                        />
                    </Form.Item>
                ))}
                {seccion.gruposCampos.map(grupo => <GrupoDeCampos key={grupo.id} grupo={grupo} isEditable={isEditable} />)}
                {seccion.tablas.map(tabla => <TablaProduccion key={tabla.id} tabla={tabla} isEditable={isEditable} />)}
            </Form>
        </Card>
    );
});

// =====================================================================================
// 3. COMPONENTE PRINCIPAL
// =====================================================================================

interface EstructuraProduccionProps {
    estructura: SeccionResponseDTO[];
    isEditable?: boolean;
}

export const EstructuraProduccion: React.FC<EstructuraProduccionProps> = ({ estructura, isEditable = false }) => (
    <div className="production-structure">
        {estructura.map((seccion, index) => (
            <SeccionProduccion key={seccion.id} seccion={seccion} numeroSeccion={index + 1} isEditable={isEditable} />
        ))}
    </div>
);
