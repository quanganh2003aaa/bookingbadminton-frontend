import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function ManagerRegisterForm() {
  const [show, setShow] = useState({ password: false, confirm: false });
  const [values, setValues] = useState({
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const toggle = (key) => {
    setShow((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Manager register submit", values);
  };

  return (
    <form className="manager-form" onSubmit={handleSubmit}>
      <div className="steps">
        <div className="step active">
          <span className="step-number">1</span>
          <span className="step-line" />
        </div>
        <div className="step">
          <span className="step-number muted">2</span>
          <span className="step-line" />
        </div>
        <div className="step">
          <span className="step-number muted">3</span>
        </div>
      </div>

      <div className="field">
        <label htmlFor="phone">Số điện thoại</label>
        <div className="input-wrap">
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Nhập số điện thoại"
            value={values.phone}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="email">Gmail</label>
        <div className="input-wrap">
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Nhập gmail của bạn"
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
            type={show.password ? "text" : "password"}
            placeholder="**********"
            value={values.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="eye-btn"
            onClick={() => toggle("password")}
            aria-label={show.password ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {show.password ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
      </div>

      <div className="field">
        <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
        <div className="input-wrap password">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={show.confirm ? "text" : "password"}
            placeholder="**********"
            value={values.confirmPassword}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="eye-btn"
            onClick={() => toggle("confirm")}
            aria-label={
              show.confirm ? "Ẩn mật khẩu nhập lại" : "Hiện mật khẩu nhập lại"
            }
          >
            {show.confirm ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
      </div>

      <button type="submit" className="btn primary full">
        Bước tiếp theo
      </button>

      <p className="signup-note">
        Bạn đã có tài khoản quản lý?{" "}
        <a className="link-accent" href="/owner-login">
          Đăng nhập!
        </a>
      </p>
    </form>
  );
}
