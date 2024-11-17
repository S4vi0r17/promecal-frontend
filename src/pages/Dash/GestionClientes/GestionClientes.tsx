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

import api from '../../../services/api';
import { ClienteResponse } from '../../../interfaces/cliente.interface';
import { Edit, Trash2 } from 'lucide-react';

export default function GestionClientes() {
  const [clientes, setClientes] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingClient) {
      setEditingClient({ ...editingClient, [name]: value });
    }
  };

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await api.get('/api/clientes');
        const clientesMapeados = response.data.map((cliente: ClienteResponse) => ({
          id: cliente.id,
          dni: cliente.dni,
          celular: cliente.celular,
          direccion: cliente.direccion,
          fullName: cliente.nombrecompleto,
        }));
        setClientes(clientesMapeados);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los clientes');
        setLoading(false);
        console.error('Error:', err);
      }
    };

    fetchClientes();
  }, []);

  // Agregar un estado de carga
  if (loading) {
    return <div>Cargando clientes...</div>;
  }

  // Mostrar error si existe
  if (error) {
    return <div>Error: {error}</div>;
  }

  interface Client {
    id: number;
    dni: string;
    celular: string;
    direccion: string;
    fullName: string;
  }

  const handleAddClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const clientData = {
        dni: editingClient?.dni,
        celular: editingClient?.celular,
        direccion: editingClient?.direccion,
        nombrecompleto: editingClient?.fullName,
      };

      await api.post('/api/clientes', clientData);

      const newClient = {
        id: clientes.length + 1,
        dni: editingClient?.dni || '',
        celular: editingClient?.celular || '',
        direccion: editingClient?.direccion || '',
        fullName: editingClient?.fullName || '',
      };

      setClientes([...clientes, newClient]);
      setIsAddOpen(false);
      setEditingClient(null);
    } catch (err) {
      console.error('Error al agregar cliente:', err);
    }
  };

  const handleEditClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const clientData = {
        dni: editingClient?.dni,
        celular: editingClient?.celular,
        direccion: editingClient?.direccion,
        nombrecompleto: editingClient?.fullName,
      };

      if (editingClient) {
        await api.put(`/api/clientes/${editingClient.id}`, clientData);
      }
      if (editingClient) {
        setClientes(
          clientes.map((client) =>
            client.id === editingClient.id ? editingClient : client
          )
        );
      }
      setIsEditOpen(false);
      setEditingClient(null);
    } catch (err) {
      console.error('Error al editar cliente:', err);
    }
  };

  const handleDeleteClient = async () => {
    if (!clientToDelete) return;

    try {
      await api.delete(`/api/clientes/${clientToDelete.id}`);
      setClientes(clientes.filter((client) => client.id !== clientToDelete.id));
      setIsDeleteOpen(false);
      setClientToDelete(null);
    } catch (err) {
      console.error('Error al eliminar cliente:', err);
    }
  };

  const openAddDialog = () => {
    setEditingClient({ id: 0, dni: '', celular: '', direccion: '', fullName: '' });
    setIsAddOpen(true);
  };

  const openEditDialog = (client: Client) => {
    setEditingClient({ ...client });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (client: Client) => {
    setClientToDelete(client);
    setIsDeleteOpen(true);
  };

  return (
    <div
      className="min-h-screen"
    >
      <div className="w-full max-w-[1200px] bg-gray bg-opacity-80 rounded-lg p-5 shadow-lg mx-4">
        <h1 className="text-center text-2xl font-bold text-gray-800">
          Gestión de Clientes
        </h1>
        <button
          onClick={openAddDialog}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md mt-4 block mx-auto"
        >
          Agregar Cliente
        </button>
        <div className="overflow-x-auto mt-6">
          <table className="w-full border-collapse client-table">
            <thead>
              <tr className="bg-gray-200 text-gray-800">
                <th className="border py-2 px-4">ID</th>
                <th className="border py-2 px-4">Nombre Completo</th>
                <th className="border py-2 px-4">DNI</th>
                <th className="border py-2 px-4">Celular</th>
                <th className="border py-2 px-4">Dirección</th>
                <th className="border py-2 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente: Client, index) => (
                <tr
                  key={cliente.id}
                  className={`${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                  } hover:bg-gray-200`}
                >
                  <td className="border py-2 px-4 text-center">{cliente.id}</td>
                  <td className="border py-2 px-4 text-center">
                    {cliente.fullName}
                  </td>
                  <td className="border py-2 px-4 text-center">
                    {cliente.dni}
                  </td>
                  <td className="border py-2 px-4 text-center">
                    {cliente.celular}
                  </td>
                  <td className="border py-2 px-4 text-center">
                    {cliente.direccion}
                  </td>
                  <td className="border py-2 px-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => openEditDialog(cliente)}
                        className="bg-blue-900 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-md"
                      >
                        Modificar
                      </button>
                      <button
                        onClick={() => openDeleteDialog(cliente)}
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

        {/* Diálogo para agregar cliente */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <Label htmlFor="dni">DNI</Label>
                <Input
                  id="dni"
                  name="dni"
                  value={editingClient?.dni || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="fullName">Nombre Completo</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={editingClient?.fullName || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="celular">Celular</Label>
                <Input
                  id="celular"
                  name="celular"
                  value={editingClient?.celular || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  name="direccion"
                  value={editingClient?.direccion || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Guardar Cliente
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Diálogo para editar cliente */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modificar Cliente</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditClient} className="space-y-4">
              <div>
                <Label htmlFor="dni">DNI</Label>
                <Input
                  id="dni"
                  name="dni"
                  value={editingClient?.dni || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="fullName">Nombre Completo</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={editingClient?.fullName || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="celular">Celular</Label>
                <Input
                  id="celular"
                  name="celular"
                  value={editingClient?.celular || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  name="direccion"
                  value={editingClient?.direccion || ''}
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

        {/* Diálogo para eliminar cliente */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Eliminación</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar al siguiente cliente? Esta
              acción no puede deshacerse.
            </DialogDescription>
            {clientToDelete && (
              <div className="space-y-2 mt-4">
                <p>
                  <strong>ID:</strong> {clientToDelete.id}
                </p>
                <p>
                  <strong>Nombre Completo:</strong> {clientToDelete.fullName}
                </p>
                <p>
                  <strong>DNI:</strong> {clientToDelete.dni}
                </p>
                <p>
                  <strong>Celular:</strong> {clientToDelete.celular}
                </p>
                <p>
                  <strong>Dirección:</strong> {clientToDelete.direccion}
                </p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteClient}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}