"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { NewGuideDialog } from "../_components/NewGuideDialog";

export default function Page() {
  return (
    <div>
      <NewGuideDialog />
    </div>
  );
}
