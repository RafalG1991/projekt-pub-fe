import './Navigation.css';
import NavComponent from "./NavComponent";

const Navigation = props => {

    return (
      <nav className="nav-container">
        <p className="logo">Pub Manager</p>
        <NavComponent />
      </nav>
    );
}

export default Navigation;