import { OrdenTrabajoDTO } from '@/interfaces/orden-trabajo.interface';
import api from './api';

export const getOrdenesTrabajo = async (filters?: Record<string, string>) => {
  const { data } = await api.get('/api/ordentrabajo', { params: filters });
  return data;
};

export const createOrdenTrabajo = async (
  orden: OrdenTrabajoDTO,
  file: File
) => {
  const formData = new FormData();
  formData.append('orden', JSON.stringify(orden));
  formData.append('file', file);

  await api.post('/api/ordentrabajo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getOrdenTrabajoById = async (id: number) => {
  const { data } = await api.get(`/api/ordentrabajo/${id}`);
  return data;
};

export const updateOrdenTrabajo = async (
  id: number,
  orden: OrdenTrabajoDTO,
  file?: File
) => {
  const formData = new FormData();
  formData.append('orden', JSON.stringify(orden));
  if (file) formData.append('file', file);

  await api.put(`/api/ordentrabajo/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteOrdenTrabajo = async (id: number) => {
  await api.delete(`/api/ordentrabajo/${id}`);
};

export const getHistorialOrdenTrabajo = async (id: number) => {
  const { data } = await api.get(`/api/ordentrabajo/${id}/historial`);
  console.log(data);
  return data;
};
