import React, { useState, useEffect } from 'react';
import { Input } from 'antd';
import type { InputProps } from 'antd';

// Extendemos las props del Input de Ant Design para que nuestro componente sea flexible.
interface DebouncedInputProps extends Omit<InputProps, 'value' | 'onChange'> {
    value: string;
    onChange: (value: string) => void;
}

/**
 * Un componente Input optimizado que utiliza un estado local para una respuesta de UI instantánea
 * y notifica al estado global de forma "debounced" (retrasada).
 * Esto previene el lag en formularios con muchos campos.
 */
export const DebouncedInput: React.FC<DebouncedInputProps> = ({ value: globalValue, onChange: onGlobalChange, ...rest }) => {
    // 1. Estado local para el valor del input. Se inicializa con el valor global.
    const [localValue, setLocalValue] = useState(globalValue);

    // 2. Efecto para sincronizar el estado local si el valor global cambia desde fuera.
    //    Esto es importante si el estado global se puede modificar por otras vías.
    useEffect(() => {
        setLocalValue(globalValue);
    }, [globalValue]);

    // 3. Manejador de cambio del input.
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        // Actualiza la UI de forma instantánea.
        setLocalValue(newValue);
        // Notifica al estado global (esta función ya viene con debounce desde el padre).
        onGlobalChange(newValue);
    };

    return (
        <Input
            value={localValue}
            onChange={handleChange}
            {...rest} // Pasa todas las demás props (placeholder, disabled, etc.) al Input de AntD.
        />
    );
};
