import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Button} from 'antd';
import {ScheduleOutlined} from '@ant-design/icons';
import './PublicHeader.css';

export const PublicHeader: React.FC = () => {
    const navigate = useNavigate();
    return (
        <header className="public-dashboard-header">
            <h1 className="public-dashboard-header__title">AlimTrack UNLu</h1>
            <Button
                type="primary"
                icon={<ScheduleOutlined/>}
                onClick={() => navigate('/public/producciones')}
            >
                Producciones
            </Button>
        </header>
    );
};
