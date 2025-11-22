import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function ForgotPasswordForm() {
  const [show, setShow] = useState({ password: false, confirm: false });
  const [values, setValues] = useState({
    email: "",
    passcode: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const toggle = (key) => setShow((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Forgot password submit", values);
  };

  const handleSendCode = () => {
    console.log("Send passcode to", values.email);
  };

  return (
    <form className="forgot-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="email">Gmail</label>
        <div className="input-row">
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
          <button
            type="button"
            className="btn send-btn"
            onClick={handleSendCode}
          >
            Gửi
          </button>
        </div>
      </div>

      <div className="field">
        <label htmlFor="passcode">Passcode</label>
        <div className="input-wrap">
          <input
            id="passcode"
            name="passcode"
            type="text"
            placeholder="Nhập mã passcode gồm 6 số"
            value={values.passcode}
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

      <button type="submit" className="btn primary">
        Đăng ký
      </button>

      <p className="back-login">
        <a className="link-accent" href="/login">
          Quay lại trang đăng nhập.
        </a>
      </p>
    </form>
  );
}
