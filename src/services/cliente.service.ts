import api from './api';
import { ClienteDTO, ClienteListaDTO } from '@/interfaces/cliente.interface';

export const obtenerTodosLosClientes = async (): Promise<ClienteListaDTO[]> => {
  const { data } = await api.get('/api/clientes');
  return data;
};

export const insertarCliente = async (cliente: ClienteDTO): Promise<void> => {
  await api.post('/api/clientes', cliente);
};

// Obtener los detalles de un cliente por ID
export const obtenerDetallesCliente = async (
  id: number
): Promise<ClienteDTO> => {
  const { data } = await api.get(`/api/clientes/${id}`);
  return data;
};

// Actualizar un cliente por ID
export const actualizarCliente = async (
  id: number,
  cliente: ClienteDTO
): Promise<void> => {
  await api.put(`/api/clientes/${id}`, cliente);
};

// Eliminar un cliente por ID
export const eliminarCliente = async (id: number): Promise<void> => {
  await api.delete(`/api/clientes/${id}`);
};
