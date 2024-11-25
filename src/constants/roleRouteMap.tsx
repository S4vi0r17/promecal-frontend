import { ROLES } from '@/constants/roles';
import GestionUsuariosPage from '../pages/GestionUsuarios/GestionUsuariosPage';
import GestionClientesPage from '@/pages/GestionClientes/GestionClientesPage';
import GestionarProformaPage from '@/pages/GestionarProforma/GestionarProformaPage';
import GestionOrdenTrabajoPage from '@/pages/GestionOrden/GestionOrdenTrabajoPage';
import OrdenesTrabajoPage from '@/pages/OrdenTrabajo/OrdenesTrabajoPage.tsx';
import InformeDiagnosticoPage from '@/pages/InformeDiagnostico/InformeDiagnosticoPage';

export const roleRouteMap = {
  [ROLES.ADMINISTRADOR]: [{ path: '/home/admin', element: <GestionUsuariosPage /> }],
  [ROLES.EJECUTIVO_VENTAS]: [
    { path: '/home/gestionar-clientes', element: <GestionClientesPage /> },
    { path: '/home/gestionar-proforma', element: <GestionarProformaPage /> },
  ],
  [ROLES.ASISTENTE_RECEPCION]: [
    { path: '/home/gestionar-orden', element: <GestionOrdenTrabajoPage /> },
  ],
  [ROLES.ASISTENTE_TECNICO]: [
    { path: '/home/visualizar-orden', element: <OrdenesTrabajoPage /> },
    { path: '/home/informe-diagnostico', element: <InformeDiagnosticoPage /> },
  ],
};
