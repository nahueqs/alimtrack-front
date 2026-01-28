import React from 'react';
import { Modal, Button, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface SessionTimeoutModalProps {
  open: boolean;
  onExtend: () => void;
  onLogout: () => void;
}

export const SessionTimeoutModal: React.FC<SessionTimeoutModalProps> = ({
  open,
  onExtend,
  onLogout,
}) => {
  return (
    <Modal
      title={
        <span>
          <ClockCircleOutlined style={{ color: '#faad14', marginRight: 8 }} />
          Inactividad Detectada
        </span>
      }
      open={open}
      footer={null}
      closable={false}
      maskClosable={false}
      centered
      zIndex={2001} // Un poco más alto que lo normal
      width={400}
    >
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        <Text>
          Tu sesión ha expirado por seguridad. 
          <br />
          ¿Deseas extender tu sesión para continuar trabajando?
        </Text>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: '1.5rem' }}>
        <Button onClick={onLogout} danger>
          Cerrar Sesión
        </Button>
        <Button type="primary" onClick={onExtend}>
          Extender Sesión
        </Button>
      </div>
    </Modal>
  );
};
