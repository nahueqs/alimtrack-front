import React, { useEffect, useRef, useState } from 'react';
import type { InputProps } from 'antd';
import { Button, Checkbox, DatePicker, Input, InputNumber, TimePicker, Tooltip } from 'antd';
import { ExclamationCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { TipoDatoCampo } from '@/pages/Recetas/types/TipoDatoCampo';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useIsMobile } from '@/hooks/useIsMobile';

dayjs.extend(customParseFormat);

interface DebouncedInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => Promise<void> | void;
  tipoDato?: TipoDatoCampo;
}

export const DebouncedInput: React.FC<DebouncedInputProps> = ({
  value: globalValue,
  onChange: onGlobalChange,
  tipoDato = TipoDatoCampo.TEXTO,
  placeholder,
  ...rest
}) => {
  const [localValue, setLocalValue] = useState(globalValue);
  const [isFocused, setIsFocused] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const inputRef = useRef<any>(null);
  const prevGlobalValueRef = useRef(globalValue);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (globalValue !== prevGlobalValueRef.current) {
      setLocalValue(globalValue);
      prevGlobalValueRef.current = globalValue;
      if (globalValue === localValue) {
        setHasChanged(false);
      }
    }
  }, [globalValue, localValue]);

  const validateValue = (val: string): string | null => {
    if (!val) return null; // Permitir vacío (validación de requerido es externa)

    switch (tipoDato) {
      case TipoDatoCampo.ENTERO:
        // Permite negativos, pero no decimales
        if (!/^-?\d+$/.test(val)) {
          return 'Debe ser un número entero (sin decimales)';
        }
        break;
      case TipoDatoCampo.DECIMAL:
        // Permite negativos y decimales con punto
        if (!/^-?\d+(\.\d+)?$/.test(val)) {
          return 'Debe ser un número decimal válido (ej: 10.5)';
        }
        break;
      default:
        break;
    }
    return null;
  };

  const handleSave = async () => {
    // Validación local antes de enviar
    const validationError = validateValue(localValue);
    if (validationError) {
      setError(validationError);
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await onGlobalChange(localValue);
      setHasChanged(false);
    } catch (e: any) {
      console.error('Error al guardar input:', e);
      setError(e.message || 'Error al guardar');
      if (inputRef.current) {
        inputRef.current.focus();
        if (inputRef.current.select) {
          inputRef.current.select();
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    setError(null);
    if (e.target && e.target.select) {
      e.target.select();
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  const commonProps = {
    onFocus: handleFocus,
    onBlur: handleBlur,
    status: error ? ('error' as const) : undefined,
    disabled: isSaving || rest.disabled,
    style: { width: '100%' },
    ref: inputRef,
  };

  // Generar placeholder con tipo de dato
  const getPlaceholder = () => {
    const basePlaceholder = placeholder || 'Ingrese valor';
    // No mostrar tipo para fechas/horas/booleanos ya que el control es explícito
    if (
      tipoDato === TipoDatoCampo.FECHA ||
      tipoDato === TipoDatoCampo.HORA ||
      tipoDato === TipoDatoCampo.BOOLEANO
    ) {
      return basePlaceholder;
    }
    
    let typeLabel = '';
    switch (tipoDato) {
      case TipoDatoCampo.ENTERO:
        typeLabel = 'Entero';
        break;
      case TipoDatoCampo.DECIMAL:
        typeLabel = 'Decimal';
        break;
      case TipoDatoCampo.TEXTO:
        typeLabel = 'Texto';
        break;
    }
    
    return typeLabel ? `${basePlaceholder} (${typeLabel})` : basePlaceholder;
  };

  const parseDate = (val: string) => {
    if (!val) return null;
    // Intentar parsear formato DD/MM/YYYY
    let d = dayjs(val, 'DD/MM/YYYY', true);
    if (d.isValid()) return d;
    
    // Intentar parsear formato ISO YYYY-MM-DD
    d = dayjs(val, 'YYYY-MM-DD', true);
    if (d.isValid()) return d;
    
    // Fallback
    d = dayjs(val);
    return d.isValid() ? d : null;
  };

  const parseTime = (val: string) => {
    if (!val) return null;
    
    // Intentar parsear con varios formatos estrictos
    const formats = ['HH:mm:ss', 'HH:mm', 'H:mm:ss', 'H:mm'];
    for (const fmt of formats) {
      const d = dayjs(val, fmt, true);
      if (d.isValid()) return d;
    }
    
    // Fallback a parseo estándar de dayjs (útil para ISO strings completos)
    const d = dayjs(val);
    return d.isValid() ? d : null;
  };

  const renderInput = () => {
    const finalPlaceholder = getPlaceholder();

    switch (tipoDato) {
      case TipoDatoCampo.ENTERO:
        return (
          <InputNumber
            value={localValue}
            onChange={(val) => {
              const newValue = val === null ? '' : val.toString();
              setLocalValue(newValue);
              setHasChanged(newValue !== globalValue);
              setError(null);
            }}
            stringMode
            precision={0}
            placeholder={finalPlaceholder}
            {...commonProps}
            {...(rest as any)}
          />
        );
      case TipoDatoCampo.DECIMAL:
        return (
          <InputNumber
            value={localValue}
            onChange={(val) => {
              const newValue = val === null ? '' : val.toString();
              setLocalValue(newValue);
              setHasChanged(newValue !== globalValue);
              setError(null);
            }}
            stringMode
            step={0.01}
            placeholder={finalPlaceholder}
            {...commonProps}
            {...(rest as any)}
          />
        );
      case TipoDatoCampo.FECHA:
        return (
          <DatePicker
            value={parseDate(localValue)}
            onChange={(_date, dateString) => {
              const newValue = typeof dateString === 'string' ? dateString : '';
              setLocalValue(newValue);
              setHasChanged(newValue !== globalValue);
              setError(null);
            }}
            format="DD/MM/YYYY"
            placeholder={placeholder || 'DD/MM/AAAA'}
            {...commonProps}
            {...(rest as any)}
          />
        );
      case TipoDatoCampo.HORA:
        return (
          <TimePicker
            value={parseTime(localValue)}
            onChange={(time) => {
              // Usamos el objeto time directamente para formatear y evitar discrepancias
              const newValue = time ? time.format('HH:mm:ss') : '';
              setLocalValue(newValue);
              setHasChanged(newValue !== globalValue);
              setError(null);
            }}
            format="HH:mm:ss"
            placeholder={placeholder || 'HH:mm:ss'}
            {...commonProps}
            {...(rest as any)}
          />
        );
      case TipoDatoCampo.BOOLEANO:
        return (
          <Checkbox
            checked={localValue === 'true'}
            onChange={(e) => {
              const newValue = e.target.checked ? 'true' : 'false';
              setLocalValue(newValue);
              setHasChanged(newValue !== globalValue);
              setError(null);
            }}
            disabled={isSaving || rest.disabled}
          >
            {placeholder || 'Sí/No'}
          </Checkbox>
        );
      case TipoDatoCampo.TEXTO:
      default:
        return (
          <Input
            value={localValue}
            onChange={(e) => {
              const newValue = e.target.value;
              setLocalValue(newValue);
              setHasChanged(newValue !== globalValue);
              setError(null);
            }}
            placeholder={finalPlaceholder}
            {...commonProps}
            {...rest}
          />
        );
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
        <div style={{ flex: 1 }}>
          {error ? (
            <Tooltip title={error} color="red" placement="topLeft" open={isFocused || !!error}>
              {renderInput()}
            </Tooltip>
          ) : (
            renderInput()
          )}
        </div>
        {(isFocused || hasChanged || isSaving) && (
          <Button
            type={error ? 'primary' : 'primary'}
            danger={!!error}
            icon={error ? <ExclamationCircleOutlined /> : <SaveOutlined />}
            onClick={handleSave}
            loading={isSaving}
            disabled={!hasChanged && !error}
            size={isMobile ? 'small' : 'middle'}
            style={{ flexShrink: 0 }}
            onMouseDown={(e) => e.preventDefault()}
          >
            {!isMobile && (error ? 'Reintentar' : 'Guardar')}
          </Button>
        )}
      </div>
      {error && <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>{error}</div>}
    </div>
  );
};
