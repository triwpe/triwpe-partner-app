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

import { signIn } from "next-auth/react";
import React, { useState } from "react";
import Link from "next/link";
import { signInSchema } from "@/lib/zod";
import FormAlert from "./FormAlert";

interface SignInFormProps {
  onSuccess: (data: {
    email?: string;
    needsEmailConfirmation: boolean;
  }) => void;
}

export default function SignInForm({ onSuccess }: SignInFormProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

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
      const signInResult = await signIn("credentials", {
        username: email,
        password: password,
        redirect: false,
      });

      if (signInResult?.error) {
        switch (signInResult.code) {
          case "INVALID_CREDENTIALS":
            setSignInError(
              "Incorrect username or password. Please try again or click 'Forgot password' to reset it."
            );
            break;
          case "EMAIL_NOT_VERIFIED":
            onSuccess({ email, needsEmailConfirmation: true });
            break;
          default:
            setSignInError("Something went wrong");
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
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-2xl">Welcome Back! 👋🏻</CardTitle>
          <CardDescription className="text-base">
            Sign in to access your partner portal and let&apos;s get started!
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
            <div className="flex items-center">
              <Link
                href="/forgot-password"
                className="ml-auto inline-block text-sm underline"
              >
                Forgot password?
              </Link>
            </div>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            New here?{" "}
            <Link href="/sign-up" className="underline">
              Create an account
            </Link>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
