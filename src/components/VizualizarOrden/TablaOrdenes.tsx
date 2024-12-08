import { useState, useMemo } from 'react';

import { OrdenTrabajo } from '@/types/ordenTrabajo';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type TablaOrdenesProps = {
  ordenes: OrdenTrabajo[];
  onSeleccionarOrden: (id: number) => void;
};

export function TablaOrdenes({
  ordenes,
  onSeleccionarOrden,
}: TablaOrdenesProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(ordenes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = ordenes.slice(startIndex, endIndex);

  const getVisiblePages = useMemo(() => {
    const delta = 1; // Indices a mostrar antes y despues
    const range = [];
    const rangeWithDots = [];

    // Siempre mostrar la primera página
    range.push(1);

    // Calcular el rango de páginas a mostrar
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Agregar páginas y elipsis al array final
    let prev = 0;
    for (const i of range) {
      if (prev + 1 !== i) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(i);
      prev = i;
    }

    return rangeWithDots;
  }, [currentPage, totalPages]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-2">
        Mostrando {startIndex + 1} a {Math.min(endIndex, ordenes.length)} de{' '}
        {ordenes.length} órdenes
      </div>

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
          {currentItems.map((orden) => (
            <TableRow key={orden.id}>
              <TableCell>{orden.codigo}</TableCell>
              <TableCell>{orden.nombrecompleto}</TableCell>
              <TableCell>
                {new Date(orden.fecha).toLocaleDateString()}
              </TableCell>
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

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              className={
                currentPage === 1
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>

          {getVisiblePages.map((page, index) => (
            <PaginationItem key={index}>
              {page === '...' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => handlePageChange(page as number)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              className={
                currentPage === totalPages
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
