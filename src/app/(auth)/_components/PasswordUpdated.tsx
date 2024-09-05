'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import React from 'react';
import Link from 'next/link';

export default function PasswordUpdated() {
  return (
    <Card className="w-full md:w-[576px] py-5 px-7 text-[#344054] shadow-none border-[#e0e0e0] rounded-md">
      <CardHeader>
        <CardTitle className="text-2xl">Password Updated! ✅</CardTitle>
        <CardDescription className="text-base text-[#969696]">
          Your password has been successfully changed. You can now sign in with
          your new password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-12">
          <Button
            className="w-full h-14 bg-[#1fd79b] text-[#344054] text-base hover:bg-[#1fd79b]"
            asChild
          >
            <Link href="/sign-in"> Sign In</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
