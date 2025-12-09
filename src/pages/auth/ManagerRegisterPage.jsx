import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./manager-register.css";
import ManagerRegisterForm from "../../components/auth/ManagerRegisterForm";
import ManagerVenueForm from "../../components/auth/ManagerVenueForm";
import ManagerPasscodeForm from "../../components/auth/ManagerPasscodeForm";

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
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      );
    }
    return (
      <ManagerPasscodeForm
        activeStep={3}
        value={passcode}
        onChange={setPasscode}
        onResend={() => console.log("Resend passcode")}
        onSubmit={() => console.log("Submit all", { registerValues, venueValues, uploads, passcode })}
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
