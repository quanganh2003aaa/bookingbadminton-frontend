import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import AppLayoutAdmin from "../layouts/AppLayoutAdmin";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";
import HomePageAdmin from "../pages/admin/HomePageAdmin";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
    ],
  },

  {
    path: "/admin",
    element: <AppLayoutAdmin />,
    children: [{ index: true, element: <HomePageAdmin /> }],
  },

  { path: "*", element: <NotFoundPage /> },
]);
// TODO: xem lai router
