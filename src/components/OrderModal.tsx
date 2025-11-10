import "./OrderModal.css";
import { Link } from "react-router-dom";
import { Loader } from "./Loader";
import { parseDrinks } from "../utils/parseDrinks";

type Drink = {
  word: string;
  count: number;
};

export type OrderItem = {
  customers_number: number,
  items: string | null,
  order_id: number,
  table_number: number,
  total: number,
}


type Props = {
  order: OrderItem[];
  isLoading: boolean;
  toggleOrder: () => void;
};

const OrderModal = (props: Props) => {

  return (
    <div className="order-modal-wrapper">
      <div className="modal-content">
        <button
          className="order-modal-exit"
          type="button"
          onClick={props.toggleOrder}
        >
          X
        </button>
        <p className="order-title">Order</p>

        {props.isLoading ? (
          <Loader />
        ) : (
          <ul>
            {props.order.map((item) => {
              const drinks = item.items ? parseDrinks(item.items) : [];
              return (
                <li key={item.order_id}>
                  {drinks.length > 0 ? (
                    drinks.map((drink: Drink) => (
                      <div className="drink-name" key={drink.word}>
                        <p>{drink.word}</p>
                        <p>{drink.count}</p>
                      </div>
                    ))
                  ) : (
                    <p className="order-title">Order is empty!</p>
                  )}

                  <div className="order-details">
                    <p>Table number: {item.table_number}</p>
                    <p>Number of customers: {item.customers_number}</p>
                  </div>

                  <hr />
                  <p className="total">
                    Total: ${Number(item.total).toFixed(2)}
                  </p>

                  <Link to={`/${item.table_number}`}>Add to order</Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OrderModal;
