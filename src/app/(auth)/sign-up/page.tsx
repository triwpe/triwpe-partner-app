'use client';

import { useState } from 'react';
import SignUpForm from '../_components/SignUpForm';
import ConfirmEmailForm from '../_components/ConfirmEmailForm';
import EmailConfirmed from '../_components/EmailConfirmed';
import BusinessAndPreferencesForm from '../_components/BusinessAndPreferencesForm';
import { PartnerDetailsCreateModel } from '@/types/models/partner-details';
import { set } from 'zod';
import { PartnerCreateModel } from '@/types/models/partner';

export default function SignUpPage() {
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>('');
  const [partner, setPartner] = useState<PartnerCreateModel | null>(null);
  const [partnerDetails, setPartnerDetails] =
    useState<PartnerDetailsCreateModel | null>(null);

  const handlePartnerDetailsSuccess = async (
    data: PartnerDetailsCreateModel,
  ) => {
    setPartnerDetails(data);
    setStep(2);
  };

  const handleSignUpSuccess = (data: PartnerCreateModel) => {
    setPartner(data);
    setStep(3);
  };

  const handleBackPartnerDetails = (data: PartnerCreateModel) => {
    setPartner(data);
    setStep(1);
  };

  const handleOtpSuccess = () => {
    setStep(4);
  };

  return (
    <div>
      {step === 1 && (
        <BusinessAndPreferencesForm
          partnerDetails={partnerDetails}
          onSuccess={handlePartnerDetailsSuccess}
        />
      )}
      {step === 2 && (
        <SignUpForm
          partner={partner}
          onSuccess={handleSignUpSuccess}
          onBack={handleBackPartnerDetails}
        />
      )}
      {step === 3 && (
        <ConfirmEmailForm
          email={partner?.email || ''}
          onSuccess={handleOtpSuccess}
        />
      )}
      {step === 4 && <EmailConfirmed />}
    </div>
  );
}
