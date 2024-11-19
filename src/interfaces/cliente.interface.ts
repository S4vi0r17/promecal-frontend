export interface ClienteResponse {
  id: number;
  dni: string;
  nombrecompleto: string;
  celular: string;
  direccion: string;
}

export interface ClienteDTO {
  nombrecompleto: string;
  dni: string;
  direccion: string;
  celular: string;
}

export interface ClienteListaDTO extends ClienteDTO {
  id: number;
}
