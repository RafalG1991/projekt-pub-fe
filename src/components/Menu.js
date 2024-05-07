import MenuItem from "./MenuItem";
import './Menu.css';

const Menu = props => {
    return (
        <div className="menu-wrapper">
            {props.items.map(item => <MenuItem key={item.id} item={item} basket={props.basket} add={props.add} />)}
        </div>
    );
}

export default Menu;