import React, { useEffect, useRef, useState } from 'react';
import type { InputProps } from 'antd';
import { Button, Checkbox, DatePicker, Input, InputNumber, TimePicker, Tooltip } from 'antd';
import { ExclamationCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { TipoDatoCampo } from '@/pages/Recetas/types/TipoDatoCampo';
import dayjs from 'dayjs';
import { useIsMobile } from '@/hooks/useIsMobile';

interface DebouncedInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => Promise<void> | void;
  tipoDato?: TipoDatoCampo;
}

export const DebouncedInput: React.FC<DebouncedInputProps> = ({
  value: globalValue,
  onChange: onGlobalChange,
  tipoDato = TipoDatoCampo.TEXTO,
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

  const handleSave = async () => {
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

  const renderInput = () => {
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
            {...commonProps}
            {...(rest as any)}
          />
        );
      case TipoDatoCampo.FECHA:
        return (
          <DatePicker
            value={localValue ? dayjs(localValue) : null}
            onChange={(_date, dateString) => {
              const newValue = typeof dateString === 'string' ? dateString : '';
              setLocalValue(newValue);
              setHasChanged(newValue !== globalValue);
              setError(null);
            }}
            {...commonProps}
            {...(rest as any)}
          />
        );
      case TipoDatoCampo.HORA:
        return (
          <TimePicker
            value={
              localValue
                ? localValue.includes('T')
                  ? dayjs(localValue)
                  : dayjs(localValue, 'HH:mm:ss')
                : null
            }
            onChange={(_time, timeString) => {
              const newValue = typeof timeString === 'string' ? timeString : '';
              setLocalValue(newValue);
              setHasChanged(newValue !== globalValue);
              setError(null);
            }}
            format="HH:mm:ss" // Aseguramos formato con segundos
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
            {rest.placeholder || 'Sí/No'}
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
