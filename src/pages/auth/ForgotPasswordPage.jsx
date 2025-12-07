import React from "react";
import "./forgot.css";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";

const forgotImage = "/venues/37baef48823fbeff66b7f4c79d9769b6.jpg";

export default function ForgotPasswordPage() {
  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <div className="forgot-left">
          <div className="forgot-heading">
            <h1>Quên mật khẩu</h1>
            <p>Nhập thông tin để đặt lại mật khẩu.</p>
          </div>
          <ForgotPasswordForm />
        </div>

        <div className="forgot-right">
          <img src={forgotImage} alt="Sân cầu lông" />
        </div>
      </div>
    </div>
  );
}
