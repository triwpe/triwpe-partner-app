"use client";

import { useState } from "react";
import SignInForm from "../_components/SignUpForm";
import ConfirmEmailForm from "../_components/ConfirmEmailForm";
import EmailConfirmed from "../_components/EmailConfirmed";

export default function SignUpPage() {
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");

  const handleSignUpSuccess = (email: string) => {
    setEmail(email);
    setStep(2);
  };

  const handleOtpSuccess = () => {
    setStep(3);
  };

  return (
    <div>
      {step === 1 && <SignInForm onSuccess={handleSignUpSuccess} />}
      {step === 2 && (
        <ConfirmEmailForm email={email} onSuccess={handleOtpSuccess} />
      )}
      {step === 3 && <EmailConfirmed />}
    </div>
  );
}
