import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Descriptions, message, Spin, Typography } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useVersionRecetaDetalle } from './useVersionRecetaDetalle.ts';

const { Title, Text } = Typography;

export const VersionRecetaDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { recipe, loading, error } = useVersionRecetaDetalle(id);

  const handleBack = () => {
    navigate('/recetas/versiones');
  };

  const handleEdit = () => {
    if (recipe) {
      navigate(`/recetas/editar/${recipe.codigoVersionReceta}`);
    }
  };

  const handleDelete = () => {
    if (recipe) {
      // TODO: Implementar lógica de eliminación
      message.info(`Funcionalidad de eliminar para ${recipe.codigoVersionReceta} pendiente`);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error && !recipe) {
    return (
      <div style={{ padding: '1rem' }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          style={{ marginBottom: '1rem' }}
        >
          Volver a la lista
        </Button>
        <Card>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Text type="danger">
              No se pudo cargar la receta. Por favor, intente de nuevo más tarde.
            </Text>
            <br />
            <Button type="primary" onClick={handleBack} style={{ marginTop: '1rem' }}>
              Volver a la lista
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div style={{ padding: '1rem' }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          style={{ marginBottom: '1rem' }}
        >
          Volver a la lista
        </Button>
        <Card>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Text>Receta no encontrada</Text>
            <br />
            <Button type="primary" onClick={handleBack} style={{ marginTop: '1rem' }}>
              Volver a la lista
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={handleBack}
        style={{ marginBottom: '1rem' }}
      >
        Volver a la lista
      </Button>

      <Card>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '1rem',
          }}
        >
          <Title level={2} style={{ margin: 0 }}>
            {recipe.codigoRecetaPadre}
          </Title>
        </div>

        <Descriptions bordered column={1}>
          <Descriptions.Item label="Código Versión">
            <Text strong>{recipe.codigoVersionReceta}</Text>
          </Descriptions.Item>

          <Descriptions.Item label="Código Receta Padre">
            {recipe.codigoRecetaPadre || 'No especificado'}
          </Descriptions.Item>

          {recipe.descripcion && (
            <Descriptions.Item label="Descripción">{recipe.descripcion}</Descriptions.Item>
          )}

          <Descriptions.Item label="Fecha de creación">
            {recipe.fechaCreacion
              ? new Date(recipe.fechaCreacion).toLocaleDateString('es-AR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'No especificada'}
          </Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <Button type="primary" icon={<EditOutlined />} onClick={handleEdit} size="large">
            Editar Receta
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={handleDelete} size="large">
            Eliminar
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default VersionRecetaDetalle;
