import {Button, Tag} from 'antd';
import {EyeOutlined} from '@ant-design/icons';
import type {ColumnsType} from 'antd/es/table';
import type {ProduccionPublicMetadataDTO} from '@/pages/common/DetalleProduccion/types/Productions.ts'; // Changed import

interface GetColumnsProps {
    onView: (record: ProduccionPublicMetadataDTO) => void; // Changed type
}

const getStatusTag = (estado: string) => {
    switch (estado) {
        case 'EN_PROCESO':
            return <Tag color="blue">En Proceso</Tag>;
        case 'FINALIZADA':
            return <Tag color="green">Finalizada</Tag>;
        case 'CANCELADA':
            return <Tag color="red">Cancelada</Tag>;
        default:
            return <Tag>{estado}</Tag>;
    }
};

export const getColumns = ({onView}: GetColumnsProps): ColumnsType<ProduccionPublicMetadataDTO> => [ // Changed type
    {
        title: 'Código Producción',
        dataIndex: 'codigoProduccion',
        key: 'codigoProduccion',
        sorter: (a, b) => a.codigoProduccion.localeCompare(b.codigoProduccion),
    },
    {
        title: 'Lote',
        dataIndex: 'lote',
        key: 'lote',
        render: (text) => text || 'N/A',
    },
    {
        title: 'Fecha inicio',
        dataIndex: 'fechaInicio',
        key: 'fechaInicio',
        render: (text) => text || 'N/A',
        sorter: (a, b) => a.fechaInicio.localeCompare(b.fechaInicio),

    },
    {
        title: 'Fecha Fin',
        dataIndex: 'fechaFin',
        key: 'fechaFin',
        render: (text) => text || 'N/A',
        sorter: (a, b) => {
            if (!a.fechaFin && !b.fechaFin) return 0;
            if (!a.fechaFin) return 1;
            if (!b.fechaFin) return -1;
            return a.fechaFin.localeCompare(b.fechaFin);
        },
        defaultSortOrder: 'descend', // Added default sort order
    },
    {
        title: 'Estado',
        dataIndex: 'estado',
        key: 'estado',
        render: getStatusTag,
        filters: [
            {text: 'En Proceso', value: 'EN_PROCESO'},
            {text: 'Finalizada', value: 'FINALIZADA'},
            {text: 'Cancelada', value: 'CANCELADA'},
        ],
        onFilter: (value, record) => record.estado.indexOf(value as string) === 0,
    },
    {
        title: 'Acciones',
        key: 'actions',
        align: 'center',
        render: (_, record) => (
            <Button
                icon={<EyeOutlined/>}
                onClick={() => onView(record)}
            >
                Ver
            </Button>
        ),
    },
];
