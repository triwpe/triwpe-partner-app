"use client";

import { useState } from "react";
import SignInForm from "../_components/SignInForm";
import ConfirmEmailForm from "../_components/ConfirmEmailForm";
import EmailConfirmed from "../_components/EmailConfirmed";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>("");

  const handleLoginSuccess = ({
    email,
    needsEmailConfirmation,
  }: {
    email?: string;
    needsEmailConfirmation: boolean;
  }) => {
    if (needsEmailConfirmation && email) {
      setEmail(email);
      setStep(2);
    } else {
      router.replace("/dashboard");
    }
  };

  const handleOtpSuccess = () => {
    setStep(3);
  };

  const handleContinue = () => {
    setStep(1);
    setEmail("");
  };

  return (
    <div>
      {step === 1 && <SignInForm onSuccess={handleLoginSuccess} />}
      {step === 2 && (
        <ConfirmEmailForm email={email} onSuccess={handleOtpSuccess} />
      )}
      {step === 3 && <EmailConfirmed onContinue={handleContinue} />}
    </div>
  );
}
