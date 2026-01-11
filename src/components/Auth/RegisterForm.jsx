import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { ENDPOINTS } from "../../api/endpoints";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [show, setShow] = useState({ password: false, confirm: false });
  const [values, setValues] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setSuccess("");
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const toggle = (key) => {
    setShow((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const trimmedName = values.fullName.trim();
    const trimmedEmail = values.email.trim();

    if (!trimmedName || trimmedName.length > 50) {
      setError("Vui lòng nhập họ và tên (từ 1 đến 50 ký tự).");
      return;
    }

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(values.phone)) {
      setError("Số điện thoại phải bắt đầu bằng 0 và gồm 10 chữ số.");
      return;
    }

    const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,}$/;
    if (!emailRegex.test(trimmedEmail) || trimmedEmail.length > 50) {
      setError("Email không hợp lệ hoặc dài quá 50 ký tự.");
      return;
    }

    if (values.password.length < 8) {
      setError("Mật khẩu cần tối thiểu 8 ký tự.");
      return;
    }

    if (values.password !== values.confirmPassword) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }

    const payload = {
      account: {
        password: values.password,
        gmail: trimmedEmail,
        msisdn: values.phone,
      },
      name: trimmedName,
    };

    setSubmitting(true);
    try {
      const res = await fetch(ENDPOINTS.registerUser, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || "Đăng ký thất bại. Vui lòng thử lại.");
      }

      const registered = data?.data || data?.result;
      if (!registered?.id) {
        throw new Error("Đăng ký thất bại. Vui lòng thử lại.");
      }

      setSuccess("Đăng ký thành công! Đang chuyển sang trang đăng nhập...");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setError(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="register-form" onSubmit={handleSubmit}>
      {(error || success) && (
        <div className={`form-alert ${error ? "error" : "success"}`}>{error || success}</div>
      )}

      <div className="field">
        <label htmlFor="fullName">Họ và tên</label>
        <div className="input-wrap">
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Nhập họ và tên"
            value={values.fullName}
            onChange={handleChange}
            required
          />
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
        <label htmlFor="email">Email</label>
        <div className="input-wrap">
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Nhập email"
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
            aria-label={show.confirm ? "Ẩn mật khẩu nhập lại" : "Hiện mật khẩu nhập lại"}
          >
            {show.confirm ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
      </div>

      <button type="submit" className="btn primary" disabled={submitting}>
        {submitting ? "Đang đăng ký..." : "Đăng ký"}
      </button>

      <button type="button" className="btn google" disabled={submitting}>
        <FcGoogle aria-hidden="true" size={22} />
        <span>Tiếp tục với Google</span>
      </button>

      <p className="signup-note">
        Bạn đã có tài khoản?{" "}
        <a className="link-accent" href="/login">
          Đăng nhập!
        </a>
      </p>
    </form>
  );
}
