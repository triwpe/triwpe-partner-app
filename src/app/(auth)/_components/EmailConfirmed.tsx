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

interface EmailConfirmedProps {
  onContinue?: () => void;
}

export default function EmailConfirmed({ onContinue }: EmailConfirmedProps) {
  return (
    <Card className="mx-auto max-w-md p-4 border-gray-50 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">You&apos;re In! 🎉</CardTitle>
        <CardDescription className="text-base">
          Your email is confirmed. Let&apos;s continue the adventure!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-12">
          {onContinue ? (
            <Button className="w-full" onClick={onContinue}>
              Sign In
            </Button>
          ) : (
            <Button className="w-full" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
