// components/dashboard/NewProductionForm.tsx
import React, { useState } from 'react';

interface NewProductionFormProps {
  onCancel: () => void;
  onSubmit: (data: ProductionFormData) => void;
}

export interface ProductionFormData {
  nombre: string;
  descripcion: string;
  recetaId: string;
  cantidad: number;
  fechaInicio: string;
  prioridad: 'alta' | 'media' | 'baja';
}

export const NewProductionForm: React.FC<NewProductionFormProps> = ({ onCancel, onSubmit }) => {
  const [formData, setFormData] = useState<ProductionFormData>({
    nombre: '',
    descripcion: '',
    recetaId: '',
    cantidad: 0,
    fechaInicio: new Date().toISOString().split('T')[0],
    prioridad: 'media',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cantidad' ? Number(value) : value,
    }));
  };

  return (
    <div className="dashboard__new-production">
      <div className="dashboard__new-production-header">
        <h2 className="dashboard__new-production-title">Iniciar Nueva Producción</h2>
        <p className="dashboard__new-production-subtitle">
          Completa los datos para iniciar una nueva producción
        </p>
      </div>

      <form onSubmit={handleSubmit} className="dashboard__production-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">
              Nombre de la Producción *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="Ej: Producción de Pan Integral - Lote 001"
            />
          </div>

          <div className="form-group">
            <label htmlFor="recetaId" className="form-label">
              Receta *
            </label>
            <select
              id="recetaId"
              name="recetaId"
              value={formData.recetaId}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Seleccionar receta...</option>
              <option value="1">Pan Blanco Tradicional</option>
              <option value="2">Pan Integral</option>
              <option value="3">Facturas</option>
              <option value="4">Pizza Precocida</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="cantidad" className="form-label">
              Cantidad a Producir *
            </label>
            <input
              type="number"
              id="cantidad"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              className="form-input"
              required
              min="1"
              placeholder="Ej: 100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="fechaInicio" className="form-label">
              Fecha de Inicio *
            </label>
            <input
              type="date"
              id="fechaInicio"
              name="fechaInicio"
              value={formData.fechaInicio}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="prioridad" className="form-label">
              Prioridad
            </label>
            <select
              id="prioridad"
              name="prioridad"
              value={formData.prioridad}
              onChange={handleChange}
              className="form-select"
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label htmlFor="descripcion" className="form-label">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="form-textarea"
              rows={3}
              placeholder="Descripción opcional de la producción..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn btn--secondary">
            Cancelar
          </button>
          <button type="submit" className="btn btn--primary">
            Iniciar Producción
          </button>
        </div>
      </form>
    </div>
  );
};
