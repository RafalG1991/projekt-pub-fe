import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import './BasketModal.css';
import {useState} from "react";
import {Loader} from "./Loader";

const BasketModal = props => {
  const [isLoading, setIsLoading] = useState(false);
  const clickPlusHandler = (event) => {
    for (const el of props.basket) {
      if (el.id === Number(event.target.id)) {
        props.addAmount(el);
      }
    }
  }

  const clickMinusHandler = (event) => {
    for (const el of props.basket) {
      if (el.id === Number(event.target.id)) {
        props.removeAmount(el);
      }
    }
  }

  const clearHandler = (event) => {
    for (const el of props.basket) {
      if (el.id === Number(event.target.id)) {
        props.clearBasket(el);
      }
    }
  }

  const addOrder = async (id, choice, quantity) => {
    setIsLoading(true);
    const res = await fetch('http://localhost:5000/order/add', {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin':'origin',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        choice,
        quantity,
      }),
    });
    setIsLoading(false);
    const data = await res.json();
    if(data.added === 'ok') {
      for (const el of props.basket) {
        if (el.name === choice) {
          props.clearBasket(el);
        }
      }
      toast.success("Order successfully added!", {
        position: "bottom-center"
      });
    } else {
      toast.error("Order cannot be added! Not enough ingredients!", {
        position: "bottom-center"
      });
    }
  }

  return (
    <div className="modal-wrapper">
      <button className="modal-exit" type="button" onClick={props.toggleBasket}>X</button>
      {props.basket.length ? (
        <ul>
          {props.basket.map(item => {
            return (
              <li key={item.id}>
                <p className="order-desc" >{item.name} - {item.amount} x ${item.price} = ${(item.amount * item.price).toFixed(2)}</p>
                <button className="basket-button add-button" type="button" onClick={clickPlusHandler} id={item.id}>+</button>
                {item.amount && <button className="basket-button reduce-button" type="button" onClick={clickMinusHandler} id={item.id}>-</button>}
                {isLoading ? <Loader/> : <button className="basket-button" type="button"
                         onClick={() => addOrder(props.orderId, item.name, item.amount)}>Add to order</button>}
                {item.amount && <button className="basket-button reduce-button" type="button" onClick={clearHandler} id={item.id}>Clear</button>}
              </li>
            )
          })}
          <hr/>
          <li>TOTAL: ${props.basket.reduce((acc, item) => acc + item.price * item.amount, 0).toFixed(2)}</li>
        </ul>
      ) : <p className="empty-desc">Basket is empty!</p>}
    </div>
  )
}

export default BasketModal;