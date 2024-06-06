import { useState } from 'react';

import './MenuItem.css';

const MenuItem = props => {
  const [amount, setAmount] = useState(0);

  const amountInputHandler = event => {
    setAmount(event.target.value);
  }

  const submitHandler = event => {
        event.preventDefault();
        if(!amount) {
          return;
        }
        props.add({
          id: Math.random(),
          name: props.item.name,
          price: props.item.price,
          amount: Number(amount),
        });
        setAmount(0);
  }

    return (
      <div className="menu-item-wrapper">
        <img src={process.env.PUBLIC_URL + `/${props.item.name.toLowerCase()}.jpg`}
             alt={props.item.name}/>
        <div className="item-description">
          <p>{props.item.name}</p>
          <p>{props.item.description}</p>
          <p>${props.item.price}</p>
        </div>
        <div className="item-order">
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
        </div>
      </div>
    )
}

export default MenuItem;