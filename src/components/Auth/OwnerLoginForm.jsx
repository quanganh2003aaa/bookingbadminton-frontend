import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function OwnerLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Owner login submit", values);
  };

  return (
    <form className="owner-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="email">Tài khoản</label>
        <div className="input-wrap">
          <input
            id="email"
            name="email"
            type="text"
            placeholder="Nhập số điện thoại hoặc gmail"
            value={values.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="password">Mật khẩu</label>
        <div className="input-wrap password">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="**********"
            value={values.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="eye-btn"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        <div className="field-actions">
          <a className="link-muted" href="/forgot-password">
            Quên mật khẩu!
          </a>
        </div>
      </div>

      <button type="submit" className="btn primary">
        Đăng nhập
      </button>

      <p className="signup-note">
        Bạn muốn quản lý sân dễ dàng?{" "}
        <a className="link-accent" href="/register">
          Đăng ký!
        </a>
      </p>
    </form>
  );
}
