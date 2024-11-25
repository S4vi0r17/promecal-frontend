import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { Toaster } from '@/components/ui/toaster';
import { roleRouteMap } from '@/constants/roleRouteMap';

interface Route {
  path: string;
  name: string;
}

const Dash = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [allowedRoutes, setAllowedRoutes] = useState<Route[]>([]);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole) {
      const allowPaths = roleRouteMap[userRole]?.map((route) => route.path) || [];
      const routes = ROUTES.filter((route) => allowPaths.includes(route.path));
      setAllowedRoutes(routes);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  if (!allowedRoutes.length) {
    return <div>Cargando rutas...</div>; // Muestra un indicador de carga mientras no hay rutas
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar para pantallas medianas y grandes */}
      <div className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2 hidden sm:block">
        {/* Logo o título de la aplicación */}
        <h1 className="text-3xl font-bold text-center">SGRPP</h1>
        {/* Navegación */}
        <nav>
          {allowedRoutes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
            >
              {route.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="mt-4 w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </nav>
      </div>

      {/* Menú superior para dispositivos móviles */}
      <div className="bg-gray-800 text-white w-full sm:hidden">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold">Mi Aplicación</h1>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
        {isMenuOpen && (
          <nav className="px-2 pb-4">
            <Link
              to="/home/1"
              className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
            >
              Página 1
            </Link>
            <Link
              to="/home/2"
              className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
            >
              Página 2
            </Link>
            <button
              onClick={handleLogout}
              className="mt-4 w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-red-700"
            >
              Cerrar sesión
            </button>
          </nav>
        )}
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-10">
        <Outlet />
        <Toaster />
      </div>
    </div>
  );
};

export default Dash;
