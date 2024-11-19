import api from './api';
import {
  UsuarioDTO,
  UsuarioListaDTO,
  UsuarioVistaDTO,
} from '@/interfaces/usuario.interface';

export const obtenerTodosLosUsuarios = async (): Promise<UsuarioListaDTO[]> => {
  const { data } = await api.get('/api/usuarios');
  return data;
};

export const insertarUsuario = async (usuario: UsuarioDTO): Promise<void> => {
  await api.post('/api/usuarios', usuario);
};

// Obtener los detalles de un usuario por ID
export const obtenerDetallesUsuario = async (
  id: number
): Promise<UsuarioVistaDTO> => {
  const { data } = await api.get(`/api/usuarios/${id}`);
  return data;
};

// Actualizar un usuario por ID
export const actualizarUsuario = async (
  id: number,
  usuario: UsuarioVistaDTO
): Promise<void> => {
  await api.put(`/api/usuarios/${id}`, usuario);
};

// Eliminar un usuario por ID
export const eliminarUsuario = async (id: number): Promise<void> => {
  await api.delete(`/api/usuarios/${id}`);
};
