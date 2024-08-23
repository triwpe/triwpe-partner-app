import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpDown, Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { NewGuideSectionDialog } from "./NewGuideSectionDialog";
import { ReorderGuideSectionDialog } from "./ReorderGuideSectionDialog";
import {
  deleteGuideSection,
  fetchGuideSections,
  updateGuideSection,
} from "@/actions/guide";
import {
  createNewGuideSectionSchema,
  updateGuideSectionSchema,
} from "@/lib/zod";
import { set } from "zod";
import { Alert } from "@/components/Alert";
import { useToast } from "@/components/ui/use-toast";
import {
  GuideSectionModel,
  GuideSectionUpdateModel,
} from "@/types/models/guide-section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface GuideSectionUpdateFormProps {
  section: GuideSectionModel;
  onSectionUpdate: () => void;
}

export function GuideSectionUpdateForm({
  section,
  onSectionUpdate,
}: GuideSectionUpdateFormProps) {
  const { toast } = useToast();

  const [menuTitle, setMenuTitle] = useState(section.menuTitle);
  const [fullTitle, setFullTitle] = useState(section.fullTitle);
  const [description, setDescription] = useState(section.description || "");
  const [isVisibleOnDemo, setIsVisibleOnDemo] = useState(
    section.isVisibleOnDemo
  );

  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const [formErrors, setFormErrors] = useState<any[]>([]);

  const handleUpdateSection = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    setIsLoadingUpdate(true);
    setFormErrors([]);

    const isFormValid = updateGuideSectionSchema.safeParse({
      menuTitle: menuTitle,
      fullTitle: fullTitle,
    });

    if (!isFormValid.success) {
      await addError(isFormValid.error);
      return;
    }

    const updated_data: GuideSectionUpdateModel = {
      menuTitle: menuTitle,
      fullTitle: fullTitle,
      description: description,
      isVisibleOnDemo: isVisibleOnDemo,
    };

    const updateResponse = await updateGuideSection(
      section.guideId,
      section.id,
      updated_data
    );

    if (updateResponse.success) {
      toast({
        variant: "success",
        description: "Guide section updated successfully",
      });
      onSectionUpdate();
    } else {
      toast({
        variant: "destructive",
        description: "Failed to update guide section",
      });
    }

    setIsLoadingUpdate(false);
  };

  const handleDeleteSection = async () => {
    setIsLoadingDelete(true);
    setIsDeleteAlertOpen(true);
  };

  const handleConfirmDeleteAlert = async (): Promise<void> => {
    setIsDeleteAlertOpen(false);

    const deleteResponse = await deleteGuideSection(
      section.guideId,
      section.id
    );

    if (deleteResponse.success) {
      toast({
        variant: "success",
        description: "Guide section deleted successfully",
      });
      onSectionUpdate();
    } else {
      toast({
        variant: "destructive",
        description: "Failed to delete guide section",
      });
    }
    setIsLoadingDelete(false);
  };

  const handleCancelDeleteAlert = async () => {
    setIsDeleteAlertOpen(false);
    setIsLoadingDelete(false);
  };

  const addError = async (error: any) => {
    let errArr: any[] = [];
    const { errors: err } = error;
    for (var i = 0; i < err.length; i++) {
      errArr.push({ for: err[i].path[0], message: err[i].message });
    }
    setFormErrors(errArr);
  };

  return (
    <div className="grid mt-4 gap-6 px-3">
      <div className="grid gap-3">
        <Label htmlFor="name">Menu Title</Label>
        <div>
          <Input
            id="name"
            type="text"
            className={`w-full ${
              formErrors.some((error) => error.for === "menuTitle")
                ? "border-red-600"
                : ""
            }`}
            value={menuTitle}
            onChange={(e) => setMenuTitle(e.target.value)}
            placeholder="Enter the menu title"
          />
          <div className="mt-1 ml-1 text-xs text-red-600">
            {formErrors.find((error) => error.for === "menuTitle")?.message}
          </div>
        </div>
      </div>
      <div className="grid gap-3">
        <Label htmlFor="name">Full Title</Label>
        <div>
          <Input
            id="name"
            type="text"
            className={`w-full ${
              formErrors.some((error) => error.for === "fullTitle")
                ? "border-red-600"
                : ""
            }`}
            value={fullTitle}
            onChange={(e) => setFullTitle(e.target.value)}
            placeholder="Enter the full title"
          />
          <div className="mt-1 ml-1 text-xs text-red-600">
            {formErrors.find((error) => error.for === "fullTitle")?.message}
          </div>
        </div>
      </div>
      <div className="grid gap-3">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write a description for your guide"
          className="min-h-32"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="airplane-mode"
          checked={isVisibleOnDemo}
          onCheckedChange={(e) => setIsVisibleOnDemo(e)}
        />
        <Label htmlFor="airplane-mode">Visible on demo?</Label>
      </div>
      <div className="flex gap-2">
        <Button
          size="default"
          onClick={handleUpdateSection}
          disabled={isLoadingUpdate}
        >
          {isLoadingUpdate ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
            </>
          ) : (
            "Update Section"
          )}
        </Button>
        <Button
          size="default"
          onClick={handleDeleteSection}
          disabled={isLoadingDelete}
        >
          {isLoadingDelete ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
            </>
          ) : (
            "Delete Section"
          )}
        </Button>
        <Alert
          open={isDeleteAlertOpen}
          title="Are you absolutely sure?"
          description="This action cannot be undone. This will permanently delete your sections and their items."
          onConfirm={handleConfirmDeleteAlert}
          onCancel={handleCancelDeleteAlert}
        />
      </div>
    </div>
  );
}
