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

import { signUp as signUpAction } from '@/actions/partner';
import React, { useState } from 'react';
import Link from 'next/link';
import { signUpSchema } from '@/lib/zod';
import FormAlert from './FormAlert';
import { PartnerCreateModel } from '@/types/models/partner';
import { PartnerDetailCreateModel } from '@/types/models/partner-details';

interface SignUpFormProps {
  partner: PartnerCreateModel | null;
  partnerDetails: PartnerDetailCreateModel | null;
  onSuccess: (data: PartnerCreateModel) => void;
  onBack: (data: PartnerCreateModel) => void;
}

export default function SignUpForm({
  partner,
  partnerDetails,
  onSuccess,
  onBack,
}: SignUpFormProps) {
  const [email, setEmail] = useState<string>(partner?.email || '');
  const [password, setPassword] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<any[]>([]);
  const [signUpError, setSignUpError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setFormErrors([]);
    setSignUpError(null);

    const response = await signUpSchema.safeParseAsync({
      email: email,
      password: password,
    });

    if (response.success) {
      if (!partnerDetails) {
        setIsLoading(false);
        return;
      }

      const data: PartnerCreateModel = {
        email: email,
        password: password,
        detail: partnerDetails,
      };

      const { success, message } = await signUpAction(data);

      if (!success) {
        setSignUpError(message as string);
      } else {
        onSuccess(data);
      }
    } else {
      await addError(response.error);
    }
    setIsLoading(false);
  };

  const handleBack = async () => {
    if (!partnerDetails) {
      return;
    }

    const data: PartnerCreateModel = {
      email: email,
      password: password,
      detail: partnerDetails,
    };
    onBack(data);
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
    <>
      <Card className="w-full md:w-[576px] py-5 px-7 text-[#344054] shadow-none border-[#e0e0e0] rounded-md">
        <form onSubmit={handleSubmit} autoComplete="off">
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span className="text-2xl">Join the Crew! ✈️</span>
              <span className="text-base text-[#969696] font-medium">
                Step 2 of 2
              </span>
            </CardTitle>
            <CardDescription className="text-base text-[#969696]">
              Set up your login details to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8">
              {signUpError && <FormAlert message={signUpError} />}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div>
                  <Input
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`h-14 border-[#d9d9d9] text-[#535773] focus-visible:ring-0 focus-visible:ring-transparent ${
                      formErrors.some((error) => error.for === 'email')
                        ? 'border-red-600'
                        : ''
                    }`}
                  />
                  {formErrors.find((error) => error.for === 'email') && (
                    <div className="mt-1 ml-1 text-xs text-red-600">
                      {
                        formErrors.find((error) => error.for === 'email')
                          ?.message
                      }
                    </div>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`h-14 border-[#d9d9d9] text-[#535773] focus-visible:ring-0 focus-visible:ring-transparent ${
                      formErrors.some((error) => error.for === 'password')
                        ? 'border-red-600'
                        : ''
                    }`}
                  />
                  {formErrors.find((error) => error.for === 'password') && (
                    <div className="mt-1 ml-1 text-xs text-red-600">
                      {
                        formErrors.find((error) => error.for === 'password')
                          ?.message
                      }
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
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sign Up
                </Button>
                <Button
                  className="w-full h-14 bg-transparent text-[#535773] text-base hover:bg-transparent"
                  type="button"
                  onClick={handleBack}
                >
                  Back
                </Button>
              </div>
            </div>
          </CardContent>
        </form>
      </Card>
      <div className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link href="/sign-in" className="underline font-medium text-[#0154b3]">
          Sign in instead
        </Link>
      </div>
    </>
  );
}
