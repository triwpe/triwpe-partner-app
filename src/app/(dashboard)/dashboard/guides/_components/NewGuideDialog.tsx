import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { NewGuideDialogTitleStep } from "./NewGuideDialogTitleStep";
import { NewGuideDialogLocationStep } from "./NewGuideDialogLocationStep";
import { useRouter } from "next/navigation";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

export function NewGuideDialog() {
  const router = useRouter();

  const [step, setStep] = useState<number>(1);
  const [newGuideLocation, setNewGuideLocation] = useState<any>("");

  const handleCancelDialog = async () => {
    router.replace("/dashboard");
  };

  const handleLocationSelected = async (location: any) => {
    setNewGuideLocation(location);
    setStep(2);
  };

  const handleSubmit = async (title: string) => {
    const newGuideTitle: string = title;
    console.log(newGuideTitle);
    console.log(newGuideLocation.id);
    console.log(newGuideLocation.place_name);
  };

  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <VisuallyHidden.Root>
            <AlertDialogTitle></AlertDialogTitle>
          </VisuallyHidden.Root>
          <AlertDialogDescription>
            {step === 1 && (
              <NewGuideDialogLocationStep
                onCancel={handleCancelDialog}
                onSuccess={handleLocationSelected}
              />
            )}
            {step === 2 && (
              <NewGuideDialogTitleStep
                onCancel={handleCancelDialog}
                onSuccess={handleSubmit}
              />
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
