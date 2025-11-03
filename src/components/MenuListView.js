import React, { useState, useEffect } from 'react';

import Navigation from "./Navigation";
import MenuList from "./MenuList";
import {Loader} from "./Loader";

function MenuListView() {
  const [isLoading, setIsLoading] = useState(false);
  const [menuList, setMenuList] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    fetch('http://127.0.0.1:5000/order/menu')
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

  return (
    <>
      <Navigation/>
      {isLoading ?
        <Loader /> : <MenuList items={menuList}/>}
    </>
  );
}

export default MenuListView;
