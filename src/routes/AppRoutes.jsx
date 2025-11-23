import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import AppLayoutAdmin from "../layouts/AppLayoutAdmin";
import AuthLayout from "../layouts/AuthLayout";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import OwnerLoginPage from "../pages/OwnerLoginPage";
import ManagerRegisterPage from "../pages/ManagerRegisterPage";
import BookingPage from "../pages/BookingPage";
import PayingPage from "../pages/PayingPage";
import NotFoundPage from "../pages/NotFoundPage";
import HomePageAdmin from "../pages/admin/HomePageAdmin";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "booking", element: <BookingPage /> },
      { path: "paying", element: <PayingPage /> },
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
    path: "/owner-login",
    element: <AuthLayout />,
    children: [{ index: true, element: <OwnerLoginPage /> }],
  },
  {
    path: "/manager-register",
    element: <AuthLayout />,
    children: [{ index: true, element: <ManagerRegisterPage /> }],
  },

  {
    path: "/admin",
    element: <AppLayoutAdmin />,
    children: [{ index: true, element: <HomePageAdmin /> }],
  },

  { path: "*", element: <NotFoundPage /> },
]);
// TODO: xem lai router
