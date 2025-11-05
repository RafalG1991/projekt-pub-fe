import "./CartIcon.css";

type Props = {
  toggleBasket: () => void;
  itemsCounter: number;
};

const CartIcon = (props: Props) => {
  const toggle = (event: React.MouseEvent<HTMLDivElement>) => {
    props.toggleBasket();
  };

  return (
    <div className="cart-icon" onClick={toggle}>
      <img
        src={`${process.env.PUBLIC_URL}/shopping-cart.png`}
        alt="Shopping cart"
      />
      <p>
        Your cart <span>{props.itemsCounter}</span>
      </p>
    </div>
  );
};

export default CartIcon;
