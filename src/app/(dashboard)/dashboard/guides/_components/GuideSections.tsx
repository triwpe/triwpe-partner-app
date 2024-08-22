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
  getGuideSections,
  updateGuideSection,
} from "@/actions/guide";
import { createNewGuideSectionSchema } from "@/lib/zod";
import { set } from "zod";
import { Alert } from "@/components/Alert";
import { useToast } from "@/components/ui/use-toast";

interface GuideSectionsProps {
  guideId: string;
  onSelectedSectionChange: (
    value: string | undefined,
    title?: string | null
  ) => void;
}

export function GuideSections({
  guideId,
  onSelectedSectionChange,
}: GuideSectionsProps) {
  const { toast } = useToast();
  const [sections, setSections] = useState<any[]>([]);
  const [isNewSectionDialogOpen, setIsNewSectionDialogOpen] = useState(false);
  const [isReorderSectionDialogOpen, setIsReorderSectionDialogOpen] =
    useState(false);

  const [selectedSection, setSelectedSection] = useState<string | undefined>(
    undefined
  );
  const [menuTitle, setMenuTitle] = useState("");
  const [fullTitle, setFullTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visible, setVisible] = useState(false);

  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [formErrors, setFormErrors] = useState<any[]>([]);

  useEffect(() => {
    fetchGuideSectionData();
  }, []);

  const fetchGuideSectionData = async (isUpdate?: boolean) => {
    const response = await getGuideSections(guideId);
    if (response.success) {
      setSections(response.data);
      if (response.data.length > 0) {
        if (isUpdate) {
          const findSection = response.data.find(
            (section: any) => section.id === selectedSection
          );
          if (findSection) {
            setMenuTitle(findSection.menu_title);
            setFullTitle(findSection.full_title);
            setDescription(findSection.description);
            setVisible(findSection.is_visible_on_demo);
          }
          return;
        }

        const orderedSections = response.data.sort(
          (a: any, b: any) => a.section_order - b.section_order
        );
        setSelectedSection(orderedSections[0].id);
        setMenuTitle(orderedSections[0].menu_title);
        setFullTitle(orderedSections[0].full_title);
        setDescription(orderedSections[0].description);
        setVisible(orderedSections[0].is_visible_on_demo);
        onSelectedSectionChange(
          orderedSections[0].id,
          orderedSections[0].menu_title
        );
      } else {
        onSelectedSectionChange(undefined);
      }
    }
  };

  const handleSectionChange = (value: string) => {
    setSelectedSection(value);

    const findSection = sections.find((section) => section.id === value);
    if (findSection) {
      setMenuTitle(findSection.menu_title);
      setFullTitle(findSection.full_title);
      setDescription(findSection.description);
      setVisible(findSection.is_visible_on_demo);
      onSelectedSectionChange(value, findSection.menu_title);
    }
  };

  const handleNewGuideSectionAdded = () => {
    fetchGuideSectionData();
    setIsNewSectionDialogOpen(false);
    toast({
      variant: "success",
      description: "Guide section added successfully",
    });
  };

  const handleOpenNewGuideSectionDialog = () => {
    setIsNewSectionDialogOpen(true);
  };

  const handleCloseNewGuideSectionDialog = () => {
    setIsNewSectionDialogOpen(false);
  };

  const handleOpenReorderSectionDialog = () => {
    setIsReorderSectionDialogOpen(true);
  };

  const handleCloseReorderSectionDialog = () => {
    setIsReorderSectionDialogOpen(false);
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    setIsLoadingUpdate(true);
    setFormErrors([]);

    const parseResponse = await createNewGuideSectionSchema.safeParseAsync({
      menuTitle: menuTitle,
      fullTitle: fullTitle,
    });

    if (parseResponse.success) {
      const updateResponse = await updateGuideSection(
        guideId,
        selectedSection ?? "",
        menuTitle,
        fullTitle,
        description,
        visible
      );
      if (updateResponse.success) {
        toast({
          variant: "success",
          description: "Guide section updated successfully",
        });
        fetchGuideSectionData(true);
      } else {
        toast({
          variant: "destructive",
          description: "Failed to update guide section",
        });
      }
    } else {
      await addError(parseResponse.error);
    }
    setIsLoadingUpdate(false);
  };

  const handleDeleteSection = async () => {
    setIsLoadingDelete(true);
    setIsDeleteAlertOpen(true);
  };

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const handleConfirmDeleteAlert = async (): Promise<void> => {
    setIsDeleteAlertOpen(false);

    if (!selectedSection) {
      return;
    }

    const deleteResponse = await deleteGuideSection(guideId, selectedSection);

    if (deleteResponse.success) {
      toast({
        variant: "success",
        description: "Guide section deleted successfully",
      });
      fetchGuideSectionData();
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

  if (sections.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className="flex flex-col items-center justify-center mt-16">
            <p className="text-gray-500">
              No sections here yet! Let&quot;s get started by adding your first
              one. 🚀
            </p>
            <Button
              size="sm"
              className="mt-8 mb-8"
              onClick={handleOpenNewGuideSectionDialog}
            >
              Add First Section
            </Button>
            <NewGuideSectionDialog
              isOpen={isNewSectionDialogOpen}
              guideId={guideId}
              onSuccess={handleNewGuideSectionAdded}
              onCancel={handleCloseNewGuideSectionDialog}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guide Sections</CardTitle>
        <CardDescription>Manage the sections of your guide</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="flex justify-between gap-3 pb-4">
            <Select
              onValueChange={handleSectionChange}
              value={selectedSection}
              defaultValue={selectedSection}
            >
              <SelectTrigger
                id="status"
                aria-label="Select status"
                className="w-1/2"
              >
                <SelectValue placeholder="Select to edit" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.menu_title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-1">
              <Button size="sm" onClick={handleOpenNewGuideSectionDialog}>
                <Plus className="h-4 w-4" />
                Add Section
              </Button>
              <NewGuideSectionDialog
                isOpen={isNewSectionDialogOpen}
                guideId={guideId}
                onSuccess={handleNewGuideSectionAdded}
                onCancel={handleCloseNewGuideSectionDialog}
              />
              <Button size="sm" onClick={handleOpenReorderSectionDialog}>
                <ArrowUpDown className="h-4 w-4" />
                Reorder
              </Button>
              <ReorderGuideSectionDialog
                isOpen={isReorderSectionDialogOpen}
                sections={sections}
                onCancel={handleCloseReorderSectionDialog}
              />
            </div>
          </div>
          {selectedSection && (
            <>
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
                    {
                      formErrors.find((error) => error.for === "menuTitle")
                        ?.message
                    }
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
                    {
                      formErrors.find((error) => error.for === "fullTitle")
                        ?.message
                    }
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
                  checked={visible}
                  onCheckedChange={(e) => setVisible(e)}
                />
                <Label htmlFor="airplane-mode">Visible on demo?</Label>
              </div>
              <div className="flex gap-2">
                <Button
                  size="default"
                  onClick={handleSubmit}
                  disabled={isLoadingUpdate}
                >
                  {isLoadingUpdate ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Updating...
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
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Deleting...
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
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
