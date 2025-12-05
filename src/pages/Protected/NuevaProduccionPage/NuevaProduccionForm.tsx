import React, {useEffect, useState} from 'react';
import {Button, Card, Form, Input, message, Select, Space} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import type {ProduccionCreateRequestDTO} from '@/pages/common/DetalleProduccion/types/Productions.ts'; // Corrected import path
import type {VersionRecetaResponseDTO} from '@/pages/Protected/VersionRecetas/types/RecipeVersions.ts';
import {type FormFieldConfig, getProduccionFormFields} from './NuevaProduccionFormFields.tsx';
import {VersionDetails} from './VersionDetails.tsx'; // Importamos el componente VersionDetails

const {Option} = Select;
const {TextArea} = Input;

interface NuevaProduccionFormProps {
    onSubmit: (data: ProduccionCreateRequestDTO) => void;
    loading?: boolean; // loading del submit
    currentUser: string; // Solo para mostrar
    recipeVersions?: VersionRecetaResponseDTO[]; // Make it optional
    hasVersionsError: boolean;
    refetchVersions: () => void;
}

export const NuevaProduccionForm: React.FC<NuevaProduccionFormProps> = ({
                                                                            onSubmit,
                                                                            loading = false,
                                                                            currentUser,
                                                                            recipeVersions = [], // Provide a default empty array
                                                                            hasVersionsError,
                                                                            refetchVersions,
                                                                        }) => {
    const [form] = Form.useForm();
    const [selectedVersion, setSelectedVersion] = useState<VersionRecetaResponseDTO | null>(null);

    // Generamos la configuración de los campos
    const formFields = getProduccionFormFields(
        recipeVersions,
        loading, // isFormSubmitting
        hasVersionsError,
        refetchVersions,
        (value) => { // onVersionChange
            if (!value) {
                setSelectedVersion(null);
                return;
            }
            const version = recipeVersions.find((v) => v.codigoVersionReceta === value);
            setSelectedVersion(version || null);
        }
    );

    useEffect(() => {
        if (hasVersionsError) {
            setSelectedVersion(null);
            form.setFieldsValue({codigoVersionReceta: undefined});
        }
    }, [hasVersionsError, form]);

    const handleFinish = (values: ProduccionCreateRequestDTO) => {
        onSubmit(values);
    };

    const handleFinishFailed = (errorInfo: any) => {
        if (import.meta.env.DEV) {
            console.log('Form validation failed:', errorInfo);
        }
        message.error('Por favor, corrige los errores en el formulario');
    };

    const handleResetForm = () => {
        form.resetFields();
        setSelectedVersion(null);
        message.success('Formulario limpiado');
    };

    // Mapeo de tipos de campo a componentes de Ant Design
    const renderFieldComponent = (field: FormFieldConfig) => {
        switch (field.type) {
            case 'text':
                return (
                    <Input
                        placeholder={field.placeholder}
                        prefix={field.prefix}
                        {...field.props}
                    />
                );
            case 'textarea':
                return (
                    <TextArea
                        placeholder={field.placeholder}
                        {...field.props}
                    />
                );
            case 'selectVersion':
                // Renderiza el Select de versiones con todas sus props ya configuradas
                return (
                    <Select {...field.props}>
                        {field.options?.map((option) => (
                            <Option key={option.value} value={option.value} label={option.label}>
                                {option.children || option.label}
                            </Option>
                        ))}
                    </Select>
                );
            default:
                if (import.meta.env.DEV) {
                    console.warn(`Tipo de campo desconocido: ${field.type}`);
                }
                return null;
        }
    };

    return (
        <Card
            title={
                <div className="nueva-produccion-form__header">
                    <PlusOutlined/>
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
                {formFields.map((field: FormFieldConfig) => (
                    <React.Fragment key={field.name}>
                        <Form.Item
                            label={field.label}
                            name={field.name}
                            rules={field.rules}
                            validateStatus={field.name === 'codigoVersionReceta' && hasVersionsError ? 'error' : undefined}
                            help={field.name === 'codigoVersionReceta' && hasVersionsError ? 'No se pudieron cargar las versiones' : undefined}
                        >
                            {renderFieldComponent(field)}
                        </Form.Item>
                        {/* Renderiza VersionDetails directamente si es el campo correcto y hay una versión seleccionada */}
                        {field.name === 'codigoVersionReceta' && selectedVersion && (
                            <div className="nueva-produccion-form__selected-version-section">
                                <VersionDetails version={selectedVersion}/>
                            </div>
                        )}
                    </React.Fragment>
                ))}

                {/* Botones de Acción */}
                <Form.Item style={{marginBottom: 0}}>
                    <Space size="middle" wrap className="nueva-produccion-form__action-buttons">
                        <Button htmlType="button" onClick={handleResetForm} disabled={loading} size="large">
                            Limpiar Formulario
                        </Button>

                        {hasVersionsError && (
                            <Button
                                type="dashed"
                                onClick={refetchVersions}
                                loading={loading}
                                size="large"
                                danger
                            >
                                Reintentar Cargar Versiones
                            </Button>
                        )}

                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<PlusOutlined/>}
                            loading={loading}
                            size="large"
                            disabled={hasVersionsError || recipeVersions.length === 0}
                            className="nueva-produccion-form__submit-button"
                        >
                            {loading ? 'Creando...' : 'Crear Producción'}
                        </Button>
                    </Space>
                </Form.Item>

                {/* Información adicional */}
                <div className="nueva-produccion-form__info-panel">
                    <div className="nueva-produccion-form__info-text">
                        <strong>Información:</strong> Todos los campos marcados con{' '}
                        <span className="nueva-produccion-form__required-asterisk">*</span> son obligatorios.
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
