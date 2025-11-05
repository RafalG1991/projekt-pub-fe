import {useState} from "react";
import {Loader} from "./Loader";
import './SupplyItem.css';
import {API, authFetch} from "../api/auth";

type Props = {
  item: any[]; // [id, name, qty, ...]
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
};

const SupplyItem = (props: Props) => {
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const amountInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(event.target.value));
  };

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!amount) return;
    setIsLoading(true);
    const res = await authFetch(`${API}/report/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: props.item[0],
        quantity: amount,
      }),
    });
    if (res.ok) {
      setIsLoading(false);
      props.setReload((v) => !v);
    }
  };

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
            {isLoading ? <Loader/> : null}
            <input type="number" value={amount} onChange={amountInputHandler}/>
            <button type="submit">Add</button>
          </form>
        </div>}
    </div>
  );
};

export default SupplyItem;