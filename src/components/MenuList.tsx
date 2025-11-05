import "./Menu.css";
import MenuListItem from "./MenuListItem";

type MenuItemData = {
    id: number;
    name: string;
    price: number;
    description?: string;
};

type Props = {
    items: MenuItemData[];
};

const MenuList = (props: Props) => {
    return (
      <div className="menu-wrapper">
          {props.items.map((item) => (
            <MenuListItem key={item.id} item={item} />
          ))}
      </div>
    );
};

export default MenuList;
