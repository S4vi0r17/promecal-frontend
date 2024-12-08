import { useEffect, useState } from 'react';

import { ClienteResponse } from '@/interfaces/cliente.interface';
import {
  actualizarCliente,
  eliminarCliente,
  insertarCliente,
  obtenerTodosLosClientes,
} from '@/services/cliente.service';

import Loader from '@/components/Loader';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Edit, Trash2, UserPlus } from 'lucide-react';

export default function GestionClientesPage() {
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
        const data = await obtenerTodosLosClientes();
        const clientesMapeados = data.map((cliente: ClienteResponse) => ({
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
    return <Loader />;
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
      const clienTableCellata = {
        dni: editingClient?.dni || '',
        celular: editingClient?.celular || '',
        direccion: editingClient?.direccion || '',
        nombrecompleto: editingClient?.fullName || '',
      };

      await insertarCliente(clienTableCellata);

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
      const clienTableCellata = {
        dni: editingClient?.dni || '',
        celular: editingClient?.celular || '',
        direccion: editingClient?.direccion || '',
        nombrecompleto: editingClient?.fullName || '',
      };

      if (editingClient) {
        await actualizarCliente(editingClient.id, clienTableCellata);
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
      await eliminarCliente(clientToDelete.id);
      setClientes(clientes.filter((client) => client.id !== clientToDelete.id));
      setIsDeleteOpen(false);
      setClientToDelete(null);
    } catch (err) {
      console.error('Error al eliminar cliente:', err);
    }
  };

  const openAddDialog = () => {
    setEditingClient({
      id: 0,
      dni: '',
      celular: '',
      direccion: '',
      fullName: '',
    });
    setIsAddOpen(true);
  };

  const openEdiTableCellialog = (client: Client) => {
    setEditingClient({ ...client });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (client: Client) => {
    setClientToDelete(client);
    setIsDeleteOpen(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-[1200px]">
        <div className="flex justify-between items-center">
          <h1 className="text-center text-2xl font-bold text-gray-800">
            Gestión de Clientes
          </h1>
          <Button onClick={openAddDialog} variant={'default'}>
            <UserPlus className="w-4 h-4 mr-2" />
            Agregar Cliente
          </Button>
        </div>
        <div className="overflow-x-auto mt-6">
          <Table className="w-full border-collapse client-table">
            <TableHeader>
              <TableRow className="text-gray-800">
                <TableHead className="text-center">ID</TableHead>
                <TableHead className="text-center">Nombre Completo</TableHead>
                <TableHead className="text-center">DNI</TableHead>
                <TableHead className="text-center">Celular</TableHead>
                <TableHead className="text-center">Dirección</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientes.map((cliente: Client) => (
                <TableRow key={cliente.id}>
                  <TableCell className="text-center py-2 px-4">{cliente.id}</TableCell>
                  <TableCell className="text-center py-2 px-4">
                    {cliente.fullName}
                  </TableCell>
                  <TableCell className="text-center py-2 px-4">{cliente.dni}</TableCell>
                  <TableCell className="text-center py-2 px-4">
                    {cliente.celular}
                  </TableCell>
                  <TableCell className="text-center py-2 px-4">
                    {cliente.direccion}
                  </TableCell>
                  <TableCell className="text-center py-2 px-4">
                    <div className="flex justify-center items-center space-x-2">
                      <Button
                        onClick={() => openEdiTableCellialog(cliente)}
                        className="font-bold py-1 px-3 rounded-md"
                        variant={'outline'}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Modificar
                      </Button>
                      <Button
                        variant={'destructive'}
                        onClick={() => openDeleteDialog(cliente)}
                        className="text-white font-bold py-1 px-3 rounded-md"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
                <Button type="submit">Guardar Cliente</Button>
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
                <Button type="submit">Guardar Cambios</Button>
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
