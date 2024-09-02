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

import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import Link from 'next/link';
import { signInSchema } from '@/lib/zod';
import FormAlert from './FormAlert';
import { TwInput } from '@/components/auth/Input';

interface SignInFormProps {
  onSuccess: (data: {
    email?: string;
    needsEmailConfirmation: boolean;
  }) => void;
}

export default function SignInForm({ onSuccess }: SignInFormProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<any[]>([]);
  const [signUpError, setSignInError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setFormErrors([]);
    setSignInError(null);

    const response = await signInSchema.safeParseAsync({
      email: email,
      password: password,
    });

    if (response.success) {
      const signInResult = await signIn('credentials', {
        username: email,
        password: password,
        redirect: false,
      });

      if (signInResult?.error) {
        switch (signInResult.code) {
          case 'INVALID_CREDENTIALS':
            setSignInError(
              "Incorrect username or password. Please try again or click 'Forgot password' to reset it.",
            );
            break;
          case 'EMAIL_NOT_VERIFIED':
            onSuccess({ email, needsEmailConfirmation: true });
            break;
          default:
            setSignInError('Something went wrong');
            break;
        }
      } else {
        onSuccess({ needsEmailConfirmation: false });
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
    <Card className="mx-auto max-w-md p-6 border-gray-50 shadow-lg">
      <form onSubmit={handleSubmit} autoComplete="off">
        <CardHeader>
          <CardTitle className="text-2xl text-[#344054]">
            Welcome Back! 👋🏻
          </CardTitle>
          <CardDescription className="text-base text-[#344054]">
            Sign in to access your partner portal and let&apos;s get started!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {signUpError && <FormAlert message={signUpError} />}
            <TwInput
              label="Email"
              name="email"
              value={email}
              placeholder="Enter your email"
              errorMessage={
                formErrors.find((error) => error.for === 'email')?.message
              }
              onChange={(e) => setEmail(e.target.value)}
            />
            <TwInput
              label="Password"
              name="password"
              type="password"
              value={password}
              placeholder="Enter your password"
              errorMessage={
                formErrors.find((error) => error.for === 'password')?.message
              }
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex items-center">
              <Link
                href="/forgot-password"
                className="ml-auto inline-block text-sm text-[#006ae0] font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <Button
              className="w-full"
              variant="triwpe_primary"
              size="triwpe_large"
              type="submit"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </div>
          <div className="mt-4 text-center text-sm text-[#344054]">
            New here?{' '}
            <Link href="/sign-up" className="text-[#006ae0] font-medium">
              Create an account
            </Link>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
