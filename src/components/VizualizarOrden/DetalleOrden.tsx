import { DetalleOrden, HistorialModificacion } from '@/types/ordenTrabajo';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Clock,
  User,
  Package,
  X,
  Check,
  FileDown,
  Printer,
} from 'lucide-react';

type DetalleOrdenModalProps = {
  orden: DetalleOrden | null;
  historial: HistorialModificacion[];
  abierto: boolean;
  onOpenChange: (open: boolean) => void;
  onDescargarPDF: () => void;
  onImprimir: () => void;
};

export function DetalleOrdenModal({
  orden,
  historial,
  abierto,
  onOpenChange,
  onDescargarPDF,
  onImprimir,
}: DetalleOrdenModalProps) {
  if (!orden) return null;

  return (
    <Sheet open={abierto} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            Detalles de la Orden de Trabajo {orden.codigo}
          </SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Información General</h3>
              <p>
                <Clock className="inline mr-2" /> Fecha:{' '}
                {new Date(orden.fecha).toLocaleString()}
              </p>
              <p>
                <User className="inline mr-2" /> Cliente: {orden.nombrecompleto}
              </p>
              <p>DNI: {orden.dni}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Información del Equipo</h3>
              <p>
                <Package className="inline mr-2" /> Marca: {orden.marca}
              </p>
              <p>Modelo: {orden.modelo}</p>
              <p>Estado Físico:</p>
              <ul className="list-disc list-inside">
                <li>
                  Rajaduras:{' '}
                  {orden.rajaduras ? (
                    <X className="inline text-red-500" />
                  ) : (
                    <Check className="inline text-green-500" />
                  )}
                </li>
                <li>
                  Manchas:{' '}
                  {orden.manchas ? (
                    <X className="inline text-red-500" />
                  ) : (
                    <Check className="inline text-green-500" />
                  )}
                </li>
                <li>
                  Golpes:{' '}
                  {orden.golpes ? (
                    <X className="inline text-red-500" />
                  ) : (
                    <Check className="inline text-green-500" />
                  )}
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Descripción</h3>
            <p>{orden.descripcion}</p>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Historial de Modificaciones</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Campo</TableHead>
                  <TableHead>Valor Anterior</TableHead>
                  <TableHead>Valor Nuevo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historial.map((modificacion) => (
                  <TableRow key={modificacion.id}>
                    <TableCell>
                      {new Date(
                        modificacion.fechaModificacion
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell>{modificacion.campoModificado}</TableCell>
                    <TableCell>{modificacion.valorAnterior}</TableCell>
                    <TableCell>{modificacion.valorNuevo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <SheetFooter className="mt-4">
            <Button onClick={onDescargarPDF}>
              <FileDown className="mr-2 h-4 w-4" /> Ver Documento
            </Button>
            <Button onClick={onImprimir}>
              <Printer className="mr-2 h-4 w-4" /> Imprimir Documento
            </Button>
            <SheetClose asChild>
              <Button variant="outline">Cerrar</Button>
            </SheetClose>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
