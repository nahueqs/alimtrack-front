import React from 'react';
import { Card, Progress, Statistic, Typography } from 'antd';
import type { ProgresoProduccionResponseDTO } from '@/types/production';

const { Title } = Typography;

interface ProgresoProduccionCardProps {
  progreso: ProgresoProduccionResponseDTO;
}

export const ProgresoProduccionCard: React.FC<ProgresoProduccionCardProps> = ({ progreso }) => {
  return (
    <Card className="progress-card">
      <Title level={4} className="progress-card-title">
        Progreso
      </Title>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Progress
          type="circle"
          percent={Math.round(progreso.porcentajeCompletado)}
          format={(percent) => `${percent}%`}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Statistic
          title="Campos"
          value={progreso.camposRespondidos}
          suffix={`/ ${progreso.totalCampos}`}
        />
        <Statistic
          title="Tablas"
          value={progreso.celdasRespondidas}
          suffix={`/ ${progreso.totalCeldasTablas}`}
        />
      </div>
    </Card>
  );
};
