'use client';

import { useState } from 'react';
import ForgotPasswordForm from '../_components/ForgotPasswordForm';
import ConfirmPasswordResetForm from '../_components/ConfirmPasswordResetForm';
import UpdatePasswordForm from '../_components/UpdatePasswordForm';
import PasswordUpdated from '../_components/PasswordUpdated';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');

  const handleForgotPasswordSuccess = (email: string) => {
    setEmail(email);
    setStep(2);
  };

  const handleOtpSuccess = (otp: string) => {
    setOtp(otp);
    setStep(3);
  };

  const handleUpdatePasswordSuccess = () => {
    setStep(4);
  };

  return (
    <>
      {step === 1 && (
        <ForgotPasswordForm onSuccess={handleForgotPasswordSuccess} />
      )}
      {step === 2 && (
        <ConfirmPasswordResetForm email={email} onSuccess={handleOtpSuccess} />
      )}
      {step === 3 && (
        <UpdatePasswordForm
          email={email}
          otp={otp}
          onSuccess={handleUpdatePasswordSuccess}
        />
      )}
      {step === 4 && <PasswordUpdated />}
    </>
  );
}
