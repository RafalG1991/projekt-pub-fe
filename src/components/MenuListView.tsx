import { useState, useEffect } from "react";
import Navigation from "./Navigation";
import MenuList from "./MenuList";
import { Loader } from "./Loader";
import {API, authFetch} from "../api/auth";
import {ApiResponse} from "./MenuView";

type MenuItemData = {
  id: number;
  name: string;
  price: number;
  description?: string;
};

const MenuListView = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [menuList, setMenuList] = useState<MenuItemData[]>([]);

  useEffect(() => {
    setIsLoading(true);
    authFetch(`${API}/order/menu`)
      .then((response) => response.json())
      .then((r: ApiResponse) => {
        const menu: MenuItemData[] = r.menu.map((item) => ({
          id: item.drink_id,
          name: item.drink_name,
          price: item.price,
          description: item.description
        }));
        setMenuList(menu);
      })
      .catch((err) => console.error("Error loading menu:", err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <Navigation />
      {isLoading ? <Loader /> : <MenuList items={menuList} />}
    </>
  );
};

export default MenuListView;
