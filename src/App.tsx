import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from './pages/Login';
import Dash from './pages/Dash/Dash';
import GestionUsuarios from './pages/Dash/GestionUsuarios/GestionUsuarios';
import GestionClientes from './pages/Dash/GestionClientes/GestionClientes.tsx';
import GestionOrden from './pages/Dash/GestionOrden/GestionOrden';
import ProtectedRoute from './pages/ProtectedRoute';
import OrdenTrabajo from './pages/Dash/OrdenTrabajo/OrdenesTrabajoPage';
import InformeDiagnostico from './pages/Dash/InformeDiagnostico/InformeDiagnostico';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Dash />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="admin" replace />} />
          <Route path="admin" element={<GestionUsuarios />} />
          <Route path="gestionar-clientes" element={<GestionClientes />} />
          <Route path="visualizar-orden" element={<OrdenTrabajo />} />
          <Route path="getionar-orden" element={<GestionOrden />} />
          <Route path="informe-diagnostico" element={<InformeDiagnostico />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
