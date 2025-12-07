import React from "react";
import "./register.css";
import RegisterForm from "../../components/auth/RegisterForm";

const registerImage = "/venues/37baef48823fbeff66b7f4c79d9769b6.jpg";

export default function RegisterPage() {
  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-left">
          <div className="register-heading">
            <h1>Đăng ký</h1>
            <p>Nhập thông tin cá nhân của bạn</p>
          </div>
          <RegisterForm />
        </div>

        <div className="register-right">
          <img src={registerImage} alt="Sân cầu lông" />
        </div>
      </div>
    </div>
  );
}
