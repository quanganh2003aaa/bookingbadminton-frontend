import React, { useState } from "react";
import { FiCheck } from "react-icons/fi";

export default function ManagerVenueForm({
  onNext,
  onBack,
  activeStep = 2,
  values,
  onChange,
  uploads,
  onUploadsChange,
}) {
  const fileInputRef = React.useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange && onChange((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext && onNext(values);
  };

  const handlePickFiles = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    onUploadsChange &&
      onUploadsChange((prev) => {
        const existingNames = new Set(prev.map((f) => f.name));
        const mapped = files
          .filter((f) => !existingNames.has(f.name))
          .map((f) => ({
            name: f.name,
            status: "Đăng tải xong",
          }));
        return [...prev, ...mapped];
      });
    e.target.value = "";
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

      <div className="manager-grid">
        <div className="manager-grid-left">
          <div className="field">
            <label htmlFor="name">Tên sân</label>
            <div className="input-wrap">
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Nhập tên sân của bạn"
            value={values.name}
            maxLength={255}
            onChange={handleChange}
            required
          />
            </div>
          </div>

          <div className="field">
            <label htmlFor="address">Địa chỉ</label>
            <div className="input-wrap">
              <input
                id="address"
                name="address"
                type="text"
                placeholder="Nhập địa chỉ sân"
                value={values.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="phone">Số điện thoại liên hệ</label>
            <div className="input-wrap">
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Nhập số điện thoại liên hệ của sân"
            value={values.phone}
            pattern="(0|\\+84)[0-9]{9}"
            maxLength={12}
            inputMode="tel"
            title="Số điện thoại Việt Nam bắt đầu bằng 0 hoặc +84, gồm 10 chữ số"
            onChange={handleChange}
            required
          />
            </div>
          </div>
        </div>

        <div className="manager-grid-right">
          <div className="upload-card">
            <p className="upload-title">Đăng tải ảnh sân</p>
            <div
              className="upload-drop"
              role="button"
              tabIndex={0}
              onClick={handlePickFiles}
              onKeyDown={(e) => e.key === "Enter" && handlePickFiles()}
            >
              <span className="upload-icon">↥</span>
              <span className="upload-text">Click to upload</span>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFiles}
            />
            <div className="upload-list">
              {uploads.map((file) => (
                <div key={file.name} className="upload-item">
                  <div>
                    <div className="upload-name">{file.name}</div>
                    <div className="upload-status">{file.status}</div>
                  </div>
                  <FiCheck className="upload-check" />
                </div>
              ))}
            </div>
          </div>
        </div>
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
          Bước tiếp theo
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
