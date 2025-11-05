import "./Navigation.css";
import NavComponent from "./NavComponent";
import { useAuth } from "../auth/AuthContext";

const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="nav-container">
      <p className="logo">Pub Manager</p>
      <NavComponent />
      <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
        {user ? (
          <>
            <span>{user.name} ({user.role})</span>
            <button onClick={() => logout()}>Logout</button>
          </>
        ) : (
          <>
            <a href="/login">Log in</a>
            <a href="/register">Register</a>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
