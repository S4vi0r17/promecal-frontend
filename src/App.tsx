import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import LoginPage from '@/pages/LoginPage/LoginPage.tsx';
import MainLayout from '@/layouts/MainLayout.tsx';
import GestionUsuariosPage from '@/pages/GestionUsuarios/GestionUsuariosPage';
import GestionClientesPage from '@/pages/GestionClientes/GestionClientesPage';
import GestionOrdenTrabajoPage from '@/pages/GestionOrden/GestionOrdenTrabajoPage';
import ProtectedRoute from '@/pages/ProtectedRoute';
import OrdenesTrabajoPage from '@/pages/OrdenTrabajo/OrdenesTrabajoPage.tsx';
import InformeDiagnosticoPage from '@/pages/InformeDiagnostico/InformeDiagnosticoPage';
import RegistrarPagoPage from '@/pages/RegistrarPago/RegistrarPagoPage';
import GestionarProformaPage from '@/pages/GestionarProforma/GestionarProformaPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="admin" replace />} />
          <Route path="admin" element={<GestionUsuariosPage />} />
          <Route path="gestionar-clientes" element={<GestionClientesPage />} />
          <Route path="visualizar-orden" element={<OrdenesTrabajoPage />} />
          <Route path="gestionar-orden" element={<GestionOrdenTrabajoPage />} />
          <Route path="informe-diagnostico" element={<InformeDiagnosticoPage />} /> // falta
          <Route path="registrar-pago" element={<RegistrarPagoPage />} />
          <Route path="gestionar-proforma" element={<GestionarProformaPage />} /> // falta
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
