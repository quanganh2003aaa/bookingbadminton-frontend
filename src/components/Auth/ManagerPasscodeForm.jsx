import React from "react";

export default function ManagerPasscodeForm({
  activeStep = 3,
  value,
  onChange,
  onResend,
  onSubmit,
  onBack,
  loading = false,
  error = "",
  success = "",
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit();
  };

  const handleChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 6);
    onChange && onChange(cleaned);
  };

  return (
    <form className="manager-form" onSubmit={handleSubmit}>
      <div className="steps">
        <div className="step completed">
          <span className="step-number">1</span>
          <span className="step-line" />
        </div>
        <div className="step completed">
          <span className="step-number">2</span>
          <span className="step-line" />
        </div>
        <div className={`step ${activeStep === 3 ? "active" : ""}`}>
          <span className="step-number">3</span>
        </div>
      </div>

      {error && <p className="form-error">{error}</p>}
      {success && <p className="form-success">{success}</p>}

      <div className="passcode-row">
        <div className="field full">
          <label htmlFor="passcode">Passcode</label>
          <div className="input-wrap">
            <input
            id="passcode"
            name="passcode"
            type="text"
            inputMode="numeric"
            maxLength={6}
            pattern="[0-9]{6}"
            placeholder="Nhập mã passcode gồm 6 số"
            value={value}
              onChange={handleChange}
            required
          />
          </div>
        </div>
        <button
          type="button"
          className="btn primary resend"
          onClick={() => onResend && onResend()}
          disabled={loading}
        >
          Gửi lại
        </button>
      </div>

      <div className="passcode-note">
        <p>Passcode được gửi tới gmail đăng ký của bạn. Nhấn gửi lại nếu không nhận được.</p>
      </div>

      <div className="manager-actions">
        <button
          type="button"
          className="back-link"
          onClick={(e) => {
            e.preventDefault();
            onBack && onBack();
          }}
        >
          Quay lại
        </button>
        <button type="submit" className="btn primary full" disabled={loading}>
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
      </div>

      <p className="signup-note">
        Bạn đã có tài khoản quản lý?{" "}
        <a className="link-accent" href="/owner-login">
          Đăng nhập!
        </a>
      </p>
    </form>
  );
}
