
import './CartIcon.css';

const CartIcon = props => {

  const toggle = (event) => {
    props.toggleBasket();
  }

    return (
      <div className="cart-icon" onClick={toggle}>
          <img src={`${process.env.PUBLIC_URL}/shopping-cart.png`} alt=""/>
          <p>Your cart <span>{props.itemsCounter}</span></p>
      </div>
    );
}

export default CartIcon;