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

import { updatePassword as updatePasswordAction } from '@/actions/partner';
import React, { useState } from 'react';
import Link from 'next/link';
import { updatePasswordSchema } from '@/lib/zod';
import FormAlert from './FormAlert';

interface UpdatePasswordFormProps {
  email: string;
  otp: string;
  onSuccess: () => void;
}

export default function UpdatePasswordForm({
  email,
  otp,
  onSuccess,
}: UpdatePasswordFormProps) {
  const [password, setPassword] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<any[]>([]);
  const [updatePasswordError, setSignUpError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setFormErrors([]);
    setSignUpError(null);

    const response = await updatePasswordSchema.safeParseAsync({
      password: password,
    });

    if (response.success) {
      const result = await updatePasswordAction(email, otp, password);

      if (result?.message) {
        setSignUpError(result.message);
      } else {
        onSuccess();
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
      <form onSubmit={handleSubmit} autoComplete="off">
        <CardHeader>
          <CardTitle className="text-2xl">Set Your New Password! 🔐</CardTitle>
          <CardDescription className="text-base text-[#969696]">
            Create a new password to regain access to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {updatePasswordError && <FormAlert message={updatePasswordError} />}
            <div className="grid gap-2">
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                className={`h-14 border-[#d9d9d9] text-[#535773] focus-visible:ring-0 focus-visible:ring-transparent ${
                  formErrors.some((error) => error.for === 'password')
                    ? 'border-red-600'
                    : ''
                }`}
              />
              <div className="mt-1 ml-1 text-xs text-red-600">
                {formErrors.find((error) => error.for === 'password')?.message}
              </div>
            </div>
            <Button
              className="w-full h-14 bg-[#1fd79b] text-[#344054] text-base hover:bg-[#1fd79b]"
              type="submit"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset Password
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
