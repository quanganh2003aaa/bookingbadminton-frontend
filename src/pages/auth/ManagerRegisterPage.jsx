import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./manager-register.css";
import ManagerRegisterForm from "../../components/auth/ManagerRegisterForm";
import ManagerVenueForm from "../../components/auth/ManagerVenueForm";
import ManagerPasscodeForm from "../../components/auth/ManagerPasscodeForm";
import { ENDPOINTS } from "../../api/endpoints";

const managerRegisterBg =
  "https://images.unsplash.com/photo-1512446816042-444d641267d4?auto=format&fit=crop&w=1600&q=80";
const heroAlt = "Nền cầu lông";
const blankState = { loading: false, error: "", success: "" };

const getOwnerFromCookie = () => {
  try {
    const raw =
      (document.cookie
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith("userInfo=")) || ""
      ).split("=")[1] || "";
    return raw ? JSON.parse(decodeURIComponent(raw)) : {};
  } catch {
    return {};
  }
};

export default function ManagerRegisterPage() {
  const [searchParams] = useSearchParams();
  const ownerCookie = useMemo(getOwnerFromCookie, []);
  const isOwnerContext = Boolean(ownerCookie?.userId);

  const initialStep = 1;

  const autoRegister = useMemo(
    () =>
      isOwnerContext
        ? {
            ownerName: ownerCookie?.username || ownerCookie?.name || "",
            phone: ownerCookie?.msisdn || ownerCookie?.phone || "",
            email: ownerCookie?.email || ownerCookie?.gmail || "",
            password: "",
            confirmPassword: "",
          }
        : { ownerName: "", phone: "", email: "", password: "", confirmPassword: "" },
    [isOwnerContext, ownerCookie]
  );

  const [step, setStep] = useState(initialStep);
  const [registerValues, setRegisterValues] = useState(autoRegister);
  const [venueValues, setVenueValues] = useState({
    name: "",
    address: "",
    phone: "",
    mapLink: "",
    imgQr: "",
  });
  const [uploads, setUploads] = useState([]);
  const [passcode, setPasscode] = useState("");
  const [accountId, setAccountId] = useState(ownerCookie?.userId || "");
  const [passcodeState, setPasscodeState] = useState(blankState);
  const [confirmState, setConfirmState] = useState(blankState);

  const sendPasscode = async (targetVenueValues = venueValues) => {
    setPasscodeState({ ...blankState, loading: true });
    try {
      const phoneNumber = ownerCookie?.msisdn || registerValues.phone;
      const payload = {
        name: targetVenueValues.name,
        address: targetVenueValues.address,
        mobileContact: targetVenueValues.phone,
        gmail: (ownerCookie?.email || ownerCookie?.gmail || registerValues.email || "").trim(),
        password: registerValues.password,
        msiSdn: phoneNumber,
        msisdn: phoneNumber,
        active: "PENDING",
        nameOwner: registerValues.ownerName || ownerCookie?.username || ownerCookie?.name || "",
        linkMap: targetVenueValues.mapLink,
      };

      const res = await fetch(ENDPOINTS.registerOwner, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const conflictMsg =
          res.status === 409
            ? "Email đã được đăng ký. Vui lòng dùng thông tin khác."
            : "";
        throw new Error(conflictMsg || data.message || "Gửi OTP thất bại. Vui lòng thử lại.");
      }
      const newAccountId = data?.result?.accountId || data?.data?.accountId || data?.accountId || "";
      if (newAccountId) setAccountId(newAccountId);
      if (!newAccountId && ownerCookie?.userId) setAccountId(ownerCookie.userId);
      setPasscodeState({
        loading: false,
        error: "",
        success: data?.message || "OTP đã được gửi tới email của bạn.",
      });
      setStep(3);
    } catch (err) {
      setPasscodeState({ loading: false, error: err.message, success: "" });
    }
  };

  const handleVenueNext = async (vals) => {
    setVenueValues((prev) => ({
      ...prev,
      ...vals,
      imgQr: vals.imgQr || uploads[0]?.dataUrl || uploads[0]?.url || prev.imgQr,
    }));
    const mergedVenue = {
      ...venueValues,
      ...vals,
      imgQr: vals.imgQr || uploads[0]?.dataUrl || uploads[0]?.url || venueValues.imgQr,
    };
    await sendPasscode(mergedVenue);
  };

  const handleConfirmRegister = async () => {
    const trimmedCode = passcode.trim();
    setConfirmState({ ...blankState, loading: true });
    if (!trimmedCode) {
      setConfirmState({ ...blankState, error: "Vui lòng nhập OTP." });
      return;
    }

    try {
      const email = (ownerCookie?.email || ownerCookie?.gmail || registerValues.email || "").trim();
      const formData = new FormData();
      formData.append(
        "request",
        JSON.stringify({
          email,
          otp: trimmedCode,
        })
      );
      const qrFile = uploads[0]?.file;
      if (qrFile instanceof Blob) {
        formData.append("file", qrFile, qrFile.name || "qr.png");
      }

      const res = await fetch(ENDPOINTS.verifyOtpRegister, {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Xác thực OTP thất bại.");
      }

      const successMessage = data?.message
        ? data.message
        : isOwnerContext
        ? "Đăng ký thêm sân thành công! Đang chuyển về trang chủ owner..."
        : "Đăng ký thành công! Đang chuyển đến đăng nhập...";
      setConfirmState({
        ...blankState,
        success: successMessage,
      });
      setTimeout(() => {
        window.location.assign(isOwnerContext ? "/owner" : "/login");
      }, 900);
    } catch (err) {
      setConfirmState({ loading: false, error: err.message, success: "" });
    }
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <ManagerRegisterForm
          activeStep={1}
          values={registerValues}
          onChange={setRegisterValues}
          allowEditAccount={!isOwnerContext ? true : false}
          showLoginHint={!isOwnerContext}
          onNext={() => setStep(2)}
        />
      );
    }
    if (step === 2) {
      return (
        <ManagerVenueForm
          activeStep={2}
          values={venueValues}
          onChange={setVenueValues}
          uploads={uploads}
          onUploadsChange={setUploads}
          onNext={handleVenueNext}
          loading={passcodeState.loading}
          error={passcodeState.error}
          onBack={() => setStep(1)}
          allowBack
        />
      );
    }
    return (
      <ManagerPasscodeForm
        activeStep={3}
        value={passcode}
        onChange={setPasscode}
        onBack={() => setStep(2)}
        loading={confirmState.loading}
        success={confirmState.success}
        error={confirmState.error}
        onSubmit={handleConfirmRegister}
      />
    );
  };

  return (
    <div className="manager-register-page" style={{ backgroundImage: `url(${managerRegisterBg})` }}>
      <div className="manager-register-overlay" />
      <div className="manager-register-shell">
        <div className="manager-register-hero">
          <p className="eyebrow">Đăng ký sân</p>
          <h1>Trở thành đối tác quản lý sân</h1>
          <p className="sub">
            Thêm sân mới vào tài khoản owner đang đăng nhập. Thông tin chủ sân được lấy từ tài khoản hiện tại, bạn chỉ cần nhập mật khẩu để xác nhận.
          </p>
        </div>

        <div className="manager-register-card">
          <div className="card-left">
            <img src={managerRegisterBg} alt={heroAlt} />
          </div>
          <div className="card-right">{renderStep()}</div>
        </div>
      </div>
    </div>
  );
}
