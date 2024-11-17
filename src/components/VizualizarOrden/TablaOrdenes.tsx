import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { OrdenTrabajo } from '@/types/ordenTrabajo';

type TablaOrdenesProps = {
  ordenes: OrdenTrabajo[];
  onSeleccionarOrden: (id: number) => void;
};

export function TablaOrdenes({
  ordenes,
  onSeleccionarOrden,
}: TablaOrdenesProps) {
  if (ordenes.length === 0) {
    return (
      <Alert>
        <AlertTitle>No hay órdenes pendientes</AlertTitle>
        <AlertDescription>
          No se encontraron órdenes de trabajo pendientes.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Código</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Modelo</TableHead>
          <TableHead>Marca</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Acción</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ordenes.map((orden) => (
          <TableRow key={orden.id}>
            <TableCell>{orden.codigo}</TableCell>
            <TableCell>{orden.nombrecompleto}</TableCell>
            <TableCell>{new Date(orden.fecha).toLocaleDateString()}</TableCell>
            <TableCell>{orden.modelo}</TableCell>
            <TableCell>{orden.marca}</TableCell>
            <TableCell>
              <Badge
                variant={
                  orden.rajaduras || orden.manchas || orden.golpes
                    ? 'destructive'
                    : 'default'
                }
              >
                {orden.rajaduras || orden.manchas || orden.golpes
                  ? 'Con daños'
                  : 'Sin daños'}
              </Badge>
            </TableCell>
            <TableCell>
              <Button onClick={() => onSeleccionarOrden(orden.id)}>
                Ver Detalles
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
