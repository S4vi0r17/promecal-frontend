import { ROLES } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';

export const roleRouteMap = {
  [ROLES.ADMINISTRADOR]: ['/home/admin'],
  [ROLES.EJECUTIVO_VENTAS]: [
    '/home/gestionar-clientes',
    '/home/gestionar-proforma',
  ],
  [ROLES.ASISTENTE_RECEPCION]: ['/home/gestionar-orden'],
  [ROLES.ASISTENTE_TECNICO]: [
    '/home/visualizar-orden',
    '/home/informe-diagnostico',
  ],
};
