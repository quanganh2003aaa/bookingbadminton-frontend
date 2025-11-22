import React from "react";
import "./auth/manager-register.css";
import ManagerRegisterForm from "../components/Auth/ManagerRegisterForm";

const managerRegisterBg =
  "https://images.unsplash.com/photo-1512446816042-444d641267d4?auto=format&fit=crop&w=1600&q=80";

export default function ManagerRegisterPage() {
  return (
    <div className="manager-register-page">
      <div className="manager-register-hero">
        <img src={managerRegisterBg} alt="Nền cầu lông" />
      </div>
      <div className="manager-register-card">
        <div className="manager-heading">
          <h1>Đăng ký quản lý</h1>
          <p>Nhập thông tin cá nhân của bạn</p>
        </div>
        <ManagerRegisterForm />
      </div>
    </div>
  );
}
