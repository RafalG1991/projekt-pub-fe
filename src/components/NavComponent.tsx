import { NavLink } from "react-router-dom";
import "./NavComponent.css";
import { useAuth } from "../auth/AuthContext";

const NavComponent = () => {
  const { user, logout } = useAuth();

  return (
    <div className="navcomp-wrapper">
      {user ? (
        <>
          <NavLink to="/">Tables</NavLink>
          <NavLink to="/menu">Menu</NavLink>
          <NavLink to="/orders">Orders</NavLink>
          {user?.role === "admin" && <NavLink to="/supplies">Supplies</NavLink>}
          <div className="user-wrapper">
            <span>{user.name} ({user.role})</span>
            <button onClick={() => logout()}>Logout</button>
          </div>
        </>
      ) : (
        <>
          <a href="/login">Log in</a>
          <a href="/register">Register</a>
        </>
      )}
    </div>
  );
};

export default NavComponent;
