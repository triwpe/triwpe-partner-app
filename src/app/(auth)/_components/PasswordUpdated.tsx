"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import Link from "next/link";

export default function PasswordUpdated() {
  return (
    <Card className="mx-auto max-w-md p-4 border-gray-50 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Password Updated! ✅</CardTitle>
        <CardDescription className="text-base">
          Your password has been successfully changed. You can now sign in with
          your new password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-12">
          <Button className="w-full" asChild>
            <Link href="/sign-in"> Sign In</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
