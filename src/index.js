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
    element: <TablesView />,
    errorElement: <ErrorPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);