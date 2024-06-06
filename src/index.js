import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './index.css';
import MenuView from "./components/MenuView"
import TablesView from "./components/TablesView"
import ErrorPage from './components/ErrorPage';
import MenuListView from "./components/MenuListView";
import OrdersView from "./components/OrdersView";
import Supplies from "./components/Supplies";

const router = createBrowserRouter([
  {
    path: "/",
    element: <TablesView />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/:orderId",
    element: <MenuView/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/menu",
    element: <MenuListView />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/orders",
    element: <OrdersView />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/supplies",
    element: <Supplies />,
    errorElement: <ErrorPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);