import './OrderModal.css';
import {Link} from "react-router-dom";

const OrderModal = props => {

  return (
    <div className="order-modal-wrapper">
      <button className="order-modal-exit" type="button" onClick={props.toggleOrder}>X</button>
      {props.order.length ? (
        <ul>
          {props.order.map(item => {
            return (
              <li key={item[0]}>
                <p>{item[0]} {item[1]} {item[3]} - ${item[4]} </p>
                <Link to={`/${item[0]}`}>Order</Link>
              </li>
            )
          })}
          <hr/>
        </ul>
      ) : <p>Order is empty!</p>}
    </div>
  )
}

export default OrderModal;