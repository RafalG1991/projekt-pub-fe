import './OrderModal.css';
import {Link} from "react-router-dom";
import {countWords} from "../utils/wordsCounter";
import {Loader} from "./Loader";
import {parseDrinks} from "../utils/parseDrinks";

const OrderModal = props => {
  console.log(props.order)
  return (
    <div className="order-modal-wrapper">

      <div className="modal-content">
        <button className="order-modal-exit" type="button" onClick={props.toggleOrder}>X</button>
        <p className="order-title">Order</p>
        {props.isLoading ? <Loader/> :
          <ul>
          {props.order.map(item => {
            return (
              <li key={item[0]}>
                {item[3] ? (parseDrinks(item[3])).map(drink => <div className="drink-name">
                    <p>{drink.word}</p>
                    <p>{drink.count}</p>
                  </div>
                ) : <p className="order-title">Order is empty!</p>}
                <div className="order-details">
                  <p>Table number: {item[1]}</p>
                  <p>Number of customers: {item[2]} </p>
                </div>
                <hr/>
                <p className="total">Total: ${Number(item[4]).toFixed(2)} </p>
                <Link to={`/${item[1]}`}>Add to order</Link>
              </li>
            )
          })}
        </ul>}
      </div>
    </div>
  )
}

export default OrderModal;