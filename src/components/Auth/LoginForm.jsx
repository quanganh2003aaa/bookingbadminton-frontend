import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { ENDPOINTS } from "../../api/endpoints";
import { api } from "../../services/api";

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({ username: "", password: "" });
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

    const usernameTrim = values.username.trim();
    if (!usernameTrim || !values.password) {
      setError("Vui lòng nhập tài khoản và mật khẩu.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(ENDPOINTS.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameTrim,
          password: values.password,
        }),
      });

      if (!res.ok) {
        throw new Error("Thông tin đăng nhập không chính xác");
      }

      const data = await res.json().catch(() => ({}));
      const payload = data?.data || data?.result || {};
      if (!payload?.accessToken || !payload?.refreshToken || !payload?.role) {
        throw new Error("Thông tin đăng nhập không chính xác");
      }

      const role = String(payload.role || "").toUpperCase();
      document.cookie = `accessToken=${payload.accessToken}; path=/;`;
      document.cookie = `refreshToken=${payload.refreshToken}; path=/;`;
      const userInfo = encodeURIComponent(
        JSON.stringify({
          userId: payload.userId,
          role,
          username: usernameTrim,
        })
      );
      document.cookie = `userInfo=${userInfo}; path=/;`;
      api.defaults.headers.common.Authorization = `Bearer ${payload.accessToken}`;

      setSuccess("Đăng nhập thành công! Đang chuyển hướng...");
      setTimeout(() => {
        if (role === "OWNER") navigate("/owner");
        else if (role === "ADMIN") navigate("/admin");
        else navigate("/");
      }, 600);
    } catch (err) {
      setError(err.message || "Thông tin đăng nhập không chính xác");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      {(error || success) && <div className={`form-alert ${error ? "error" : "success"}`}>{error || success}</div>}

      <div className="field">
        <label htmlFor="username">Tài khoản</label>
        <div className="input-wrap">
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Nhập email hoặc tên đăng nhập"
            value={values.username}
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
    </form>
  );
}
