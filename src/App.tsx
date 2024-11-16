import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from './pages/Login';
import Dash from './pages/Dash/Dash';
import GestionUsuarios from './pages/Dash/GestionUsuarios/GestionUsuarios';
import Ejemplo2 from './pages/Dash/ejemplo2/Ejemplo2';
import ProtectedRoute from './pages/ProtectedRoute';
import path from 'path';
import OrdenTrabajo from './pages/Dash/OrdenTrabajo/OrdenesTrabajoPage';

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
          <Route index element={<Navigate to="1" replace />} />
          <Route path="1" element={<GestionUsuarios />} />
          <Route path="2" element={<Ejemplo2 />} />
          <Route path="3" element={<OrdenTrabajo />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
