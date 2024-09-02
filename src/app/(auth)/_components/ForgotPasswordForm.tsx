'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

import { resetPassword as resetPasswordAction } from '@/actions/partner';
import React, { useState } from 'react';
import Link from 'next/link';
import { forgotPasswordSchema } from '@/lib/zod';
import FormAlert from './FormAlert';
import { TwInput } from '@/components/auth/Input';

interface ForgotPasswordFormProps {
  onSuccess: (email: string) => void;
}

export default function ForgotPasswordForm({
  onSuccess,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<any[]>([]);
  const [signUpError, setSignUpError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setFormErrors([]);
    setSignUpError(null);

    const response = await forgotPasswordSchema.safeParseAsync({
      email: email,
    });

    if (response.success) {
      const result = await resetPasswordAction(email);

      if (result?.message) {
        setSignUpError(result.message);
      } else {
        onSuccess(email);
      }
    } else {
      await addError(response.error);
    }
    setIsLoading(false);
  };

  const addError = async (error: any) => {
    let errArr: any[] = [];
    const { errors: err } = error;
    for (var i = 0; i < err.length; i++) {
      errArr.push({ for: err[i].path[0], message: err[i].message });
    }
    setFormErrors(errArr);
  };

  return (
    <Card className="mx-auto max-w-md p-4 border-gray-50 shadow-lg">
      <form onSubmit={handleSubmit} autoComplete="off">
        <CardHeader>
          <CardTitle className="text-2xl text-[#344054]">
            Forgot Something? 🔑
          </CardTitle>
          <CardDescription className="text-base text-[#344054]">
            No worries! Let&apos;s reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8">
            {signUpError && <FormAlert message={signUpError} />}
            <TwInput
              label="Email"
              name="email"
              value={email}
              placeholder="Enter your email"
              errorMessage={
                formErrors.find((error) => error.for === 'password')?.message
              }
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              className="w-full"
              type="submit"
              variant="triwpe_primary"
              size="triwpe_large"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset Password
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            <Button className="w-full" type="button" variant="link" asChild>
              <Link href="/sign-in">Back to Login</Link>
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
