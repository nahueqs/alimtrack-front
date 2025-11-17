export const validateLoteFormat = (_: any, value: string) => {
  if (!value) {
    return Promise.reject(new Error('El número de lote es requerido'));
  }

  const loteRegex = /^[A-Z0-9-]+$/;
  if (!loteRegex.test(value)) {
    return Promise.reject(
      new Error('Formato de lote inválido. Solo se permiten mayúsculas, números y guiones')
    );
  }

  if (value.length > 100) {
    return Promise.reject(new Error('El lote no puede exceder 100 caracteres'));
  }

  return Promise.resolve();
};
