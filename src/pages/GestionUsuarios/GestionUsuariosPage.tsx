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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import api from '../../services/api';
import { UsuarioResponse } from '../../interfaces/user.interface';
// import { Edit, Trash2 } from 'lucide-react';
import Loader from '@/components/Loader';
import { eliminarUsuario, obtenerTodosLosUsuarios } from '@/services/usuario.service';

export default function GestionUsuariosPage() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (editingUser) {
      setEditingUser({ ...editingUser, [name]: value });
    }
  };

  const handleRoleChange = (value: string) => {
    if (editingUser) {
      setEditingUser({ ...editingUser, role: value });
    }
  };

  const fetchUsuarios = async () => {
    try {
      const data = await obtenerTodosLosUsuarios();
      const usuariosMapeados = data.map(
        (usuario: UsuarioResponse) => ({
          id: usuario.id,
          username: usuario.nombreusuario,
          fullName: usuario.nombrecompleto,
          email: usuario.correoelectronico,
          role: usuario.rol.replace('ROLE_', ''),
        })
      );
      setUsuarios(usuariosMapeados);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los usuarios');
      setLoading(false);
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, [usuarios]);

  // Agregar un estado de carga
  if (loading) {
    return <Loader />;
  }

  // Mostrar error si existe
  if (error) {
    return <div>Error: {error}</div>;
  }

  interface User {
    id: number;
    username: string;
    fullName: string;
    email: string;
    password?: string;
    role: string;
  }

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userData = {
        nombreusuario: editingUser?.username,
        nombrecompleto: editingUser?.fullName,
        correoelectronico: editingUser?.email,
        contrasena: editingUser?.password,
        rol: `ROLE_${editingUser?.role}`,
      };

      await api.post('/api/usuarios', userData);

      const newUser = {
        id: usuarios.length + 1,
        username: editingUser?.username || '',
        fullName: editingUser?.fullName || '',
        email: editingUser?.email || '',
        role: editingUser?.role || '',
      };

      setUsuarios([...usuarios, newUser]);
      setIsAddOpen(false);
      setEditingUser(null);
    } catch (err) {
      console.error('Error al agregar usuario:', err);
    }
  };

  const handleEditUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userData = {
        nombreusuario: editingUser?.username,
        nombrecompleto: editingUser?.fullName,
        correoelectronico: editingUser?.email,
        rol: `ROLE_${editingUser?.role}`,
      };

      if (editingUser) {
        await api.put(`/api/usuarios/${editingUser.id}`, userData);
      }
      if (editingUser) {
        setUsuarios(
          usuarios.map((user) =>
            user.id === editingUser.id ? editingUser : user
          )
        );
      }
      setIsEditOpen(false);
      setEditingUser(null);
    } catch (err) {
      console.error('Error al editar usuario:', err);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await eliminarUsuario(userToDelete.id);
      // await api.delete(`/api/usuarios/${userToDelete.id}`);
      setUsuarios(usuarios.filter((user) => user.id !== userToDelete.id));
      setIsDeleteOpen(false);
      setUserToDelete(null);
      // await fetchUsuarios();
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
    }
  };

  const openAddDialog = () => {
    setEditingUser({ id: 0, username: '', fullName: '', email: '', role: '' });
    setIsAddOpen(true);
  };

  const openEditDialog = (user: User) => {
    setEditingUser({ ...user });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setIsDeleteOpen(true);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
    >
      <div className="bg-white bg-opacity-90 rounded-lg max-w-[1200px] mx-auto p-5 shadow-lg">
        <h1 className="text-center text-2xl font-bold text-gray-800">
          Gestión de Usuarios
        </h1>
        <button
          onClick={openAddDialog}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md mt-4 block mx-auto"
        >
          Agregar Usuario
        </button>
        <div className="overflow-x-auto mt-6">
          <table className="w-full border-collapse user-table">
            <thead>
              <tr className="bg-gray-200 text-gray-800">
                <th className="border py-2 px-4">ID</th>
                <th className="border py-2 px-4">Nombre Completo</th>
                <th className="border py-2 px-4">Usuario</th>
                <th className="border py-2 px-4">Correo</th>
                <th className="border py-2 px-4">Rol</th>
                <th className="border py-2 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario: User, index) => (
                <tr
                  key={usuario.id}
                  className={`${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                  } hover:bg-gray-200`}
                >
                  <td className="border py-2 px-4 text-center">{usuario.id}</td>
                  <td className="border py-2 px-4 text-center">
                    {usuario.fullName}
                  </td>
                  <td className="border py-2 px-4 text-center">
                    {usuario.username}
                  </td>
                  <td className="border py-2 px-4 text-center">
                    {usuario.email}
                  </td>
                  <td className="border py-2 px-4 text-center">
                    {usuario.role}
                  </td>
                  <td className="border py-2 px-4 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => openEditDialog(usuario)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-md"
                      >
                        Modificar
                      </button>
                      <button
                        onClick={() => openDeleteDialog(usuario)}
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

        {/* Diálogo para agregar usuario */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <Label htmlFor="username">Nombre de Usuario</Label>
                <Input
                  id="username"
                  name="username"
                  value={editingUser?.username || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="fullName">Nombre Completo</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={editingUser?.fullName || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Correo</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={editingUser?.email || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={editingUser?.password || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Rol</Label>
                <Select
                  onValueChange={handleRoleChange}
                  value={editingUser?.role || ''}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMINISTRADOR">Administrador</SelectItem>
                    <SelectItem value="ASISTENTE_DE_RECEPCION">
                      Asistente de Recepción
                    </SelectItem>
                    <SelectItem value="ASISTENTE_TECNICO">
                      Asistente Técnico
                    </SelectItem>
                    <SelectItem value="EJECUTIVO_DE_VENTAS">
                      Ejecutivo de Ventas
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Guardar Usuario
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Diálogo para editar usuario */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modificar Usuario</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditUser} className="space-y-4">
              <div>
                <Label htmlFor="username">Nombre de Usuario</Label>
                <Input
                  id="username"
                  name="username"
                  value={editingUser?.username || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="fullName">Nombre Completo</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={editingUser?.fullName || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Correo</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={editingUser?.email || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Rol</Label>
                <Select
                  onValueChange={handleRoleChange}
                  value={editingUser?.role || ''}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMINISTRADOR">Administrador</SelectItem>
                    <SelectItem value="ASISTENTE_DE_RECEPCION">
                      Asistente de Recepción
                    </SelectItem>
                    <SelectItem value="ASISTENTE_TECNICO">
                      Asistente Técnico
                    </SelectItem>
                    <SelectItem value="EJECUTIVO_DE_VENTAS">
                      Ejecutivo de Ventas
                    </SelectItem>
                  </SelectContent>
                </Select>
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

        {/* Diálogo para eliminar usuario */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Eliminación</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar al siguiente usuario? Esta
              acción no puede deshacerse.
            </DialogDescription>
            {userToDelete && (
              <div className="space-y-2 mt-4">
                <p>
                  <strong>ID:</strong> {userToDelete.id}
                </p>
                <p>
                  <strong>Nombre de Usuario:</strong> {userToDelete.username}
                </p>
                <p>
                  <strong>Nombre Completo:</strong> {userToDelete.fullName}
                </p>
                <p>
                  <strong>Correo:</strong> {userToDelete.email}
                </p>
                <p>
                  <strong>Rol:</strong> {userToDelete.role}
                </p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteUser}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
