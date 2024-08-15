import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NewGuideDialogTitleStep } from "./NewGuideDialogTitleStep";
import { NewGuideDialogLocationStep } from "./NewGuideDialogLocationStep";
import { useRouter } from "next/navigation";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface NewSectionItemsDialogProps {
  isOpen: boolean;
  onCancel: () => void;
}

export function NewSectionItemDialog({
  isOpen,
  onCancel,
}: NewSectionItemsDialogProps) {
  const sectionTitle = "Alimentação";

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
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-4xl">
        <AlertDialogHeader>
          <VisuallyHidden.Root>
            <AlertDialogTitle></AlertDialogTitle>
          </VisuallyHidden.Root>
          <AlertDialogDescription>
            <Card className="border-0 shadow-none">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Add a new item for &ldquo;{sectionTitle}&rdquo; section
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid mt-4 gap-6 px-3">
                  <div className="grid gap-3">
                    <Label htmlFor="name">Title</Label>
                    <Input
                      id="name"
                      type="text"
                      className="w-full"
                      placeholder="Enter the full title"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Write a description for your guide"
                      className="h-32"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="airplane-mode" />
                    <Label htmlFor="airplane-mode">Visible on demo?</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="gap-2 justify-end">
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button className="gap-2">Add</Button>
              </CardFooter>
            </Card>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
