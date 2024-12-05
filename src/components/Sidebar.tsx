import { useEffect, useState } from 'react';
import { ChevronRight, ChevronLeft, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { roleRouteMap } from '@/constants/roleRouteMap';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

interface Route {
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  name: string;
}

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
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
    <div
      className={cn(
        'flex h-screen flex-col justify-between border-r bg-gray-100 transition-all duration-300',
        isExpanded ? 'w-64' : 'w-16'
      )}
    >
      <div className="flex flex-col space-y-2 p-3">
        <Button
          variant="ghost"
          size="icon"
          className={cn('self-end mb-4', isExpanded && 'self-start')}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Contraer sidebar' : 'Expandir sidebar'}
        >
          {isExpanded ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </Button>
        {allowedRoutes.map(({ icon: Icon, name, path }) => (
          <TooltipProvider key={name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size={isExpanded ? 'default' : 'icon'}
                  className={cn(
                    isExpanded
                      ? 'justify-start w-full'
                      : 'justify-center w-10 h-10 mx-auto'
                  )}
                  onClick={() => navigate(path)}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {isExpanded && <span className="ml-2">{name}</span>}
                  {!isExpanded && <span className="sr-only">{name}</span>}
                </Button>
              </TooltipTrigger>
              {!isExpanded && (
                <TooltipContent side="right">
                  <p>{name}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      <div className="p-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size={isExpanded ? 'default' : 'icon'}
                className={cn(
                  isExpanded
                    ? 'justify-start w-full'
                    : 'justify-center w-10 h-10 mx-auto'
                )}
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                {isExpanded && <span className="ml-2">Cerrar sesión</span>}
                {!isExpanded && <span className="sr-only">Cerrar sesión</span>}
              </Button>
            </TooltipTrigger>
            {!isExpanded && (
              <TooltipContent side="right">
                <p>Cerrar sesión</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
