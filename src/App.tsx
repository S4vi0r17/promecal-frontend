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

function App() {
  const userRole = getUserRole();

  const allowedRoutes = userRole ? roleRouteMap[userRole] : [];

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
          {allowedRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        {/* <Route path="*" element={<Navigate to="/login" />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
