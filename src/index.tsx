import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MenuView from "./components/MenuView";
import TablesView from "./components/TablesView";
import ErrorPage from "./components/ErrorPage";
import MenuListView from "./components/MenuListView";
import OrdersView from "./components/OrdersView";
import Supplies from "./components/Supplies";
import { AuthProvider, RequireAuth, RequireRole } from "./auth/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";

import "./index.css";

const router = createBrowserRouter([
  { path: "/login", element: <Login />, errorElement: <ErrorPage /> },
  { path: "/register", element: <Register />, errorElement: <ErrorPage /> },

  {
    path: "/",
    element: (
      <RequireAuth>
        <TablesView />
      </RequireAuth>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/:orderId",
    element: (
      <RequireAuth>
        <MenuView />
      </RequireAuth>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/menu",
    element: (
      <RequireAuth>
        <MenuListView />
      </RequireAuth>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/orders",
    element: (
      <RequireAuth>
        <OrdersView />
      </RequireAuth>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/supplies",
    element: (
      <RequireRole roles={["admin"]}>
        <Supplies />
      </RequireRole>
    ),
    errorElement: <ErrorPage />,
  },
]);

// render:
const container = document.getElementById("root");
if (!container) throw new Error("#root not found");

const root = ReactDOM.createRoot(container as HTMLElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);