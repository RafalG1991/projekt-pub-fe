import "./Navigation.css";
import NavComponent from "./NavComponent";
import {useNavigate} from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  return (
    <nav className="nav-container">
      <p className="logo" onClick={() => navigate('/')}>Pub Manager</p>
      <NavComponent />
    </nav>
  );
};

export default Navigation;
