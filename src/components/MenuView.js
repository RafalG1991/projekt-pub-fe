import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Menu from "./Menu";
import BasketModal from "./BasketModal";
import {useParams} from "react-router-dom";
import {Loader} from "./Loader";

function MenuView() {
  const [isLoading, setIsLoading] = useState(false);
  let { orderId } = useParams();
  const [itemsCounter, setItemsCounter] = useState(0);
  const [basket, setBasket] = useState([]);
  const [basketToggle, setBasketToggle] = useState(false);
  const [menuList, setMenuList] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    // fetch('https://projekt-pub.onrender.com/order/menu')
    fetch('https://projekt-pub.onrender.com/order/menu')
      .then(response => response.json())
      .then(r => {
        const menu = r.menu.map((item => {
          return {
            id: item[0],
            name: item[1],
            price: item[2],
            description: item[3],
          }
        }))
        setIsLoading(false);
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
    toast.success(`${item.name} added to basket!`, {
      position: "bottom-center"
    });
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

  const clearBasket = (item) => {
    if(basket.map(el => el.name).includes(item.name)) {
      let tempBasket = basket.map(el => {
        if(el.name===item.name) {
          return {
            ...el,
            amount: 0,
          };
        } else {
          return el;
        }
      });
      tempBasket = tempBasket.filter(el => el.amount !== 0);
      setBasket(tempBasket);
    }
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <>
      <Header basket={basket} itemsCounter={itemsCounter} toggleBasket={toggleBasket}/>
      <Menu items={menuList} basket={basket} add={addItemToBasket} />
      {basketToggle && <BasketModal orderId={orderId} basket={basket} addAmount={addAmount} removeAmount={removeAmount} toggleBasket={toggleBasket}
       clearBasket={clearBasket}/>}
      <ToastContainer />
    </>
  );
}

export default MenuView;
