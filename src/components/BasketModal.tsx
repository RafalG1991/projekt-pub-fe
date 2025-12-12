import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./BasketModal.css";
import { Loader } from "./Loader";
import {API, authFetch} from "../api/auth";

type ID = number | string;

export type BasketItem = {
  id: number;
  name: string;
  price: number;
  amount: number;
};

type Props = {
  basket: BasketItem[];
  orderId: ID;
  toggleBasket: () => void;
  addAmount: (item: BasketItem) => void;
  removeAmount: (item: BasketItem) => void;
  clearBasket: (item: BasketItem) => void;
};

const BasketModal = (props: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clickPlusHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    const id = Number(event.currentTarget.id);
    for (const el of props.basket) {
      if (el.id === id) {
        props.addAmount(el);
        break;
      }
    }
  };

  const clickMinusHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    const id = Number(event.currentTarget.id);
    for (const el of props.basket) {
      if (el.id === id) {
        props.removeAmount(el);
        break;
      }
    }
  };

  const clearHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    const id = Number(event.currentTarget.id);
    for (const el of props.basket) {
      if (el.id === id) {
        props.clearBasket(el);
        break;
      }
    }
  };

  const addOrder = async (id: ID, choice: string, quantity: number) => {
    try {
      setIsLoading(true);
      const res = await authFetch(`${API}/order/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, choice, quantity }),
      });

      const data: { added?: "ok" | "no" | string } = await res.json();

      if (data.added === "ok") {
        for (const el of props.basket) {
          if (el.name === choice) {
            props.clearBasket(el);
          }
        }
        toast.success("Order successfully added!", { position: "bottom-center" });
      } else {
        toast.error("Order cannot be added! Not enough ingredients!", {
          position: "bottom-center",
        });
      }
    } catch (e) {
      toast.error("Network error while adding order.", { position: "bottom-center" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-wrapper">
      <button className="modal-exit" type="button" onClick={props.toggleBasket}>
        X
      </button>

      {props.basket.length ? (
        <ul>
          {props.basket.map((item) => {
            return (
              <li key={item.id}>
                <p className="order-desc">
                  {item.name} - {item.amount} x ${item.price} = $
                  {(item.amount * item.price).toFixed(2)}
                </p>

                <button
                  className="basket-button add-button"
                  type="button"
                  onClick={clickPlusHandler}
                  id={String(item.id)}
                >
                  +
                </button>

                {!!item.amount && (
                  <button
                    className="basket-button reduce-button"
                    type="button"
                    onClick={clickMinusHandler}
                    id={String(item.id)}
                  >
                    -
                  </button>
                )}

                {isLoading ? (
                  <Loader />
                ) : (
                  <button
                    className="basket-button"
                    type="button"
                    onClick={() => addOrder(props.orderId, item.name, item.amount)}
                  >
                    Add to order
                  </button>
                )}

                {!!item.amount && (
                  <button
                    className="basket-button reduce-button"
                    type="button"
                    onClick={clearHandler}
                    id={String(item.id)}
                  >
                    Clear
                  </button>
                )}
              </li>
            );
          })}

          <hr />
          <li>
            TOTAL: $
            {props.basket
              .reduce((acc, item) => acc + item.price * item.amount, 0)
              .toFixed(2)}
          </li>
        </ul>
      ) : (
        <p className="empty-desc">Basket is empty!</p>
      )}
    </div>
  );
};

export default BasketModal;
