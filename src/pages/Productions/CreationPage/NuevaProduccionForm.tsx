import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, message, Select, Space, Spin } from 'antd';
import {
  BarcodeOutlined,
  FieldNumberOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ProduccionCreateRequestDTO } from '../../../types/Productions.ts';
import { useVersionRecetaService } from '../../../services/useVersionRecetaService.ts';
import { validateLoteFormat } from '../../../utils/nuevaProduccionFormValidation.ts';
import './NuevaProduccionForm.css';

interface NuevaProduccionFormProps {
  onSubmit: (data: ProduccionCreateRequestDTO) => void;
  loading?: boolean;
  currentUser: string;
}

// Componente para el label requerido
const RequiredLabel: React.FC<{ children: string }> = ({ children }) => (
  <span className="nueva-produccion-form__required-label">
    {children}
    <span className="nueva-produccion-form__required-asterisk"> *</span>
  </span>
);

const VersionOption: React.FC<{ version: any }> = ({ version }) => (
  <div className="nueva-produccion-form__option-container">
    <div className="nueva-produccion-form__option-main">
      <strong>{version.codigoVersionReceta}</strong>
      <span className="nueva-produccion-form__option-separator"> - </span>
      <span>{version.nombreVersionReceta}</span>
    </div>
    {version.descripcion && (
      <div className="nueva-produccion-form__option-description">{version.descripcion}</div>
    )}
  </div>
);

// Componente para mostrar los detalles de la versión seleccionada
const VersionDetails: React.FC<{ version: any }> = ({ version }) => (
  <div className="nueva-produccion-form__version-details">
    <div className="nueva-produccion-form__version-details-header">
      <InfoCircleOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
      <strong>Detalles de la Versión Seleccionada:</strong>
    </div>

    <div className="nueva-produccion-form__version-details-content">
      <div className="nueva-produccion-form__version-detail-row">
        <span className="nueva-produccion-form__version-detail-label">Código:</span>
        <span className="nueva-produccion-form__version-detail-value">
          {version.codigoVersionReceta}
        </span>
      </div>

      <div className="nueva-produccion-form__version-detail-row">
        <span className="nueva-produccion-form__version-detail-label">Nombre:</span>
        <span className="nueva-produccion-form__version-detail-value">
          {version.nombre || version.nombreVersion}
        </span>
      </div>

      {version.descripcion && (
        <div className="nueva-produccion-form__version-detail-row">
          <span className="nueva-produccion-form__version-detail-label">Descripción:</span>
          <span className="nueva-produccion-form__version-detail-value">{version.descripcion}</span>
        </div>
      )}

      {version.codigoRecetaPadre && (
        <div className="nueva-produccion-form__version-detail-row">
          <span className="nueva-produccion-form__version-detail-label">Receta Padre:</span>
          <span className="nueva-produccion-form__version-detail-value">
            {version.codigoRecetaPadre} - {version.nombreRecetaPadre}
          </span>
        </div>
      )}
    </div>
  </div>
);

export const NuevaProduccionForm: React.FC<NuevaProduccionFormProps> = ({
  onSubmit,
  loading = false,
  currentUser,
}) => {
  const [form] = Form.useForm();
  const [selectedVersion, setSelectedVersion] = useState<any>(null);

  const {
    loading: loadingVersions,
    versions: recipeVersions,
    error: versionsError,
    hasError: hasVersionsError,
    isEmpty: versionsEmpty,
    refetch: refetchVersions,
  } = useVersionRecetaService({
    codigoVersionReceta: null,
    codigoReceta: null,
    nombreVersionReceta: null,
  });

  useEffect(() => {
    if (hasVersionsError && versionsError) {
      message.error(`Error al cargar versiones de recetas: ${versionsError}`);
    }
  }, [hasVersionsError, versionsError]);

  const handleVersionChange = (value: string) => {
    if (!value) {
      setSelectedVersion(null);
      return;
    }

    const version = recipeVersions.find((v: any) => v.codigoVersionReceta === value);
    setSelectedVersion(version);
  };

  const handleFinish = (values: Omit<ProduccionCreateRequestDTO, 'usernameCreador'>) => {
    const completeData: ProduccionCreateRequestDTO = {
      ...values,
      usernameCreador: currentUser,
    };
    onSubmit(completeData);
  };

  const handleFinishFailed = (errorInfo: any) => {
    console.log('Form validation failed:', errorInfo);
    message.error('Por favor, corrige los errores en el formulario');
  };

  const handleResetForm = () => {
    form.resetFields();
    setSelectedVersion(null);
    message.success('Formulario limpiado');
  };

  const handleRetryLoadVersions = () => {
    refetchVersions();
    message.info('Recargando versiones de recetas...');
  };

  // Funciones auxiliares
  const getSelectPlaceholder = () =>
    loadingVersions ? 'Cargando versiones de recetas...' : 'Selecciona una versión de receta';

  const getSuffixIcon = () => (loadingVersions ? <Spin size="small" /> : undefined);

  const filterOptions = (input: string, option: any) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const sortOptions = (optionA: any, optionB: any) =>
    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase());

  const getNotFoundContent = () => {
    if (loadingVersions) {
      return <Spin size="small" />;
    }

    if (hasVersionsError) {
      return (
        <div className="nueva-produccion-form__not-found-content">
          <div style={{ color: '#ff4d4f', marginBottom: '8px' }}>Error al cargar versiones</div>
          <Button
            type="link"
            size="small"
            onClick={handleRetryLoadVersions}
            className="nueva-produccion-form__retry-button"
          >
            Reintentar
          </Button>
        </div>
      );
    }

    if (versionsEmpty) {
      return 'No se encontraron versiones de receta disponibles';
    }

    return 'No hay opciones disponibles';
  };

  return (
    <Card
      title={
        <div className="nueva-produccion-form__header">
          <PlusOutlined />
          Nueva Producción
        </div>
      }
      className="nueva-produccion-form"
      extra={
        <div className="nueva-produccion-form__user-info">
          Usuario: <strong className="nueva-produccion-form__user-highlight">{currentUser}</strong>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
        disabled={loading}
        size="large"
      >
        {/* Sección: Versión de Receta */}
        <Form.Item
          label={<RequiredLabel>Versión de Receta</RequiredLabel>}
          name="codigoVersionReceta"
          rules={[
            {
              required: true,
              message: 'Por favor selecciona una versión de receta',
            },
          ]}
          validateStatus={hasVersionsError ? 'error' : undefined}
          help={hasVersionsError ? 'No se pudieron cargar las versiones' : undefined}
        >
          <Select
            placeholder={getSelectPlaceholder()}
            showSearch
            allowClear
            optionFilterProp="children"
            filterOption={filterOptions}
            filterSort={sortOptions}
            notFoundContent={getNotFoundContent()}
            loading={loadingVersions}
            suffixIcon={getSuffixIcon()}
            disabled={loadingVersions || hasVersionsError}
            style={{ width: '100%' }}
            onChange={handleVersionChange}
            onClear={() => setSelectedVersion(null)}
            optionLabelProp="value"
          >
            {recipeVersions.map((version: any) => (
              <Select.Option
                key={version.codigoVersionReceta}
                value={version.codigoVersionReceta}
                label={`${version.codigoVersionReceta} - ${version.nombreVersionReceta}`}
              >
                <VersionOption version={version} />
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Detalles de la versión seleccionada */}
        {selectedVersion && (
          <div className="nueva-produccion-form__selected-version-section">
            <VersionDetails version={selectedVersion} />
          </div>
        )}

        {/* Sección: Código de Producción */}
        <Form.Item
          label={<RequiredLabel>Código de Producción</RequiredLabel>}
          name="codigoProduccion"
          rules={[
            {
              required: true,
              message: 'El código de producción es requerido',
            },
            {
              min: 1,
              message: 'El código de producción no puede estar vacío',
            },
            {
              max: 255,
              message: 'No puede exceder 255 caracteres',
            },
          ]}
        >
          <Input
            placeholder="Ej: PROD-2024-001"
            prefix={<BarcodeOutlined style={{ color: '#1890ff' }} />}
            maxLength={255}
            showCount
            allowClear
          />
        </Form.Item>

        {/* Sección: Número de Lote */}
        <Form.Item
          label={<span className="nueva-produccion-form__required-label">Lote</span>}
          name="lote"
          rules={[
            {
              validator: validateLoteFormat,
            },
          ]}
        >
          <Input
            placeholder="Ej: LOTE-2024-001"
            prefix={<FieldNumberOutlined style={{ color: '#1890ff' }} />}
            maxLength={100}
            showCount
            allowClear
            style={{ textTransform: 'uppercase' }}
            onInput={(e: React.FormEvent<HTMLInputElement>) => {
              e.currentTarget.value = e.currentTarget.value.toUpperCase();
            }}
          />
        </Form.Item>

        {/* Sección: Encargado de Producción */}
        <Form.Item
          label={<span className="nueva-produccion-form__required-label">Encargado</span>}
          name="encargado"
          rules={[
            {
              min: 1,
              message: 'El encargado no puede estar vacío',
            },
            {
              max: 100,
              message: 'No puede exceder 100 caracteres',
            },
          ]}
        >
          <Input
            placeholder="Ej: Juan Pérez"
            prefix={<UserOutlined style={{ color: '#1890ff' }} />}
            maxLength={100}
            showCount
            allowClear
          />
        </Form.Item>

        {/* Sección: Observaciones */}
        <Form.Item
          label={<span className="nueva-produccion-form__required-label">Observaciones</span>}
          name="observaciones"
          rules={[
            {
              min: 1,
              message: 'Las observaciones deben tener al menos 1 carácter',
            },
            {
              max: 255,
              message: 'No puede exceder 255 caracteres',
            },
          ]}
        >
          <Input.TextArea
            placeholder="Ej: Producción especial para cliente corporativo, control de calidad adicional requerido"
            rows={4}
            maxLength={255}
            showCount
            allowClear
            style={{ resize: 'vertical' }}
          />
        </Form.Item>

        {/* Botones de Acción */}
        <Form.Item style={{ marginBottom: 0 }}>
          <Space size="middle" className="nueva-produccion-form__action-buttons">
            <Button htmlType="button" onClick={handleResetForm} disabled={loading} size="large">
              Limpiar Formulario
            </Button>

            {hasVersionsError && (
              <Button
                type="dashed"
                onClick={handleRetryLoadVersions}
                loading={loadingVersions}
                size="large"
                danger
              >
                Reintentar Cargar Versiones
              </Button>
            )}

            <Button
              type="primary"
              htmlType="submit"
              icon={<PlusOutlined />}
              loading={loading}
              size="large"
              disabled={hasVersionsError}
              className="nueva-produccion-form__submit-button"
            >
              {loading ? 'Creando...' : 'Crear Producción'}
            </Button>
          </Space>
        </Form.Item>

        {/* Información adicional */}
        <div className="nueva-produccion-form__info-panel">
          <div className="nueva-produccion-form__info-text">
            <strong>
              {' '}
              Todos los campos marcados con
              <span className="nueva-produccion-form__required-asterisk">*</span> son obligatorios.
            </strong>
            {hasVersionsError && (
              <div className="nueva-produccion-form__error-text">
                Debes solucionar el error de carga de versiones para crear una producción.
              </div>
            )}
          </div>
        </div>
      </Form>
    </Card>
  );
};

export default NuevaProduccionForm;
