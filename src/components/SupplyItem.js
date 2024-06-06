import { useState } from 'react';

import './SupplyItem.css';
import {Loader} from "./Loader";

const SupplyItem = props => {
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const amountInputHandler = event => {
    setAmount(event.target.value);
  }

  const submitHandler = async (event) => {
    event.preventDefault();
    if(!amount) {
      return;
    }
    setIsLoading(true);
    const res = await fetch('https://projekt-pub.onrender.com/report/add', {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin':'origin',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: props.item[0],
        quantity: amount,
      }),
    });
    if(res.ok) {
      setIsLoading(false);
      setAmount(0);
      props.setReload(true);
    }
  }

    return (
      <div className="supply-item-wrapper">
        <img src={process.env.PUBLIC_URL + `/${props.item[1].toLowerCase()}.jpg`}
             alt={props.item[1]}/>
        <div className="supply-item-description">
          <p>{props.item[1]}</p>
          <p>In stock: {props.item[2]}</p>
        </div>
        {isLoading ? <Loader/> :
          <div className="supply-item-order">
          <form onSubmit={submitHandler}>
            <label htmlFor="amount">Amount</label>
            <input
              id="amount"
              type="number"
              min="1"
              value={amount}
              onChange={amountInputHandler}
            />
            <button type="submit">Add</button>
          </form>
        </div>}
      </div>
    )
}

export default SupplyItem;