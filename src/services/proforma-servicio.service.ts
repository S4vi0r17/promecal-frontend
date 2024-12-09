import api from './api';
import {
  ProformaServicioDTO,
  ProformaServicioListaDTO,
} from '@/interfaces/proforma-servicio.interface';

export const obtenerTodosLasProformas = async (): Promise<
  ProformaServicioListaDTO[]
> => {
  const { data } = await api.get('/api/proformaservicio');
  return data;
};

export const insertarProformaServicio = async (
  proforma: ProformaServicioDTO
): Promise<{ data: { id: number } }> => {
  const data = await api.post('/api/proformaservicio', proforma);
  console.log({ data });
  return data;
};

// Obtener detalles de una proforma de servicio por ID
export const obtenerDetallesProformaServicio = async (
  id: number
): Promise<ProformaServicioDTO> => {
  const { data } = await api.get(`/api/proformaservicio/${id}`);
  return data;
};

export const actualizarProformaServicio = async (
  id: number,
  proforma: ProformaServicioDTO
): Promise<void> => {
  await api.put(`/api/proformaservicio/${id}`, proforma);
};

export const eliminarProformaServicio = async (id: number): Promise<void> => {
  await api.delete(`/api/proformaservicio/${id}`);
};

// Buscar proformas de servicio por cliente (DNI)
export const obtenerProformaServicioPorCliente = async (
  dni: string
): Promise<ProformaServicioListaDTO[]> => {
  const { data } = await api.get(`/api/proformaservicio/cliente/${dni}`);
  return data;
};

// Registrar pago con archivo adjunto
export const registrarPagoService = async (
  id: number,
  file: File
): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);

  await api.post(`/api/proformaservicio/${id}/pago`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
