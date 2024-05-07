import {NavLink} from "react-router-dom";
import './NavComponent.css';
const NavComponent = props => {

  return (
    <div className="navcomp-wrapper">
      <NavLink
        to="/"
        className={({isActive, isPending}) =>
          isPending ? "pending" : isActive ? "active" : ""
        }
      >
        Tables
      </NavLink>
      <NavLink
        to="/menu"
        className={({isActive, isPending}) =>
          isPending ? "pending" : isActive ? "active" : ""
        }
      >
        Menu
      </NavLink>
    </div>

  )
}
export default NavComponent;