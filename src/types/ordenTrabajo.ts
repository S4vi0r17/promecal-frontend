export type OrdenTrabajo = {
    id: number
    codigo: string
    dni: string
    nombrecompleto: string
    fecha: string
    descripcion: string
    modelo: string
    marca: string
    rajaduras: boolean
    manchas: boolean
    golpes: boolean
}

export type DetalleOrden = OrdenTrabajo & {
    documentourl: string
}

export type HistorialModificacion = {
    id: number
    ordenTrabajoId: number
    fechaModificacion: string
    campoModificado: string
    valorAnterior: string
    valorNuevo: string
}
