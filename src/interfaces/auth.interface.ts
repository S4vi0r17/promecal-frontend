export enum Rol {
  ROLE_ADMINISTRADOR = 'ROLE_ADMINISTRADOR',
  ROLE_ASISTENTE_DE_RECEPCION = 'ROLE_ASISTENTE_DE_RECEPCION',
  ROLE_ASISTENTE_TECNICO = 'ROLE_ASISTENTE_TECNICO',
  ROLE_EJECUTIVO_DE_VENTAS = 'ROLE_EJECUTIVO_DE_VENTAS',
}

export interface LoginRequest {
  nombreusuario: string;
  contrasena: string;
}

export interface RegisterRequest {
  nombreusuario: string;
  contrasena: string;
  nombrecompleto: string;
  correoelectronico: string;
  rol: Rol;
}

export interface AuthResponse {
  token: string;
  rol: Rol;
}
