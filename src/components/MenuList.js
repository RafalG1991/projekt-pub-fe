import './Menu.css';
import MenuListItem from "./MenuListItem";

const MenuList = props => {
    return (
        <div className="menu-wrapper">
            {props.items.map(item => <MenuListItem key={item.id} item={item} />)}
        </div>
    );
}

export default MenuList;