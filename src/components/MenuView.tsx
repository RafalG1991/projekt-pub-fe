import { useEffect, useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Header from "./Header";
import Menu from "./Menu";
import BasketModal from "./BasketModal";
import {API, authFetch} from "../api/auth";
import {OrderItem} from "./OrderModal";

import './MenuView.css';

export type ApiItem = {
  description: string,
  drink_id: number,
  drink_name: string,
  price: number,
}
type DrinkItem = { id: number; name: string; price: number; description?: string };
export type BasketItem = { id: number; name: string; price: number; amount: number };

export type ApiResponse = { menu: ApiItem[] };
export type ApiOrderResponse = { order: OrderItem[] | [] };

export default function MenuView() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();

  const [menuList, setMenuList] = useState<DrinkItem[]>([]);
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [itemsCounter, setItemsCounter] = useState<number>(0);
  const [basketToggle, setBasketToggle] = useState<boolean>(false);

  const [order, setOrder] = useState<OrderItem[] | []>([]);

  useEffect(() => {
    authFetch(`${API}/order/menu`)
      .then((r) => r.json())
      .then((r: ApiResponse) => {
        const menu: DrinkItem[] = r.menu.map((item: ApiItem) => ({
          id: item.drink_id,
          name: item.drink_name,
          price: item.price,
          description: item.description,
        }));
        setMenuList(menu);
      });
    authFetch(`${API}/order/show/${orderId}`)
      .then((r) => r.json())
      .then((r: ApiOrderResponse) => {
        setOrder(r.order);
      });
    if (order.length === 0) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [orderId, navigate, order.length]);

  const toggleBasket = () => setBasketToggle((v) => !v);

  const addItemToBasket = (item: BasketItem) => {
    let tempBasket: BasketItem[];
    if (basket.map((el) => el.name).includes(item.name)) {
      tempBasket = basket.map((el) =>
        el.name === item.name ? { ...el, amount: el.amount + item.amount } : el
      );
    } else {
      tempBasket = [...basket, item];
    }
    setBasket(tempBasket);
    toast.success(`${item.name} added to basket!`, { position: "bottom-center" });
  };

  useEffect(() => {
    setItemsCounter(basket.reduce((prev, item) => item.amount + prev, 0));
  }, [basket]);

  const addAmount = (item: BasketItem) => {
    if (basket.map((el) => el.name).includes(item.name)) {
      const tempBasket = basket.map((el) =>
        el.name === item.name ? { ...el, amount: el.amount + 1 } : el
      );
      setBasket(tempBasket);
    }
  };

  const removeAmount = (item: BasketItem) => {
    if (basket.map((el) => el.name).includes(item.name)) {
      let tempBasket = basket.map((el) =>
        el.name === item.name ? { ...el, amount: el.amount - 1 } : el
      );
      tempBasket = tempBasket.filter((el) => el.amount !== 0);
      setBasket(tempBasket);
    }
  };

  const clearBasket = (item: BasketItem) => {
    if (basket.map((el) => el.name).includes(item.name)) {
      let tempBasket = basket.map((el) =>
        el.name === item.name ? { ...el, amount: 0 } : el
      );
      tempBasket = tempBasket.filter((el) => el.amount !== 0);
      setBasket(tempBasket);
    }
  };

  return (
    order.length > 0 ? <>
        <Header basket={basket} itemsCounter={itemsCounter} toggleBasket={toggleBasket} />
        <Menu items={menuList} basket={basket} add={addItemToBasket} />
        {basketToggle && orderId && (
          <BasketModal
            orderId={orderId} // string z URL
            basket={basket}
            addAmount={addAmount}
            removeAmount={removeAmount}
            clearBasket={clearBasket}
            toggleBasket={toggleBasket}
          />
        )}
        <ToastContainer />
      </> : <div className="error-wrapper">
      <p className="typing">Order doesn't exist, redirecting to main page ...</p>
    </div>
  );
}
