export interface InformeDiagnosticoDTO {
  id_ordenTrabajo: number;
  numeroSerie: string;
  estadoActual: string;
  problemasEncontrados: string;
  diagnosticoTecnico: string;
  recomendaciones: string;
  factibilidadReparacion: string;
  equipoirreparable: boolean;
  fecha: string;
}
