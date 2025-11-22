import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import AppLayoutAdmin from "../layouts/AppLayoutAdmin";
import AuthLayout from "../layouts/AuthLayout";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import NotFoundPage from "../pages/NotFoundPage";
import HomePageAdmin from "../pages/admin/HomePageAdmin";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
    ],
  },

  {
    path: "/login",
    element: <AuthLayout />,
    children: [{ index: true, element: <LoginPage /> }],
  },
  {
    path: "/register",
    element: <AuthLayout />,
    children: [{ index: true, element: <RegisterPage /> }],
  },
  {
    path: "/forgot-password",
    element: <AuthLayout />,
    children: [{ index: true, element: <ForgotPasswordPage /> }],
  },

  {
    path: "/admin",
    element: <AppLayoutAdmin />,
    children: [{ index: true, element: <HomePageAdmin /> }],
  },

  { path: "*", element: <NotFoundPage /> },
]);
// TODO: xem lai router
