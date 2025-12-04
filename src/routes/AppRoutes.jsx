import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import AppLayoutAdmin from "../layouts/AppLayoutAdmin";
import AuthLayout from "../layouts/AuthLayout";
import BookingPage from "../pages/BookingPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ManagerRegisterPage from "../pages/ManagerRegisterPage";
import NotFoundPage from "../pages/NotFoundPage";
import OwnerLoginPage from "../pages/OwnerLoginPage";
import PayingPage from "../pages/PayingPage";
import RegisterPage from "../pages/RegisterPage";
import UserInfoPage from "../pages/UserInfoPage";
import HomePageAdmin from "../pages/admin/HomePageAdmin";

const authRoutes = [
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/owner-login", element: <OwnerLoginPage /> },
  { path: "/manager-register", element: <ManagerRegisterPage /> },
].map(({ path, element }) => ({
  path,
  element: <AuthLayout />,
  children: [{ index: true, element }],
}));

const appRoutes = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "booking", element: <BookingPage /> },
      { path: "paying", element: <PayingPage /> },
      { path: "info-user", element: <UserInfoPage /> },
    ],
  },
  {
    path: "/admin",
    element: <AppLayoutAdmin />,
    children: [{ index: true, element: <HomePageAdmin /> }],
  },
];

export const router = createBrowserRouter([
  ...appRoutes,
  ...authRoutes,
  { path: "*", element: <NotFoundPage /> },
]);
