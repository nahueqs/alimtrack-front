import React from 'react';
import {Card, Col, Progress, Row, Statistic} from 'antd';
import type {ProgresoProduccionResponseDTO} from '../types/Productions';
import {CheckCircleOutlined} from '@ant-design/icons';

interface ProgresoProduccionCardProps {
    progreso: ProgresoProduccionResponseDTO;
}

export const ProgresoProduccionCard: React.FC<ProgresoProduccionCardProps> = ({progreso}) => {
    // console.log("[ProgresoProduccionCard] Received progreso prop:", progreso); // Removed debug log

    return (
        <Card title="Progreso de la Producción" className="progress-info-card">
            <Row gutter={[16, 24]} align="middle">
                <Col xs={24} sm={12} style={{textAlign: 'center'}}>
                    <Progress
                        type="dashboard"
                        percent={Math.round(progreso.porcentajeCompletado)}
                        format={(percent) => `${percent}%`}
                    />
                </Col>
                <Col xs={24} sm={12}>
                    <Statistic
                        title="Campos Respondidos"
                        value={progreso.elementosRespondidos}
                        formatter={() => (
                            <span>
                                {progreso.elementosRespondidos} / {progreso.totalElementos}
                                <span className="statistic-percentage">
                                    ({Math.round(progreso.porcentajeCompletado)}%)
                                </span>
                            </span>
                        )}
                        prefix={<CheckCircleOutlined/>}
                    />
                </Col>
            </Row>
        </Card>
    );
};
