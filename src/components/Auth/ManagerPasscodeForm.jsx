import React from "react";

export default function ManagerPasscodeForm({
  activeStep = 3,
  value,
  onChange,
  onResend,
  onSubmit,
  onBack,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit();
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
            pattern="\\d{6}"
            placeholder="Nhập mã passcode gồm 6 số"
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            required
          />
          </div>
        </div>
        <button
          type="button"
          className="btn primary resend"
          onClick={() => onResend && onResend()}
        >
          Gửi lại
        </button>
      </div>

      <div className="passcode-note">
        <p>
          Passcode được gửi tới gmail đăng ký của bạn. Nhấn gửi lại, nếu không
          nhận được passcode.
        </p>
        <p>
          Sau khi hoàn tất đăng ký, tài khoản của bạn sẽ được hệ thống kiểm
          duyệt trong 1-2 ngày làm việc trước khi cấp phép hoạt động.
        </p>
        <p>
          Kết quả xét duyệt sẽ được gửi qua email đã đăng ký. Khi được phê
          duyệt, bạn có thể bắt đầu quản lý và đăng tải thông tin sân thể thao
          trên hệ thống.
        </p>
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
        <button type="submit" className="btn primary full">
          Đăng ký
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
