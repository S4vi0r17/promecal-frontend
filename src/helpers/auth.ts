import { jwtDecode } from 'jwt-decode';

export const getUserRole = (): string | null => {
  return localStorage.getItem('userRole');
};

export const getUserName = (): string => {
  const token = localStorage.getItem('token');

  if (!token) return 'Usuario';

  const decodedToken: { nombrecompleto: string } = jwtDecode(token);
  
  return decodedToken.nombrecompleto;
};
