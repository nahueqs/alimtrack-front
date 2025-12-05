import React from 'react';
import {FloatButton, Tooltip} from 'antd';
import {ArrowUpOutlined} from '@ant-design/icons';

// El componente ya no necesita props
export const FloatingActionButtons: React.FC = () => {
    return (
        <Tooltip title="Volver Arriba" placement="left">
            <FloatButton
                onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                icon={<ArrowUpOutlined/>}
            />
        </Tooltip>
    );
};
