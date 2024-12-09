export interface OrdenTrabajoDTO {
    dni: string;
    fecha: string;
    descripcion: string;
    modelo: string;
    marca: string;
    rajaduras: boolean;
    manchas: boolean;
    golpes: boolean;
    documentourl?: string;
}

export interface OrdenTrabajoVistaDTO extends OrdenTrabajoDTO {
    codigo: string;
}

export interface OrdenTrabajoHistorialDTO {
    id: number;
    ordenTrabajoId: number;
    fechaModificacion: string;
    campoModificado: string;
    valorAnterior: string;
    valorNuevo: string;
}

export interface OrdenTrabajoListaDTO extends OrdenTrabajoDTO {
    id: number;
    codigo: string;
}
