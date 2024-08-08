"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

import { resetPassword as resetPasswordAction } from "@/actions/partner";
import React, { useState } from "react";
import Link from "next/link";
import { forgotPasswordSchema } from "@/lib/zod";
import FormAlert from "./FormAlert";

interface ForgotPasswordFormProps {
  onSuccess: (email: string) => void;
}

export default function ForgotPasswordForm({
  onSuccess,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState<string>("");

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
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Something? 🔑</CardTitle>
          <CardDescription className="text-base">
            No worries! Let&apos;s reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-8">
            {signUpError && <FormAlert message={signUpError} />}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`${
                  formErrors.some((error) => error.for === "email")
                    ? "border-red-600"
                    : ""
                }`}
              />
              <div className="mt-1 ml-1 text-xs text-red-600">
                {formErrors.find((error) => error.for === "email")?.message}
              </div>
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
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
