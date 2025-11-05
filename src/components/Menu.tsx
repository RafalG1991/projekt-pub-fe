import "./Menu.css";
import MenuItem from "./MenuItem";
import type { BasketItem } from "./BasketModal";

type DrinkItem = {
    id: number;
    name: string;
    price: number;
};

type Props = {
    items: DrinkItem[];
    basket: BasketItem[];
    add: (item: BasketItem) => void;
};

const Menu = (props: Props) => {
    return (
      <div className="menu-wrapper">
          {props.items.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              basket={props.basket}
              add={props.add}
            />
          ))}
      </div>
    );
};

export default Menu;
