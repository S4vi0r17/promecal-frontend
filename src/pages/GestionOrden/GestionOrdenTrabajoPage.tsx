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
import axios from 'axios';


export default function GestionOrdenTrabajoPage() {
  const [ordenes, setOrdenes] = useState<OrdenDeTrabajo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  const [editingOrder, setEditingOrder] = useState<OrdenDeTrabajo | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<OrdenDeTrabajo | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  interface OrdenDeTrabajo {
    id: number;
    dni: string;
    codigo: string;
    fecha: string;
    descripcion: string;
    modelo: string;
    marca: string;
    rajaduras: boolean;
    manchas: boolean;
    golpes: boolean;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingOrder) {
      setEditingOrder({ ...editingOrder, [name]: value });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (editingOrder) {
      setEditingOrder({ ...editingOrder, [name]: checked });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const response = await api.get('/api/ordentrabajo');
        const ordenesMapeadas = response.data.map((orden: any) => ({
          id: orden.id,
          dni: orden.dni,
          codigo: orden.codigo,
          fecha: orden.fecha,
          descripcion: orden.descripcion,
          modelo: orden.modelo,
          marca: orden.marca,
          rajaduras: orden.rajaduras,
          manchas: orden.manchas,
          golpes: orden.golpes,
        }));
        setOrdenes(ordenesMapeadas);
      } catch (err) {
        console.log(err);
        setError('Error al cargar las órdenes de trabajo');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdenes();
  }, []);

  // Agregar un estado de carga
  if (loading) {
    return <div>Cargando órdenes de trabajo...</div>;
  }

  // Mostrar error si existe
  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleAddOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const orderData = {
        dni: editingOrder?.dni,
        codigo: editingOrder?.codigo,
        fecha: editingOrder?.fecha,
        descripcion: editingOrder?.descripcion,
        modelo: editingOrder?.modelo,
        marca: editingOrder?.marca,
        rajaduras: editingOrder?.rajaduras,
        manchas: editingOrder?.manchas,
        golpes: editingOrder?.golpes,
      };

      const formData = new FormData();
      formData.append('orden', new Blob([JSON.stringify(orderData)], { type: 'application/json' }));
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      await api.post('/api/ordentrabajo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Actualizar la lista de órdenes
      const response = await api.get('/api/ordentrabajo');
      console.log(response);
      setOrdenes(response.data);

      setIsAddOpen(false);
      setEditingOrder(null);
      setSelectedFile(null);
    } catch (err) {
      if(axios.isAxiosError(err)) {
        console.error('Error al agregar la orden de trabajo:', err.response?.data);
      }
    }
  };

  const handleEditOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const orderData = {
        dni: editingOrder?.dni,
        codigo: editingOrder?.codigo,
        fecha: editingOrder?.fecha,
        descripcion: editingOrder?.descripcion,
        modelo: editingOrder?.modelo,
        marca: editingOrder?.marca,
        rajaduras: editingOrder?.rajaduras,
        manchas: editingOrder?.manchas,
        golpes: editingOrder?.golpes,
      };

      const formData = new FormData();
      formData.append('orden', new Blob([JSON.stringify(orderData)], { type: 'application/json' }));
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      if (editingOrder) {
        await api.put(`/api/ordentrabajo/${editingOrder.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Actualizar la lista de órdenes
        const response = await api.get('/api/ordentrabajo');
        setOrdenes(response.data);
      }
      setIsEditOpen(false);
      setEditingOrder(null);
      setSelectedFile(null);
    } catch (err) {
      console.error('Error al editar la orden de trabajo:', err);
    }
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      await api.delete(`/api/ordentrabajo/${orderToDelete.id}`);
      setOrdenes(ordenes.filter((orden) => orden.id !== orderToDelete.id));
      setIsDeleteOpen(false);
      setOrderToDelete(null);
    } catch (err) {
      console.error('Error al eliminar la orden de trabajo:', err);
    }
  };

  const openAddDialog = () => {
    setEditingOrder({
      id: 0,
      dni: '',
      codigo: '',
      fecha: '',
      descripcion: '',
      modelo: '',
      marca: '',
      rajaduras: false,
      manchas: false,
      golpes: false,
    });
    setSelectedFile(null);
    setIsAddOpen(true);
  };

  const openEditDialog = (orden: OrdenDeTrabajo) => {
    setEditingOrder({ ...orden });
    setSelectedFile(null);
    setIsEditOpen(true);
  };

  const openDeleteDialog = (orden: OrdenDeTrabajo) => {
    setOrderToDelete(orden);
    setIsDeleteOpen(true);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-gray-100"
      
    >
      <div className="container bg-white bg-opacity-90 rounded-lg max-w-[1200px] mx-auto p-5 shadow-lg">
        <h1 className="text-center text-2xl font-bold text-gray-800">
          Gestión de Órdenes de Trabajo
        </h1>
        <button
          onClick={openAddDialog}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md mt-4 block mx-auto"
        >
          Agregar Orden de Trabajo
        </button>
        <div className="overflow-x-auto mt-6">
          <table className="w-full border-collapse user-table">
            <thead>
              <tr className="bg-gray-200 text-gray-800">
                <th className="border py-2 px-4">ID</th>
                <th className="border py-2 px-4">DNI del Cliente</th>
                <th className="border py-2 px-4">Código</th>
                <th className="border py-2 px-4">Fecha</th>
                <th className="border py-2 px-4">Descripción</th>
                <th className="border py-2 px-4">Modelo</th>
                <th className="border py-2 px-4">Marca</th>
                <th className="border py-2 px-4">Rajaduras</th>
                <th className="border py-2 px-4">Manchas</th>
                <th className="border py-2 px-4">Golpes</th>
                <th className="border py-2 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden: OrdenDeTrabajo, index) => (
                <tr
                  key={orden.id}
                  className={`${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                  } hover:bg-gray-200`}
                >
                  <td className="border py-2 px-4 text-center">{orden.id}</td>
                  <td className="border py-2 px-4 text-center">{orden.dni}</td>
                  <td className="border py-2 px-4 text-center">{orden.codigo}</td>
                  <td className="border py-2 px-4 text-center">{orden.fecha}</td>
                  <td className="border py-2 px-4 text-center">{orden.descripcion}</td>
                  <td className="border py-2 px-4 text-center">{orden.modelo}</td>
                  <td className="border py-2 px-4 text-center">{orden.marca}</td>
                  <td className="border py-2 px-4 text-center">
                    {orden.rajaduras ? 'Sí' : 'No'}
                  </td>
                  <td className="border py-2 px-4 text-center">
                    {orden.manchas ? 'Sí' : 'No'}
                  </td>
                  <td className="border py-2 px-4 text-center">
                    {orden.golpes ? 'Sí' : 'No'}
                  </td>
                  <td className="border py-2 px-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => openEditDialog(orden)}
                        className="bg-blue-900 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-md"
                      >
                        Modificar
                      </button>
                      <button
                        onClick={() => openDeleteDialog(orden)}
                        className="bg-red-700 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md"
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

        {/* Diálogo para agregar orden de trabajo */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nueva Orden de Trabajo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddOrder} className="space-y-4">
              <div>
                <Label htmlFor="dni">DNI del Cliente</Label>
                <Input
                  id="dni"
                  name="dni"
                  value={editingOrder?.dni || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  id="fecha"
                  name="fecha"
                  type="datetime-local"
                  value={editingOrder?.fecha || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Input
                  id="descripcion"
                  name="descripcion"
                  value={editingOrder?.descripcion || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="modelo">Modelo</Label>
                <Input
                  id="modelo"
                  name="modelo"
                  value={editingOrder?.modelo || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="marca">Marca</Label>
                <Input
                  id="marca"
                  name="marca"
                  value={editingOrder?.marca || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label>Rajaduras</Label>
                <input
                  type="checkbox"
                  name="rajaduras"
                  checked={editingOrder?.rajaduras || false}
                  onChange={handleCheckboxChange}
                />
              </div>
              <div>
                <Label>Manchas</Label>
                <input
                  type="checkbox"
                  name="manchas"
                  checked={editingOrder?.manchas || false}
                  onChange={handleCheckboxChange}
                />
              </div>
              <div>
                <Label>Golpes</Label>
                <input
                  type="checkbox"
                  name="golpes"
                  checked={editingOrder?.golpes || false}
                  onChange={handleCheckboxChange}
                />
              </div>
              <div>
                <Label htmlFor="file">Archivo (PDF)</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Guardar Orden
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Diálogo para editar orden de trabajo */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modificar Orden de Trabajo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditOrder} className="space-y-4">
              <div>
                <Label htmlFor="dni">DNI del Cliente</Label>
                <Input
                  id="dni"
                  name="dni"
                  value={editingOrder?.dni || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  id="fecha"
                  name="fecha"
                  type="datetime-local"
                  value={editingOrder?.fecha || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Input
                  id="descripcion"
                  name="descripcion"
                  value={editingOrder?.descripcion || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="modelo">Modelo</Label>
                <Input
                  id="modelo"
                  name="modelo"
                  value={editingOrder?.modelo || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="marca">Marca</Label>
                <Input
                  id="marca"
                  name="marca"
                  value={editingOrder?.marca || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label>Rajaduras</Label>
                <input
                  type="checkbox"
                  name="rajaduras"
                  checked={editingOrder?.rajaduras || false}
                  onChange={handleCheckboxChange}
                />
              </div>
              <div>
                <Label>Manchas</Label>
                <input
                  type="checkbox"
                  name="manchas"
                  checked={editingOrder?.manchas || false}
                  onChange={handleCheckboxChange}
                />
              </div>
              <div>
                <Label>Golpes</Label>
                <input
                  type="checkbox"
                  name="golpes"
                  checked={editingOrder?.golpes || false}
                  onChange={handleCheckboxChange}
                />
              </div>
              <div>
                <Label htmlFor="file">Archivo (PDF)</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
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

        {/* Diálogo para eliminar orden de trabajo */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Eliminación</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar la siguiente orden de trabajo? Esta acción no puede deshacerse.
            </DialogDescription>
            {orderToDelete && (
              <div className="space-y-2 mt-4">
                <p>
                  <strong>ID:</strong> {orderToDelete.id}
                </p>
                <p>
                  <strong>DNI del Cliente:</strong> {orderToDelete.dni}
                </p>
                <p>
                  <strong>Código:</strong> {orderToDelete.codigo}
                </p>
                <p>
                  <strong>Descripción:</strong> {orderToDelete.descripcion}
                </p>
                <p>
                  <strong>Modelo:</strong> {orderToDelete.modelo}
                </p>
                <p>
                  <strong>Marca:</strong> {orderToDelete.marca}
                </p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteOrder}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
