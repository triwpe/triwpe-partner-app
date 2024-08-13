"use client";

import { Button } from "@/components/ui/button";
import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NewGuideDialog } from "../_components/NewGuideDialog";
import { validate as uuidValidate } from "uuid";
import Loading from "@/app/(dashboard)/loading";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import Logo from "../../../../../../public/logo.svg";

interface PageParams {
  id: string;
}

export default function Page({ params }: { params: PageParams }) {
  const [guideId, setGuideId] = useState(params.id);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (!uuidValidate(guideId)) {
      router.replace("/dashboard/guides/new");
    }
    setIsLoading(false);
  }, [guideId]);

  if (isLoading) {
    return <></>;
  }

  return (
    <div>
      <h1>WELCOME {guideId}!!</h1>
    </div>
  );
}
