import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/app/AppLayout";
import AppLayoutAdmin from "../layouts/admin/AppLayoutAdmin";
import AuthLayout from "../layouts/auth/AuthLayout";
import OwnerLayout from "../layouts/owner/OwnerLayout";
import BookingPage from "../pages/public/BookingPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import HomePage from "../pages/public/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import ManagerRegisterPage from "../pages/auth/ManagerRegisterPage";
import NotFoundPage from "../pages/public/NotFoundPage";
import OwnerLoginPage from "../pages/auth/OwnerLoginPage";
import PayingPage from "../pages/public/PayingPage";
import RegisterPage from "../pages/auth/RegisterPage";
import UserInfoPage from "../pages/public/UserInfoPage";
import HomePageAdmin from "../pages/admin/HomePageAdmin";
import OwnerVenueInfoPage from "../pages/owner/OwnerVenueInfoPage";
import OwnerCourtStatusPage from "../pages/owner/OwnerCourtStatusPage";
import OwnerRevenuePage from "../pages/owner/OwnerRevenuePage";
import OwnerAccountPage from "../pages/owner/OwnerAccountPage";

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
    path: "/owner",
    element: <OwnerLayout />,
    children: [
      { index: true, element: <OwnerVenueInfoPage /> },
      { path: "status", element: <OwnerCourtStatusPage /> },
      { path: "revenue", element: <OwnerRevenuePage /> },
      { path: "account", element: <OwnerAccountPage /> },
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
