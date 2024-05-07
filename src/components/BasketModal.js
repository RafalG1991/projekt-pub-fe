import './BasketModal.css';

const BasketModal = props => {
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

  const addOrder = async (id, choice, quantity) => {
    console.log(id, choice, quantity)
    const res = await fetch('http://127.0.0.1:5000/order/add', {
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
  }

  return (
    <div className="modal-wrapper">
      <button className="modal-exit" type="button" onClick={props.toggleBasket}>X</button>
      {props.basket.length ? (
        <ul>
          {props.basket.map(item => {
            return (
              <li key={item.id}>
                <p>{item.name} - {item.amount} x ${item.price} = ${(item.amount * item.price).toFixed(2)}</p>
                <button type="button" onClick={clickPlusHandler} id={item.id}>+</button>
                {item.amount && <button type="button" onClick={clickMinusHandler} id={item.id}>-</button>}
                <button type="button" onClick={() => addOrder(props.orderId, item.name, item.amount)}>Add to order</button>
              </li>
            )
          })}
          <hr/>
          <li>TOTAL: ${props.basket.reduce((acc, item) => acc + item.price * item.amount, 0).toFixed(2)}</li>
        </ul>
      ) : <p>Basket is empty!</p>}
    </div>
  )
}

export default BasketModal;