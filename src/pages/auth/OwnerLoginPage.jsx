import React from "react";
import "./owner-login.css";
import OwnerLoginForm from "../../components/auth/OwnerLoginForm";

const ownerLoginImage = "/venues/37baef48823fbeff66b7f4c79d9769b6.jpg";

export default function OwnerLoginPage() {
  return (
    <div className="owner-page">
      <div className="owner-card">
        <div className="owner-left">
          <div className="owner-heading">
            <h1>Đăng nhập - Chủ sân</h1>
            <p>Vui lòng nhập thông tin của bạn.</p>
          </div>
          <div className="owner-divider" />
          <OwnerLoginForm />
        </div>

        <div className="owner-right">
          <img src={ownerLoginImage} alt="Sân cầu lông" />
        </div>
      </div>
    </div>
  );
}
