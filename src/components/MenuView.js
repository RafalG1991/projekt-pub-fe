import { useState, useEffect } from 'react';

import Header from "./Header";
import Menu from "./Menu";
import BasketModal from "./BasketModal";
import {useParams} from "react-router-dom";

function MenuView() {
  let { orderId } = useParams();
  const [itemsCounter, setItemsCounter] = useState(0);
  const [basket, setBasket] = useState([]);
  const [basketToggle, setBasketToggle] = useState(false);
  const [menuList, setMenuList] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/order/menu')
      .then(response => response.json())
      .then(r => {
        const menu = r.menu.map((item => {
          console.log(item)
          return {
            id: item[0],
            name: item[1],
            price: item[2],
            description: item[3],
          }
        }))
        setMenuList(menu);
      });
  }, []);
  const toggleBasket = () => {
    setBasketToggle(prevState => !prevState);
  }

  const addItemToBasket = item => {
    let tempBasket;
    if(basket.map(el => el.name).includes(item.name)) {
      tempBasket = basket.map(el => {
        if(el.name===item.name) {
          return {
            ...el,
            amount: el.amount+item.amount,
          };
        } else {
          return el;
        }
      });
    } else {
      tempBasket = [...basket];
      tempBasket.push(item);
    }
    setBasket(tempBasket);
  }

  useEffect(() => {
    setItemsCounter(basket.reduce((prev, item) => item.amount + prev, 0));
  },[basket]);

  const addAmount = (item) => {
    if(basket.map(el => el.name).includes(item.name)) {
      let tempBasket = basket.map(el => {
        if(el.name===item.name) {
          return {
            ...el,
            amount: el.amount+1,
          };
        } else {
          return el;
        }
      });
      setBasket(tempBasket);
    }
  }

  const removeAmount = (item) => {
    if(basket.map(el => el.name).includes(item.name)) {
      let tempBasket = basket.map(el => {
        if(el.name===item.name) {
          return {
            ...el,
            amount: el.amount-1,
          };
        } else {
          return el;
        }
      });
      tempBasket = tempBasket.filter(el => el.amount !== 0);
      setBasket(tempBasket);
    }
  }
  console.log(basket)
  return (
    <>
      <Header basket={basket} itemsCounter={itemsCounter} toggleBasket={toggleBasket}/>
      <Menu items={menuList} basket={basket} add={addItemToBasket} />
      {basketToggle && <BasketModal orderId={orderId} basket={basket} addAmount={addAmount} removeAmount={removeAmount} toggleBasket={toggleBasket}/>}
    </>
  );
}

export default MenuView;
