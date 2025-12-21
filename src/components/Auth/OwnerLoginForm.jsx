import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ENDPOINTS } from "../../api/endpoints";

export default function OwnerLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({ gmail: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const payload = {
        gmail: values.gmail.trim(),
        password: values.password,
      };
      const res = await fetch(ENDPOINTS.loginOwner, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Đăng nhập thất bại. Vui lòng thử lại.");
      }

      const ownerId =
        data.result?.ownerId ||
        data.ownerId ||
        data.result?.id ||
        data.result?.accountId ||
        "";
      if (ownerId) {
        localStorage.setItem("ownerId", ownerId);
      }

      setSuccess("Đăng nhập thành công! Đang chuyển hướng...");
      setTimeout(() => {
        window.location.assign("/owner");
      }, 800);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi đăng nhập.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="owner-form" onSubmit={handleSubmit}>
      {error && <p className="form-error">{error}</p>}
      {success && <p className="form-success">{success}</p>}

      <div className="field">
        <label htmlFor="gmail">Gmail</label>
        <div className="input-wrap">
          <input
            id="gmail"
            name="gmail"
            type="email"
            placeholder="Nhập gmail"
            value={values.gmail}
            onChange={handleChange}
            required
            disabled={loading}
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
            disabled={loading}
          />
          <button
            type="button"
            className="eye-btn"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            disabled={loading}
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

      <button type="submit" className="btn primary" disabled={loading}>
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>

      <p className="signup-note">
        Bạn muốn quản lý sân dễ dàng?{" "}
        <a className="link-accent" href="/manager-register">
          Đăng ký!
        </a>
      </p>
    </form>
  );
}
