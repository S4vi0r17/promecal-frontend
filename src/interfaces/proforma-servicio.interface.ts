export interface ProformaServicioListaDTO {
  id: number;
  codigo_ordentrabajo: string;
  detalleServicio: string;
  precioServicio: number;
  tiempoEstimadoEntrega: string;
  condicionesContratacion: string;
  estadoPago: string;
  fecha: string;
}

export interface ProformaServicioDTO {
  codigo_ordentrabajo: string;
  detalleServicio: string;
  precioServicio: number;
  tiempoEstimadoEntrega: string;
  condicionesContratacion: string;
  estadoPago: string;
  fecha: string;
}
