import { useState } from 'react';
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
  DialogTrigger,
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

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      username: 'juan123',
      fullName: 'Juan Pérez',
      email: 'juan@example.com',
      role: 'Usuario',
    },
    {
      id: 2,
      username: 'maria456',
      fullName: 'María García',
      email: 'maria@example.com',
      role: 'Administrador',
    },
    {
      id: 3,
      username: 'carlos789',
      fullName: 'Carlos Rodríguez',
      email: 'carlos@example.com',
      role: 'Editor',
    },
  ]);

  const [editingUser, setEditingUser] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingUser) {
      setEditingUser({ ...editingUser, [name]: value });
    }
  };

  const handleRoleChange = (value) => {
    if (editingUser) {
      setEditingUser({ ...editingUser, role: value });
    }
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const id = usuarios.length + 1;
    setUsuarios([...usuarios, { id, ...editingUser }]);
    setEditingUser(null);
    setIsAddOpen(false);
  };

  const handleEditUser = (e) => {
    e.preventDefault();
    setUsuarios(
      usuarios.map((user) => (user.id === editingUser.id ? editingUser : user))
    );
    setEditingUser(null);
    setIsEditOpen(false);
  };

  const handleDeleteUser = () => {
    setUsuarios(usuarios.filter((user) => user.id !== userToDelete.id));
    setUserToDelete(null);
    setIsDeleteOpen(false);
  };

  const openAddDialog = () => {
    setEditingUser({ username: '', fullName: '', email: '', role: '' });
    setIsAddOpen(true);
  };

  const openEditDialog = (user) => {
    setEditingUser({ ...user });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (user) => {
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
          {usuarios.map((usuario) => (
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
                  <SelectItem value="Usuario">Usuario</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Administrador">Administrador</SelectItem>
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
                  <SelectItem value="Usuario">Usuario</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Administrador">Administrador</SelectItem>
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
