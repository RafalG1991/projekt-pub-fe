import React, { useState, useEffect } from 'react';

import Navigation from "./Navigation";
import MenuList from "./MenuList";

function MenuListView() {
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

  return (
    <>
      <Navigation/>
      <MenuList items={menuList}/>
    </>
  );
}

export default MenuListView;
