import { Link, Outlet, useNavigate } from "react-router-dom";

const Dash = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div>
      <h1>Home Layout</h1>
      <nav>
        <ul>
          <li>
            <Link to="/home/1">Page 1</Link>
          </li>
          <li>
            <Link to="/home/2">Page 2</Link>
          </li>
        </ul>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </nav>
      <Outlet />
    </div>
  );
};

export default Dash;
