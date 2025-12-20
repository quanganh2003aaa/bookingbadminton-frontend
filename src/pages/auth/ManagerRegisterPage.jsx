import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./manager-register.css";
import ManagerRegisterForm from "../../components/auth/ManagerRegisterForm";
import ManagerVenueForm from "../../components/auth/ManagerVenueForm";
import ManagerPasscodeForm from "../../components/auth/ManagerPasscodeForm";
import { ENDPOINTS } from "../../api/endpoints";

const managerRegisterBg =
  "https://images.unsplash.com/photo-1512446816042-444d641267d4?auto=format&fit=crop&w=1600&q=80";

export default function ManagerRegisterPage() {
  const [searchParams] = useSearchParams();

  const autoPrefill = searchParams.get("auto") === "1";
  const initialStep = searchParams.get("step") === "2" ? 2 : 1;

  const autoRegister = useMemo(
    () =>
      autoPrefill
        ? {
            phone: "0987654321",
            email: "owner@example.com",
            password: "12345678",
            confirmPassword: "12345678",
          }
        : { phone: "", email: "", password: "", confirmPassword: "" },
    [autoPrefill]
  );

  const [step, setStep] = useState(initialStep);
  const [registerValues, setRegisterValues] = useState(autoRegister);
  const [venueValues, setVenueValues] = useState({
    name: "",
    address: "",
    phone: "",
    mapLink: "",
  });
  const [uploads, setUploads] = useState([]);
  const [passcode, setPasscode] = useState("");
  const [accountId, setAccountId] = useState("");
  const [passcodeState, setPasscodeState] = useState({ loading: false, error: "", success: "" });
  const [confirmState, setConfirmState] = useState({ loading: false, error: "", success: "" });

  const sendPasscode = async () => {
    setPasscodeState({ loading: true, error: "", success: "" });
    try {
      const payload = {
        account: {
          password: registerValues.password,
          gmail: registerValues.email.trim(),
          msisdn: registerValues.phone,
        },
      };
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
    await sendPasscode();
  };

  const handleConfirmRegister = async () => {
    setConfirmState({ loading: true, error: "", success: "" });
    if (!passcode || passcode.length !== 6) {
      setConfirmState({
        loading: false,
        error: "Vui lòng nhập passcode gồm 6 số.",
        success: "",
      });
      return;
    }
    if (!accountId) {
      setConfirmState({
        loading: false,
        error: "Không tìm thấy tài khoản, vui lòng gửi lại passcode.",
        success: "",
      });
      return;
    }

    try {
      const payload = {
        accountId,
        code: passcode,
        register: {
          name: venueValues.name,
          address: venueValues.address,
          mobileContact: venueValues.phone,
          linkMap: venueValues.mapLink,
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
        loading: false,
        error: "",
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
        <img src={managerRegisterBg} alt="Nền cầu lông" />
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
