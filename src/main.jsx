import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'antd/dist/reset.css'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from "./routes/AppRoutes";
import { setupApiAuth } from "./services/api";

setupApiAuth();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
