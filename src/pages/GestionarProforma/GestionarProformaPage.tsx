import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '../../services/api';

export default function GestionProformasPage() {
  interface Proforma {
    id: number;
    codigo_ordentrabajo: string;
    detalleServicio: string;
    precioServicio: number;
    tiempoEstimadoEntrega: string;
    condicionesContratacion: string;
    estadoPago: string;
    fecha: string; // Fecha con formato ISO incluyendo hora
  }

  const [proformas, setProformas] = useState<Proforma[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  const [editingProforma, setEditingProforma] = useState<Proforma | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [proformaToDelete, setProformaToDelete] = useState<Proforma | null>(
    null
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingProforma) {
      setEditingProforma({
        ...editingProforma,
        [name]: name === 'precioServicio' ? parseFloat(value) : value,
      });
    }
  };

  useEffect(() => {
    const fetchProformas = async () => {
      try {
        const response = await api.get('/api/proformaservicio');
        const proformasData = response.data.map((proforma: Proforma) => ({
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

    fetchProformas();
  }, []);

  if (loading) {
    return <div>Cargando proformas...</div>;
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

      const response = await api.post('/api/proformaservicio', proformaData);

      const newProforma = {
        id: response.data.id,
        ...proformaData,
      };

      setProformas([...proformas, newProforma]);
      setIsAddOpen(false);
      setEditingProforma(null);
    } catch (err) {
      console.error('Error al agregar proforma:', err);
    }
  };

  const handleEditProforma = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProforma) return;
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

      await api.put(
        `/api/proformaservicio/${editingProforma.id}`,
        proformaData
      );

      setProformas(
        proformas.map((proforma) =>
          proforma.id === editingProforma.id ? editingProforma : proforma
        )
      );
      setIsEditOpen(false);
      setEditingProforma(null);
    } catch (err) {
      console.error('Error al editar proforma:', err);
    }
  };

  const handleDeleteProforma = async () => {
    if (!proformaToDelete) return;
    try {
      await api.delete(`/api/proformaservicio/${proformaToDelete.id}`);
      setProformas(
        proformas.filter((proforma) => proforma.id !== proformaToDelete.id)
      );
      setIsDeleteOpen(false);
      setProformaToDelete(null);
    } catch (err) {
      console.error('Error al eliminar proforma:', err);
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

  const openEditDialog = (proforma: Proforma) => {
    setEditingProforma({ ...proforma });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (proforma: Proforma) => {
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
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('https://imgur.com/Jil1d2S.jpg')",
      }}
    >
      <div className="container bg-white bg-opacity-90 rounded-lg max-w-[1200px] mx-auto p-5 shadow-lg">
        <h1 className="text-center text-2xl font-bold text-gray-800">
          Gestión de Proformas
        </h1>
        <button
          onClick={openAddDialog}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md mt-4 block mx-auto"
        >
          Agregar Proforma
        </button>
        <div className="overflow-x-auto mt-6">
          <table className="w-full border-collapse user-table">
            <thead>
              <tr className="bg-gray-200 text-gray-800">
                <th className="border py-2 px-4">ID</th>
                <th className="border py-2 px-4">Código Orden Trabajo</th>
                <th className="border py-2 px-4">Detalle Servicio</th>
                <th className="border py-2 px-4">Precio Servicio</th>
                <th className="border py-2 px-4">Tiempo Estimado Entrega</th>
                <th className="border py-2 px-4">Condiciones Contratación</th>
                <th className="border py-2 px-4">Estado Pago</th>
                <th className="border py-2 px-4">Fecha</th>
                <th className="border py-2 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {proformas.map((proforma: Proforma, index) => (
                <tr
                  key={proforma.id}
                  className={`${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                  } hover:bg-gray-200`}
                >
                  <td className="border py-2 px-4 text-center">
                    {proforma.id}
                  </td>
                  <td className="border py-2 px-4 text-center">
                    {proforma.codigo_ordentrabajo}
                  </td>
                  <td className="border py-2 px-4 text-center">
                    {proforma.detalleServicio}
                  </td>
                  <td className="border py-2 px-4 text-center">
                    {proforma.precioServicio}
                  </td>
                  <td className="border py-2 px-4 text-center">
                    {proforma.tiempoEstimadoEntrega}
                  </td>
                  <td className="border py-2 px-4 text-center">
                    {proforma.condicionesContratacion}
                  </td>
                  <td className="border py-2 px-4 text-center">
                    {proforma.estadoPago}
                  </td>
                  <td className="border py-2 px-4 text-center">
                    {formatFechaDisplay(proforma.fecha)}
                  </td>
                  <td className="border py-2 px-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => openEditDialog(proforma)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-md"
                      >
                        Modificar
                      </button>
                      <button
                        onClick={() => openDeleteDialog(proforma)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Diálogo para agregar proforma */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nueva Proforma</DialogTitle>
            </DialogHeader>
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
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Guardar Proforma
                </Button>
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
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Guardar Cambios
                </Button>
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
