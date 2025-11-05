import "./Header.css";
import CartIcon from "./CartIcon";
import NavComponent from "./NavComponent";
import type { BasketItem } from "./BasketModal"; // używamy typu z poprzedniego pliku

type Props = {
  basket: BasketItem[];
  itemsCounter: number;
  toggleBasket: () => void;
};

const Header = (props: Props) => {
  return (
    <header className="header-container">
      <p className="logo">Pub Manager</p>
      <NavComponent />
      <CartIcon
        itemsCounter={props.itemsCounter}
        toggleBasket={props.toggleBasket}
      />
    </header>
  );
};

export default Header;
