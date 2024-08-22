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
import { GuideImagesUpload } from "../_components/GuideImagesUpload";
import { GuideImageCover } from "../_components/GuideImageCover";
import { getGuide, updateGuide } from "@/actions/guide";
import { GuideProps } from "../_types/components";
import { useToast } from "@/components/ui/use-toast";
import { Alert } from "@/components/ui/alert";

interface PageParams {
  id: string;
}

export default function Page({ params }: { params: PageParams }) {
  const { toast } = useToast();
  const [guideData, setGuideData] = useState<GuideProps | null>(null);
  const [guideId, setGuideId] = useState(params.id);
  const [isLoading, setIsLoading] = useState(true);
  const [mainCategory, setMainCategory] = useState<string | undefined>();
  const [firstOptionalCategory, setFirstOptionalCategory] = useState<
    string | undefined
  >();
  const [secondOptionalCategory, setSecondOptionalCategory] = useState<
    string | undefined
  >();
  const [selectedSection, setSelectedSection] = useState<string | undefined>();
  const [selectedSectionTitle, setSelectedSectionTitle] = useState<
    string | null
  >(null);

  const router = useRouter();

  useEffect(() => {
    if (!uuidValidate(guideId)) {
      router.replace("/dashboard/guides/new");
    }

    fetchGuideData();

    setIsLoading(false);
  }, [guideId]);

  const fetchGuideData = async () => {
    const response = await getGuide(guideId);
    if (!response.success) {
      router.replace("/dashboard/guides/new");
    } else {
      setGuideData(response.data);
    }
  };

  const updateGuideData = (updatedData: Partial<GuideProps>) => {
    setGuideData((prev) => ({ ...prev, ...updatedData } as GuideProps));
  };

  const handleSaveGuide = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const response = await updateGuide(
      guideId,
      guideData?.title,
      guideData?.description,
      guideData?.duration,
      guideData?.price,
      guideData?.language,
      guideData?.status
    );

    if (!response.success) {
      console.error("Failed to save guide");
      return;
    }

    toast({
      variant: "success",
      description: "Guide saved successfully",
    });
  };

  const handleSectionChange = (
    value: string | undefined,
    title?: string | null
  ) => {
    setSelectedSection(value);
    if (title) {
      setSelectedSectionTitle(title);
    }
  };

  if (isLoading || !guideData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto grid flex-1 auto-rows-max gap-4 overflow-hidden">
      <div className="flex items-end gap-4">
        <div className="items-end gap-2 ml-auto flex">
          <Button variant="outline" size="sm">
            Discard
          </Button>
          <Button size="sm" onClick={handleSaveGuide}>
            Save Guide
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <GuideDetailsForm
            title={guideData?.title ?? ""}
            location={guideData?.location?.place_name ?? ""}
            language={guideData?.language ?? undefined}
            duration={guideData?.duration ?? null}
            price={guideData?.price ?? null}
            description={guideData?.description ?? null}
            onUpdate={updateGuideData}
          />
          <GuideSections
            guideId={guideData?.id}
            onSelectedSectionChange={handleSectionChange}
          />
          <GuideSectionItems
            selectedSectionId={selectedSection}
            guideSectionTitle={selectedSectionTitle}
          />
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <GuideStatusForm
            status={guideData.status}
            onUpdate={updateGuideData}
          />
          <GuideCategoriesForm
            guideId={guideData?.id}
            mainCategory={
              guideData?.categories?.find((category) => category.is_main)?.id
            }
            firstOptionalCategory={
              guideData?.categories?.filter((category) => !category.is_main)[0]
                ?.id
            }
            secondOptionalCategory={
              guideData?.categories?.filter((category) => !category.is_main)[1]
                ?.id
            }
          />
          <GuideImageCover />
          <GuideImagesUpload />
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
