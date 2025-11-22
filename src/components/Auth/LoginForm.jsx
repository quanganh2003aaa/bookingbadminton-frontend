import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submit", values);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
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
          <a className="link-muted" href="#forgot">
            Quên mật khẩu!
          </a>
        </div>
      </div>

      <button type="submit" className="btn primary">
        Đăng nhập
      </button>

      <button type="button" className="btn google">
        <FcGoogle aria-hidden="true" />
        <span>Google</span>
      </button>

      <p className="signup-note">
        Bạn chưa có tài khoản?{" "}
        <a className="link-accent" href="#signup">
          Đăng ký miễn phí!
        </a>
      </p>
    </form>
  );
}
