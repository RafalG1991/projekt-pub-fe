import "./Header.css";
import CartIcon from "./CartIcon";
import NavComponent from "./NavComponent";
import type { BasketItem } from "./BasketModal";
import {useNavigate} from "react-router-dom"; // używamy typu z poprzedniego pliku

type Props = {
  basket: BasketItem[];
  itemsCounter: number;
  toggleBasket: () => void;
};

const Header = (props: Props) => {
  const navigate = useNavigate();
  return (
    <header className="header-container">
      <p className="logo" onClick={() => navigate('/')}>Pub Manager</p>
      <NavComponent />
      <CartIcon
        itemsCounter={props.itemsCounter}
        toggleBasket={props.toggleBasket}
      />
    </header>
  );
};

export default Header;
