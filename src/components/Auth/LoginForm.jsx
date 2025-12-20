import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { ENDPOINTS } from "../../api/endpoints";

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setSuccess("");
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const emailTrim = values.email.trim();
    const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,}$/;
    if (!emailRegex.test(emailTrim) || emailTrim.length > 50) {
      setError("Gmail không hợp lệ hoặc vượt quá 50 ký tự.");
      return;
    }
    if (!values.password) {
      setError("Vui lòng nhập mật khẩu.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(ENDPOINTS.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gmail: emailTrim,
          password: values.password,
        }),
      });

      if (!res.ok) {
        throw new Error("Thông tin đăng nhập không chính xác");
      }

      const data = await res.json().catch(() => ({}));
      if (data?.code !== 0 || !data?.result) {
        throw new Error("Thông tin đăng nhập không chính xác");
      }

      // Lưu thông tin user để hiển thị header
      localStorage.setItem("userProfile", JSON.stringify(data.result));

      setSuccess("Đăng nhập thành công! Đang chuyển hướng...");
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      setError(err.message || "Thông tin đăng nhập không chính xác");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      {(error || success) && (
        <div className={`form-alert ${error ? "error" : "success"}`}>
          {error || success}
        </div>
      )}

      <div className="field">
        <label htmlFor="email">Gmail</label>
        <div className="input-wrap">
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Nhập gmail"
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

      <button type="submit" className="btn primary" disabled={submitting}>
        {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>

      <button type="button" className="btn google" disabled={submitting}>
        <FcGoogle aria-hidden="true" size={22} />
        <span>Tiếp tục với Google</span>
      </button>

      <p className="signup-note">
        Bạn chưa có tài khoản?{" "}
        <a className="link-accent" href="/register">
          Đăng ký miễn phí!
        </a>
      </p>

      <p className="signup-note">
        Nếu bạn là chủ sân,{" "}
        <a className="link-accent" href="/owner-login">
          đến trang đăng nhập của chủ sân
        </a>
      </p>
    </form>
  );
}
