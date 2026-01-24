import React from 'react';
import {Spin} from 'antd';

interface SavingIndicatorProps {
    isSaving: boolean;
}

export const SavingIndicator: React.FC<SavingIndicatorProps> = ({isSaving}) => {
    if (!isSaving) {
        return null;
    }

    return (
        <Spin style={{position: 'fixed', top: 20, right: 20, zIndex: 1000}}/>
    );
};
