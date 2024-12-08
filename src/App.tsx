import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { getUserRole } from '@/helpers/auth';
import { roleRouteMap } from './constants/roleRouteMap';

import ProtectedRoute from '@/pages/ProtectedRoute';
import LoginPage from '@/pages/LoginPage/LoginPage.tsx';
import MainLayout from '@/layouts/MainLayout.tsx';

import GestionUsuariosPage from './pages/GestionUsuarios/GestionUsuariosPage';
import GestionClientesPage from './pages/GestionClientes/GestionClientesPage';
import OrdenesTrabajoPage from './pages/OrdenTrabajo/OrdenesTrabajoPage';
import GestionOrdenTrabajoPage from './pages/GestionOrden/GestionOrdenTrabajoPage';
import InformeDiagnosticoPage from './pages/InformeDiagnostico/InformeDiagnosticoPage';
import RegistrarPagoPage from './pages/RegistrarPago/RegistrarPagoPage';
import GestionarProformaPage from './pages/GestionarProforma/GestionarProformaPage';
import SinNombre from './pages/SinNombre/SinNombre';

function App() {
  // Esta webada no sirve jaaa 🦎
  const [, setAllowedRoutes] = useState<
    { path: string; element: JSX.Element }[]
  >([]);

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
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <SinNombre />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin"
            element={
              <ProtectedRoute>
                <GestionUsuariosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="gestionar-clientes"
            element={
              <ProtectedRoute>
                <GestionClientesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="visualizar-orden"
            element={
              <ProtectedRoute>
                <OrdenesTrabajoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="gestionar-orden"
            element={
              <ProtectedRoute>
                <GestionOrdenTrabajoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="informe-diagnostico"
            element={
              <ProtectedRoute>
                <InformeDiagnosticoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="registrar-pago"
            element={
              <ProtectedRoute>
                <RegistrarPagoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="gestionar-proforma"
            element={
              <ProtectedRoute>
                <GestionarProformaPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
