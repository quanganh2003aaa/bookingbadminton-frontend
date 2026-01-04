import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function ManagerRegisterForm({
  onNext,
  activeStep = 1,
  values,
  onChange,
  allowEditAccount = true,
  showLoginHint = true,
}) {
  const [show, setShow] = useState({ password: false, confirm: false });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (error) setError("");
    onChange && onChange((prev) => ({ ...prev, [name]: value }));
  };

  const toggle = (key) => setShow((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (values.password !== values.confirmPassword) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }
    onNext && onNext(values);
  };

  return (
    <form className="manager-form" onSubmit={handleSubmit}>
      <div className="steps">
        <div
          className={`step ${
            activeStep === 1 ? "active" : activeStep > 1 ? "completed" : ""
          }`}
        >
          <span className={`step-number ${activeStep !== 1 ? "muted" : ""}`}>
            1
          </span>
          <span className="step-line" />
        </div>
        <div
          className={`step ${
            activeStep === 2 ? "active" : activeStep > 2 ? "completed" : ""
          }`}
        >
          <span className={`step-number ${activeStep !== 2 ? "muted" : ""}`}>
            2
          </span>
          <span className="step-line" />
        </div>
        <div className={`step ${activeStep === 3 ? "active" : ""}`}>
          <span className={`step-number ${activeStep !== 3 ? "muted" : ""}`}>
            3
          </span>
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
            pattern="(0|\\+84)[0-9]{9}"
            maxLength={12}
            inputMode="tel"
            title="Số điện thoại Việt Nam bắt đầu bằng 0 hoặc +84, gồm 10 chữ số"
            value={values.phone}
            onChange={handleChange}
            required
            readOnly={!allowEditAccount}
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
            readOnly={!allowEditAccount}
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
            minLength={8}
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
            minLength={8}
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
        {error && <p className="form-error">{error}</p>}
      </div>

      <button type="submit" className="btn primary full">
        Bước tiếp theo
      </button>

      {showLoginHint && (
        <p className="signup-note">
          Bạn đã có tài khoản quản lý?{" "}
          <a className="link-accent" href="/owner-login">
            Đăng nhập!
          </a>
        </p>
      )}
    </form>
  );
}
