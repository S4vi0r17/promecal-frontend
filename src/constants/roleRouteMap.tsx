import { ROLES } from '@/constants/roles';
import GestionUsuariosPage from '../pages/GestionUsuarios/GestionUsuariosPage';
import GestionClientesPage from '@/pages/GestionClientes/GestionClientesPage';
import GestionarProformaPage from '@/pages/GestionarProforma/GestionarProformaPage';
import GestionOrdenTrabajoPage from '@/pages/GestionOrden/GestionOrdenTrabajoPage';
import OrdenesTrabajoPage from '@/pages/OrdenTrabajo/OrdenesTrabajoPage.tsx';
import InformeDiagnosticoPage from '@/pages/InformeDiagnostico/InformeDiagnosticoPage';
import RegistrarPago from '@/pages/RegistrarPago/RegistrarPagoPage';
import { ClipboardList, CreditCard, FileCheck, FileSignature, FileText, UserCog, Users } from 'lucide-react';

export const roleRouteMap = {
  [ROLES.ADMINISTRADOR]: [{ label: 'Administrador', icon: UserCog, path: '/home/admin', element: <GestionUsuariosPage /> }],
  [ROLES.EJECUTIVO_VENTAS]: [
    { label: 'Gestionar Clientes', icon: Users, path: '/home/gestionar-clientes', element: <GestionClientesPage /> },
    { label: 'Gestionar Proforma', icon: FileCheck, path: '/home/gestionar-proforma', element: <GestionarProformaPage /> },
    { label: 'Registrar Pago', icon: CreditCard ,path: '/home/registrar-pago', element: <RegistrarPago /> },
  ],
  [ROLES.ASISTENTE_RECEPCION]: [
    { label: 'Gestionar Orden', icon: FileText, path: '/home/gestionar-orden', element: <GestionOrdenTrabajoPage /> },
  ],
  [ROLES.ASISTENTE_TECNICO]: [
    { label: 'Visualizar Orden', icon: ClipboardList, path: '/home/visualizar-orden', element: <OrdenesTrabajoPage /> },
    { label: 'Informe de Diagnóstico', icon: FileSignature, path: '/home/informe-diagnostico', element: <InformeDiagnosticoPage /> },
  ],
};
