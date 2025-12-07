import React from "react";
import "./login.css";
import LoginForm from "../../components/auth/LoginForm";

const loginImage = "/venues/37baef48823fbeff66b7f4c79d9769b6.jpg";

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-left">
          <div className="login-heading">
            <h1>Đăng nhập</h1>
            <p>Vui lòng nhập thông tin của bạn.</p>
          </div>
          <LoginForm />
        </div>

        <div className="login-right">
          <img src={loginImage} alt="Sân cầu lông" />
        </div>
      </div>
    </div>
  );
}
