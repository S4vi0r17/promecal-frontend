import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from '@/pages/LoginPage/LoginPage.tsx';
import MainLayout from '@/layouts/MainLayout.tsx';
import ProtectedRoute from '@/pages/ProtectedRoute';
import { getUserRole } from '@/helpers/auth';
import { roleRouteMap } from './constants/roleRouteMap';
import { useEffect, useState } from 'react';
import GestionarProformaPage from './pages/GestionarProforma/GestionarProformaPage';
import GestionClientesPage from './pages/GestionClientes/GestionClientesPage';
import GestionOrdenTrabajoPage from './pages/GestionOrden/GestionOrdenTrabajoPage';
import GestionUsuariosPage from './pages/GestionUsuarios/GestionUsuariosPage';
import InformeDiagnosticoPage from './pages/InformeDiagnostico/InformeDiagnosticoPage';
import OrdenesTrabajoPage from './pages/OrdenTrabajo/OrdenesTrabajoPage';
import RegistrarPagoPage from './pages/RegistrarPago/RegistrarPagoPage';

function App() {

  const [allowedRoutes, setAllowedRoutes] = useState<{ path: string; element: JSX.Element; }[]>([]);

  useEffect(() => {
    const userRole = getUserRole();

    setAllowedRoutes(userRole ? roleRouteMap[userRole] : []);
  }, []);

  return (
    <Router>
      <Routes>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="admin" element={<GestionUsuariosPage />} />
          <Route path="gestionar-clientes" element={<GestionClientesPage />} />
          <Route path="visualizar-orden" element={<OrdenesTrabajoPage />} />
          <Route path="gestionar-orden" element={<GestionOrdenTrabajoPage />} />
          <Route path="informe-diagnostico" element={<InformeDiagnosticoPage />} />
          <Route path="registrar-pago" element={<RegistrarPagoPage />} />
          <Route path="gestionar-proforma" element={<GestionarProformaPage />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
