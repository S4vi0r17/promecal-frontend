import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
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
import api from '../../../services/api';
import { UsuarioResponse } from '../../../interfaces/user.interface';

export default function GestionUsuarios() {
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

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get('/api/usuarios');
        const usuariosMapeados = response.data.map(
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

    fetchUsuarios();
  }, []);

  // Agregar un estado de carga
  if (loading) {
    return <div>Cargando usuarios...</div>;
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
        rol: `ROLE_${editingUser?.role}`, // El rol ya viene en el formato correcto
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
        rol: `ROLE_${editingUser?.role}`, // El rol ya viene en el formato correcto
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
      await api.delete(`/api/usuarios/${userToDelete.id}`);
      // Actualizar la lista de usuarios después de eliminar
      setUsuarios(usuarios.filter((user) => user.id !== userToDelete.id));
      // Cerrar el diálogo y limpiar el estado
      setIsDeleteOpen(false);
      setUserToDelete(null);
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
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <Button onClick={openAddDialog}>Agregar Usuario</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre de Usuario</TableHead>
            <TableHead>Nombre Completo</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usuarios.map((usuario: User) => (
            <TableRow key={usuario.id}>
              <TableCell>{usuario.id}</TableCell>
              <TableCell>{usuario.username}</TableCell>
              <TableCell>{usuario.fullName}</TableCell>
              <TableCell>{usuario.email}</TableCell>
              <TableCell>{usuario.role}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openEditDialog(usuario)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Modificar</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openDeleteDialog(usuario)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Eliminar</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
            <Button type="submit">Guardar Usuario</Button>
          </form>
        </DialogContent>
      </Dialog>

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
            <Button type="submit">Guardar Cambios</Button>
          </form>
        </DialogContent>
      </Dialog>

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
            <div className="space-y-2">
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
  );
}
