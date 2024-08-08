"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { resendEmailConfirmation as resendEmailConfirmationAction } from "@/actions/partner";

interface ResendEmailConfirmationCodeProps {
  email: string;
}

export default function ResendEmailConfirmationCode({
  email,
}: ResendEmailConfirmationCodeProps) {
  const seconds = 60;
  const [timer, setTimer] = useState<number>(seconds);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      if (interval) {
        clearInterval(interval);
      }
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerActive, timer]);

  const handleResendClick = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    await resendEmailConfirmationAction(email);
    setTimer(seconds);
    setIsTimerActive(true);
  };

  return (
    <div className="mt-4 text-center text-sm">
      Didn’t receive?{" "}
      {isTimerActive ? (
        <span className="text-gray-400">({timer}) Resend Code</span>
      ) : (
        <>
          <Link
            href="/sign-in"
            className="underline"
            onClick={handleResendClick}
          >
            Resend Code
          </Link>
        </>
      )}
    </div>
  );
}
