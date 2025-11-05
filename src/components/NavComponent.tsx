import { NavLink } from "react-router-dom";
import "./NavComponent.css";
import { useAuth } from "../auth/AuthContext";

const NavComponent = () => {
  const { user } = useAuth();

  return (
    <div className="navcomp-wrapper">
      <NavLink to="/">Tables</NavLink>
      <NavLink to="/menu">Menu</NavLink>
      <NavLink to="/orders">Orders</NavLink>
      {user?.role === "admin" && <NavLink to="/supplies">Supplies</NavLink>}
    </div>
  );
};

export default NavComponent;
