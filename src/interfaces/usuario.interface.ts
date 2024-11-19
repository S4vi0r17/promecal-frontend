export enum Rol {
  ROLE_ADMINISTRADOR = 'ROLE_ADMINISTRADOR',
  ROLE_ASISTENTE_DE_RECEPCION = 'ROLE_ASISTENTE_DE_RECEPCION',
  ROLE_ASISTENTE_TECNICO = 'ROLE_ASISTENTE_TECNICO',
  ROLE_EJECUTIVO_DE_VENTAS = 'ROLE_EJECUTIVO_DE_VENTAS',
}

export interface UsuarioDTO {
  nombreusuario: string;
  nombrecompleto: string;
  correoelectronico: string;
  contrasena: string;
  rol: Rol;
}

export interface UsuarioListaDTO {
  id: number;
  nombreusuario: string;
  nombrecompleto: string;
  correoelectronico: string;
  rol: Rol;
}

export interface UsuarioVistaDTO {
  nombreusuario: string;
  nombrecompleto: string;
  correoelectronico: string;
  rol: Rol;
}
