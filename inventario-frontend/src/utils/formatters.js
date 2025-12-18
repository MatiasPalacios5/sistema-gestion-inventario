export const formatCurrency = (value) => {
    if (value === null || value === undefined || value === '') return '$ 0,00';
    // es-AR estándar incluye el espacio ($ 1.234,56)
    return Number(value).toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};
