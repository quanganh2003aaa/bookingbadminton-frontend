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

const getStoredOwner = () => {
  try {
    const raw = localStorage.getItem("ownerAccount");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export default function ManagerRegisterPage() {
  const [searchParams] = useSearchParams();
  const storedOwner = useMemo(getStoredOwner, []);
  const isOwnerContext = Boolean(storedOwner?.ownerId);

  const autoPrefill = searchParams.get("auto") === "1";
  const initialStep = searchParams.get("step") === "2" ? 2 : 1;

  const autoRegister = useMemo(
    () =>
      isOwnerContext
        ? {
            phone: storedOwner?.msisdn || "",
            email: storedOwner?.gmail || "",
            password: "",
            confirmPassword: "",
          }
        : autoPrefill
        ? {
            phone: "0987654321",
            email: "owner@example.com",
            password: "12345678",
            confirmPassword: "12345678",
          }
        : { phone: "", email: "", password: "", confirmPassword: "" },
    [autoPrefill, isOwnerContext, storedOwner?.gmail, storedOwner?.msisdn]
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
  const [accountId, setAccountId] = useState(storedOwner?.ownerId || "");
  const [passcodeState, setPasscodeState] = useState(blankState);
  const [confirmState, setConfirmState] = useState(blankState);

  const buildRegisterPayload = () => ({
    account: {
      password: registerValues.password,
      gmail: registerValues.email.trim(),
      msisdn: registerValues.phone,
    },
  });

  const sendPasscode = async () => {
    setPasscodeState({ ...blankState, loading: true });
    try {
      const payload = isOwnerContext
        ? {
            account: {
              ownerId: storedOwner?.ownerId,
              gmail: storedOwner?.gmail || registerValues.email.trim(),
              msisdn: storedOwner?.msisdn || registerValues.phone,
              password: registerValues.password,
            },
          }
        : buildRegisterPayload();
      const res = await fetch(ENDPOINTS.registerOwnerPasscode, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Gửi passcode thất bại. Vui lòng thử lại.");
      }
      const data = await res.json().catch(() => ({}));
      const newAccountId = data?.result?.accountId || data?.accountId || "";
      if (newAccountId) setAccountId(newAccountId);
      if (!newAccountId && storedOwner?.ownerId) setAccountId(storedOwner.ownerId);
      setPasscodeState({
        loading: false,
        error: "",
        success: "Passcode đã được gửi tới gmail của bạn.",
      });
      setStep(3);
    } catch (err) {
      setPasscodeState({ loading: false, error: err.message, success: "" });
    }
  };

  const handleVenueNext = async (vals) => {
    setVenueValues(vals);
    if (!vals.imgQr && uploads[0]?.url) {
      setVenueValues((prev) => ({ ...prev, imgQr: uploads[0].url }));
    }
    await sendPasscode();
  };

  const handleConfirmRegister = async () => {
    const trimmedCode = passcode.trim();
    setConfirmState({ ...blankState, loading: true });
    if (!trimmedCode || trimmedCode.length !== 6) {
      setConfirmState({ ...blankState, error: "Vui lòng nhập passcode gồm 6 số." });
      return;
    }
    if (!accountId) {
      setConfirmState({
        ...blankState,
        error: "Không tìm thấy tài khoản, vui lòng gửi lại passcode.",
      });
      return;
    }

    try {
      const payload = {
        accountId: accountId || storedOwner?.ownerId || "",
        ownerId: accountId || storedOwner?.ownerId || "",
        code: trimmedCode,
        register: {
          name: venueValues.name,
          address: venueValues.address,
          mobileContact: venueValues.phone,
          linkMap: venueValues.mapLink,
          imgQr: venueValues.imgQr || uploads[0]?.url || "",
        },
      };

      const res = await fetch(ENDPOINTS.registerOwnerConfirm, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Đăng ký quản lý thất bại.");
      }

      setConfirmState({
        ...blankState,
        success: "Đăng ký thành công! Đang chuyển đến đăng nhập...",
      });
      setTimeout(() => window.location.assign("/owner-login"), 900);
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
          allowEditAccount={!isOwnerContext}
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
        onResend={sendPasscode}
        onSubmit={handleConfirmRegister}
        loading={confirmState.loading}
        error={confirmState.error}
        success={confirmState.success || passcodeState.success}
        onBack={() => setStep(2)}
      />
    );
  };

  return (
    <div className="manager-register-page">
      <div className="manager-register-hero">
        <img src={managerRegisterBg} alt={heroAlt} />
      </div>
      <div className="manager-register-card">
        <div className="manager-heading">
          <h1>Đăng ký quản lý</h1>
          <p>Nhập thông tin cá nhân của bạn</p>
        </div>
        {renderStep()}
      </div>
    </div>
  );
}
