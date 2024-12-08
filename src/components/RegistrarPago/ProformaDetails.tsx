import { ProformaServicioListaDTO } from '@/interfaces/proforma-servicio.interface';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProformaDetailsProps {
  proforma: ProformaServicioListaDTO;
}

export function ProformaDetails({ proforma }: ProformaDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalles de la Proforma</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Código de Orden: {proforma.codigo_ordentrabajo}</p>
        <p>Detalle del Servicio: {proforma.detalleServicio}</p>
        <p>Precio: S/. {proforma.precioServicio}</p>
        <p>Tiempo Estimado de Entrega: {proforma.tiempoEstimadoEntrega}</p>
        <p>Condiciones de Contratación: {proforma.condicionesContratacion}</p>
        <p>Estado de Pago: {proforma.estadoPago}</p>
        <p>Fecha: {new Date(proforma.fecha).toLocaleDateString()}</p>
      </CardContent>
    </Card>
  );
}
