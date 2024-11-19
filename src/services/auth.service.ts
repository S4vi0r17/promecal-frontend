import api from './api';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/interfaces/auth.interface';

export const login = async (
  credentials: LoginRequest
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', credentials);
  localStorage.setItem('token', data.token);
  return data;
};

export const register = async (
  user: RegisterRequest
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/register', user);
  return data;
};

export const logout = (): void => {
  localStorage.removeItem('token');
};

// Obtener el token actual
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};
