import { roleRouteMap } from '@/constants/roleRouteMap';
import { ROUTES } from '@/constants/routes';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface Route {
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  name: string;
}
const OldSidebar = () => {
  const navigate = useNavigate();
  const [allowedRoutes, setAllowedRoutes] = useState<Route[]>([]);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');

    if (userRole) {
      const allowPaths =
        roleRouteMap[userRole]?.map((route) => route.path) || [];
      const routes = ROUTES.filter((route) =>
        allowPaths.includes(route.path)
      ).map((route) => ({
        ...route,
        icon: roleRouteMap[userRole].find((r) => r.path === route.path)?.icon,
      })) as Route[];
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
  return (
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
  );
};

export default OldSidebar;
