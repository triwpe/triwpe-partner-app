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
    <Card className="w-full md:w-[576px] py-5 px-7 text-[#344054] shadow-none border-[#e0e0e0] rounded-md">
      <form onSubmit={handleSubmit}>
        <CardHeader className="w-full">
          <CardTitle className="text-2xl">Forgot Something? 🔑</CardTitle>
          <CardDescription className="text-base text-[#969696]">
            No worries! Let&apos;s reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <div className="grid gap-8">
            {signUpError && <FormAlert message={signUpError} />}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div>
                <Input
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`h-14 border-[#d9d9d9] text-[#535773] focus-visible:ring-0 focus-visible:ring-transparent ${
                    formErrors.some((error) => error.for === 'email')
                      ? 'border-red-600'
                      : ''
                  }`}
                />
                {formErrors.find((error) => error.for === 'email') && (
                  <div className="mt-1 ml-1 text-xs text-red-600">
                    {formErrors.find((error) => error.for === 'email')?.message}
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-4">
              <Button
                className="w-full h-14 bg-[#1fd79b] text-[#344054] text-base hover:bg-[#1fd79b]"
                type="submit"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset Password
              </Button>
              <Button
                className="w-full h-14 bg-transparent text-[#535773] text-base hover:bg-transparent"
                type="button"
                variant="link"
                asChild
              >
                <Link href="/sign-in">Back to Login</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
