import { OrdenTrabajo } from '@/types/ordenTrabajo';

function generarCodigo(index: number): string {
  return `OT-${String(index).padStart(4, '0')}`;
}

function fechaAleatoria(): Date {
  const inicio = new Date(2024, 0, 1).getTime();
  const fin = new Date().getTime();
  return new Date(inicio + Math.random() * (fin - inicio));
}

const marcas = [
  'Samsung',
  'LG',
  'Sony',
  'Apple',
  'Huawei',
  'Xiaomi',
  'Motorola',
  'Nokia',
];
const modelos = [
  'Galaxy S23',
  'iPhone 15',
  'P40 Pro',
  'Redmi Note 12',
  'Xperia 1',
  'G Power',
];
const nombres = [
  'Juan Pérez',
  'María García',
  'Carlos López',
  'Ana Martínez',
  'Luis Rodriguez',
  'Patricia Sánchez',
  'Miguel Torres',
  'Laura González',
];

export function generarOrdenesPrueba(cantidad: number): OrdenTrabajo[] {
  return Array.from({ length: cantidad }, (_, index) => ({
    id: index + 1,
    codigo: generarCodigo(index + 1),
    nombrecompleto: nombres[Math.floor(Math.random() * nombres.length)],
    dni: Math.floor(10000000 + Math.random() * 90000000).toString(),
    fecha: fechaAleatoria().toISOString(),
    marca: marcas[Math.floor(Math.random() * marcas.length)],
    modelo: modelos[Math.floor(Math.random() * modelos.length)],
    descripcion: 'Descripción de la orden de trabajo...',
    rajaduras: Math.random() > 0.7,
    manchas: Math.random() > 0.7,
    golpes: Math.random() > 0.7,
    estado: Math.random() > 0.5 ? 'Pendiente' : 'Completado',
  }));
}
