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

import { signUp as signUpAction } from "@/actions/partner";
import React, { useState } from "react";
import Link from "next/link";
import { signUpSchema } from "@/lib/zod";
import FormAlert from "./FormAlert";

interface SignInFormProps {
  onSuccess: (email: string) => void;
}

export default function SignInForm({ onSuccess }: SignInFormProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

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
      const result = await signUpAction(email, password);

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
    <Card className="mx-auto max-w-md p-6 border-gray-50 shadow-lg">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-2xl">Join the Crew! 🚀</CardTitle>
          <CardDescription className="text-base">
            Create your account and become part of the journey!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {signUpError && <FormAlert message={signUpError} />}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`${
                  formErrors.some((error) => error.for === "password")
                    ? "border-red-600"
                    : ""
                }`}
              />
              <div className="mt-1 ml-1 text-xs text-red-600">
                {formErrors.find((error) => error.for === "password")?.message}
              </div>
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign Up
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/sign-in" className="underline">
              Sign in instead
            </Link>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
