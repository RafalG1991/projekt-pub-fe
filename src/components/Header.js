import CartIcon from './CartIcon';
import './Header.css';
import NavComponent from "./NavComponent";

const Header = props => {

    return (
        <header className="header-container">
            <p className="logo">Pub Manager</p>
            <NavComponent />
            <CartIcon basket={props.basket} itemsCounter={props.itemsCounter} toggleBasket={props.toggleBasket} />
        </header>
    );
}

export default Header;