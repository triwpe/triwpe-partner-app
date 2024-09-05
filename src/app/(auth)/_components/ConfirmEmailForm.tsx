'use client';

import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import React, { useState } from 'react';
import { confirmEmailOtpSchema } from '@/lib/zod';
import { confirmEmail as confirmEmailAction } from '@/actions/partner';
import router from 'next/navigation';
import Link from 'next/link';
import ResendEmailConfirmationCode from './ResendEmailConfirmationCode';
import FormAlert from './FormAlert';

interface ConfirmEmailFormProps {
  email: string;
  onSuccess: () => void;
}

export default function ConfirmEmailForm({
  email,
  onSuccess,
}: ConfirmEmailFormProps) {
  const [otp, setOtp] = useState('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirmEmailError, setConfirmEmailError] = useState<string | null>(
    null,
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setConfirmEmailError(null);

    const result = await confirmEmailAction(email, otp);
    if (result?.message) {
      setConfirmEmailError(result.message);
    } else {
      onSuccess();
    }

    setIsLoading(false);
  };

  return (
    <Card className="w-full md:w-[576px] py-5 px-7 text-[#344054] shadow-none border-[#e0e0e0] rounded-md">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-2xl">Verify Your Email! 📫</CardTitle>
          <CardDescription className="text-base text-[#969696]">
            Enter the 6-digit code sent to your inbox to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8">
            <div className="grid items-center justify-center">
              <InputOTP
                maxLength={6}
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              {confirmEmailError && (
                <div className="text-center text-sm mt-2 text-red-500">
                  The code is invalid, please check and try again.
                </div>
              )}
            </div>
            <Button
              className="w-full h-14 bg-[#1fd79b] text-[#344054] text-base hover:bg-[#1fd79b]"
              type="submit"
              disabled={isLoading || otp.length < 6}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Code
            </Button>
          </div>
          <ResendEmailConfirmationCode email={email} />
        </CardContent>
      </form>
    </Card>
  );
}
