import { useEffect, useState } from 'react';

import {
  actualizarProformaServicio,
  eliminarProformaServicio,
  insertarProformaServicio,
  obtenerTodosLasProformas,
} from '@/services/proforma-servicio.service';

import { ProformaServicioListaDTO } from '@/interfaces/proforma-servicio.interface';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import Loader from '@/components/Loader';

import { Trash, UserPen, UserPlus2 } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ResponseData } from '@/interfaces/response-data.interface';

export default function GestionProformasPage() {
  const [proformas, setProformas] = useState<ProformaServicioListaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [errorDialog, setErrorDialog] = useState<null | string>(null);

  const [editingProforma, setEditingProforma] =
    useState<ProformaServicioListaDTO | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [proformaToDelete, setProformaToDelete] =
    useState<ProformaServicioListaDTO | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingProforma) {
      setEditingProforma({
        ...editingProforma,
        [name]: name === 'precioServicio' ? parseFloat(value) : value,
      });
    }
  };

  const fetchProformas = async () => {
    try {
      const data = await obtenerTodosLasProformas();
      const proformasData = data.map((proforma: ProformaServicioListaDTO) => ({
        id: proforma.id,
        codigo_ordentrabajo: proforma.codigo_ordentrabajo,
        detalleServicio: proforma.detalleServicio,
        precioServicio: proforma.precioServicio,
        tiempoEstimadoEntrega: proforma.tiempoEstimadoEntrega,
        condicionesContratacion: proforma.condicionesContratacion,
        estadoPago: proforma.estadoPago,
        fecha: proforma.fecha,
      }));
      setProformas(proformasData);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar las proformas');
      setLoading(false);
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    fetchProformas();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleAddProforma = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const proformaData = {
        codigo_ordentrabajo: editingProforma?.codigo_ordentrabajo || '',
        detalleServicio: editingProforma?.detalleServicio || '',
        precioServicio: editingProforma?.precioServicio || 0,
        tiempoEstimadoEntrega: editingProforma?.tiempoEstimadoEntrega || '',
        condicionesContratacion: editingProforma?.condicionesContratacion || '',
        estadoPago: editingProforma?.estadoPago || '',
        fecha: editingProforma?.fecha || '',
      };

      const response = await insertarProformaServicio(proformaData);

      const newProforma = {
        id: response.data.id,
        ...proformaData,
      };

      setProformas([...proformas, newProforma]);
      fetchProformas();
      setIsAddOpen(false);
      setEditingProforma(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        if (axiosError.response) {
          const { message } = axiosError.response.data as ResponseData;
          setErrorDialog(message);
        }

        setTimeout(() => {
          setErrorDialog(null);
        }, 3000);
      }
    }
  };

  const handleEditProforma = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProforma || !editingProforma.id) {
      console.error('No proforma selected for editing or invalid ID');
      return;
    }

    const proformaId = Number(editingProforma.id);

    if (isNaN(proformaId)) {
      console.error('Invalid proforma ID');
      return;
    }

    try {
      const proformaData = {
        codigo_ordentrabajo: editingProforma.codigo_ordentrabajo,
        detalleServicio: editingProforma.detalleServicio,
        precioServicio: editingProforma.precioServicio,
        tiempoEstimadoEntrega: editingProforma.tiempoEstimadoEntrega,
        condicionesContratacion: editingProforma.condicionesContratacion,
        estadoPago: editingProforma.estadoPago,
        fecha: editingProforma.fecha,
      };

      await actualizarProformaServicio(proformaId, proformaData);

      setProformas(
        proformas.map((proforma) =>
          proforma.id === editingProforma.id ? editingProforma : proforma
        )
      );
      setIsEditOpen(false);
      setEditingProforma(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        if (axiosError.response) {
          const { message } = axiosError.response.data as ResponseData;
          setErrorDialog(message);
        }

        setTimeout(() => {
          setErrorDialog(null);
        }, 3000);
      }
    }
  };

  const handleDeleteProforma = async () => {
    if (!proformaToDelete) return;
    try {
      // await api.delete(`/api/proformaservicio/${proformaToDelete.id}`);
      await eliminarProformaServicio(proformaToDelete.id);
      setProformas(
        proformas.filter((proforma) => proforma.id !== proformaToDelete.id)
      );
      setIsDeleteOpen(false);
      setProformaToDelete(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        if (axiosError.response) {
          const { message } = axiosError.response.data as ResponseData;
          setErrorDialog(message);
        }

        setTimeout(() => {
          setErrorDialog(null);
        }, 3000);
      }
    }
  };

  const openAddDialog = () => {
    setEditingProforma({
      id: 0,
      codigo_ordentrabajo: '',
      detalleServicio: '',
      precioServicio: 0,
      tiempoEstimadoEntrega: '',
      condicionesContratacion: '',
      estadoPago: '',
      fecha: '',
    });
    setIsAddOpen(true);
  };

  const openEditDialog = (proforma: ProformaServicioListaDTO) => {
    setEditingProforma({ ...proforma });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (proforma: ProformaServicioListaDTO) => {
    setProformaToDelete(proforma);
    setIsDeleteOpen(true);
  };

  // Función para formatear la fecha para mostrarla en el input y en la tabla
  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Función para formatear la fecha para mostrarla en la tabla de manera legible
  const formatFechaDisplay = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center">
      <div className="container bg-white max-w-[1250px] mx-auto p-5">
        <div className="flex justify-between items-center">
          <h1 className="text-center text-2xl font-bold text-gray-800">
            Gestión de Proformas
          </h1>
          <Button onClick={openAddDialog}>
            <UserPlus2 className="w-6 h-6" />
            Agregar Proforma
          </Button>
        </div>
        <div className="mt-6 w-full">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="text-gray-800">
                <TableHead className="text-center">ID</TableHead>
                <TableHead className="text-center">
                  Código Orden Trabajo
                </TableHead>
                <TableHead className="text-center">Detalle Servicio</TableHead>
                <TableHead className="text-center">Precio Servicio</TableHead>
                <TableHead className="text-center">
                  Tiempo Estimado Entrega
                </TableHead>
                <TableHead className="text-center">
                  Condiciones Contratación
                </TableHead>
                <TableHead className="text-center">Estado Pago</TableHead>
                <TableHead className="text-center">Fecha</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proformas.map((proforma: ProformaServicioListaDTO) => (
                <TableRow
                  key={proforma.id}
                  // className={`${
                  //   index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                  // } hover:bg-gray-200`}
                >
                  <TableCell className="py-2 px-4 text-center">
                    {proforma.id}
                  </TableCell>
                  <TableCell className="py-2 px-4 text-center">
                    {proforma.codigo_ordentrabajo}
                  </TableCell>
                  <TableCell className="py-2 px-4 text-center">
                    {proforma.detalleServicio}
                  </TableCell>
                  <TableCell className="py-2 px-4 text-center">
                    {proforma.precioServicio}
                  </TableCell>
                  <TableCell className="py-2 px-4 text-center">
                    {proforma.tiempoEstimadoEntrega}
                  </TableCell>
                  <TableCell className="py-2 px-4 text-center">
                    {proforma.condicionesContratacion}
                  </TableCell>
                  <TableCell className="py-2 px-4 text-center">
                    {proforma.estadoPago}
                  </TableCell>
                  <TableCell className="py-2 px-4 text-center">
                    {formatFechaDisplay(proforma.fecha)}
                  </TableCell>
                  <TableCell className="py-2 px-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <Button
                        onClick={() => openEditDialog(proforma)}
                        variant={'outline'}
                      >
                        <UserPen className="w-6 h-6" />
                        Modificar
                      </Button>
                      <Button
                        onClick={() => openDeleteDialog(proforma)}
                        variant={'destructive'}
                      >
                        <Trash className="w-6 h-6" />
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Diálogo para agregar proforma */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nueva Proforma</DialogTitle>
            </DialogHeader>
            {errorDialog && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorDialog}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleAddProforma} className="space-y-4">
              <div>
                <Label htmlFor="codigo_ordentrabajo">
                  Código Orden Trabajo
                </Label>
                <Input
                  id="codigo_ordentrabajo"
                  name="codigo_ordentrabajo"
                  value={editingProforma?.codigo_ordentrabajo || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="detalleServicio">Detalle Servicio</Label>
                <Input
                  id="detalleServicio"
                  name="detalleServicio"
                  value={editingProforma?.detalleServicio || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="precioServicio">Precio Servicio</Label>
                <Input
                  id="precioServicio"
                  name="precioServicio"
                  type="number"
                  step="0.01"
                  value={editingProforma?.precioServicio || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="tiempoEstimadoEntrega">
                  Tiempo Estimado Entrega
                </Label>
                <Input
                  id="tiempoEstimadoEntrega"
                  name="tiempoEstimadoEntrega"
                  value={editingProforma?.tiempoEstimadoEntrega || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="condicionesContratacion">
                  Condiciones Contratación
                </Label>
                <Input
                  id="condicionesContratacion"
                  name="condicionesContratacion"
                  value={editingProforma?.condicionesContratacion || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="estadoPago">Estado Pago</Label>
                <Input
                  id="estadoPago"
                  name="estadoPago"
                  value={editingProforma?.estadoPago || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="fecha">Fecha y Hora</Label>
                <Input
                  id="fecha"
                  name="fecha"
                  type="datetime-local"
                  value={
                    editingProforma?.fecha
                      ? formatFecha(editingProforma.fecha)
                      : ''
                  }
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Guardar Proforma</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Diálogo para editar proforma */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modificar Proforma</DialogTitle>
            </DialogHeader>
            {errorDialog && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorDialog}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleEditProforma} className="space-y-4">
              <div>
                <Label htmlFor="codigo_ordentrabajo">
                  Código Orden Trabajo
                </Label>
                <Input
                  id="codigo_ordentrabajo"
                  name="codigo_ordentrabajo"
                  value={editingProforma?.codigo_ordentrabajo || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="detalleServicio">Detalle Servicio</Label>
                <Input
                  id="detalleServicio"
                  name="detalleServicio"
                  value={editingProforma?.detalleServicio || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="precioServicio">Precio Servicio</Label>
                <Input
                  id="precioServicio"
                  name="precioServicio"
                  type="number"
                  step="0.01"
                  value={editingProforma?.precioServicio || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="tiempoEstimadoEntrega">
                  Tiempo Estimado Entrega
                </Label>
                <Input
                  id="tiempoEstimadoEntrega"
                  name="tiempoEstimadoEntrega"
                  value={editingProforma?.tiempoEstimadoEntrega || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="condicionesContratacion">
                  Condiciones Contratación
                </Label>
                <Input
                  id="condicionesContratacion"
                  name="condicionesContratacion"
                  value={editingProforma?.condicionesContratacion || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="estadoPago">Estado Pago</Label>
                <Input
                  id="estadoPago"
                  name="estadoPago"
                  value={editingProforma?.estadoPago || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="fecha">Fecha y Hora</Label>
                <Input
                  id="fecha"
                  name="fecha"
                  type="datetime-local"
                  value={
                    editingProforma?.fecha
                      ? formatFecha(editingProforma.fecha)
                      : ''
                  }
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Guardar Cambios</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Diálogo para eliminar proforma */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Eliminación</DialogTitle>
            </DialogHeader>
            {errorDialog && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errorDialog}</AlertDescription>
              </Alert>
            )}
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar la siguiente proforma? Esta
              acción no puede deshacerse.
            </DialogDescription>
            {proformaToDelete && (
              <div className="space-y-2 mt-4">
                <p>
                  <strong>ID:</strong> {proformaToDelete.id}
                </p>
                <p>
                  <strong>Código Orden Trabajo:</strong>{' '}
                  {proformaToDelete.codigo_ordentrabajo}
                </p>
                <p>
                  <strong>Detalle Servicio:</strong>{' '}
                  {proformaToDelete.detalleServicio}
                </p>
                <p>
                  <strong>Precio Servicio:</strong>{' '}
                  {proformaToDelete.precioServicio}
                </p>
                <p>
                  <strong>Tiempo Estimado Entrega:</strong>{' '}
                  {proformaToDelete.tiempoEstimadoEntrega}
                </p>
                <p>
                  <strong>Condiciones Contratación:</strong>{' '}
                  {proformaToDelete.condicionesContratacion}
                </p>
                <p>
                  <strong>Estado Pago:</strong> {proformaToDelete.estadoPago}
                </p>
                <p>
                  <strong>Fecha:</strong>{' '}
                  {formatFechaDisplay(proformaToDelete.fecha)}
                </p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteProforma}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
