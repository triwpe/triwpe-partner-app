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
import { ChevronLeft, PlusCircle, Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GuideDetailsForm } from "../_components/GuideDetailsForm";
import { GuideStatusForm } from "../_components/GuideStatusForm";
import { GuideCategoriesForm } from "../_components/GuideCategoriesForm";
import { GuideSections } from "../_components/GuideSections";
import { GuideSectionItems } from "../_components/GuideSectionItems";

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
    <div className="mx-auto grid flex-1 auto-rows-max gap-4 overflow-hidden">
      <div className="flex items-end gap-4">
        <div className="items-end gap-2 ml-auto flex">
          <Button variant="outline" size="sm">
            Discard
          </Button>
          <Button size="sm">Save Product</Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <GuideDetailsForm />
          <GuideSections />
          <GuideSectionItems />
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <GuideStatusForm />
          <GuideCategoriesForm />
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 md:hidden">
        <Button variant="outline" size="sm">
          Discard
        </Button>
        <Button size="sm">Save Product</Button>
      </div>
    </div>
  );
}
