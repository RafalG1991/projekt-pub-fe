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
      <NavLink
        to="/orders"
        className={({isActive, isPending}) =>
          isPending ? "pending" : isActive ? "active" : ""
        }
      >
        Orders
      </NavLink>
      <NavLink
        to="/supplies"
        className={({isActive, isPending}) =>
          isPending ? "pending" : isActive ? "active" : ""
        }
      >
        Storage
      </NavLink>
    </div>

  )
}
export default NavComponent;