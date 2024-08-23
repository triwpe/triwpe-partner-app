import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ArrowUpDown, Plus } from "lucide-react";
import { useState } from "react";
import { NewGuideSectionDialog } from "./NewGuideSectionDialog";
import { ReorderGuideSectionDialog } from "./ReorderGuideSectionDialog";

import { useToast } from "@/components/ui/use-toast";
import { GuideSectionModel } from "@/types/models/guide-section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GuideSectionUpdateForm } from "./GuideSectionUpdateForm";

interface GuideSectionsProps {
  sections: GuideSectionModel[];
  onSectionUpdate: () => void;
}

export function GuideSections({
  sections,
  onSectionUpdate,
}: GuideSectionsProps) {
  const guideId = sections[0].guideId;

  const { toast } = useToast();

  const [isNewSectionDialogOpen, setIsNewSectionDialogOpen] = useState(false);
  const [isReorderSectionDialogOpen, setIsReorderSectionDialogOpen] =
    useState(false);

  const handleNewGuideSectionAdded = async () => {
    setIsNewSectionDialogOpen(false);
    toast({
      variant: "success",
      description: "Section added successfully",
    });
    onSectionUpdate();
  };

  const handleOpenNewGuideSectionDialog = async () => {
    setIsNewSectionDialogOpen(true);
  };

  const handleCloseNewGuideSectionDialog = async () => {
    setIsNewSectionDialogOpen(false);
  };

  const handleOpenReorderSectionDialog = async () => {
    setIsReorderSectionDialogOpen(true);
  };

  const handleCloseReorderSectionDialog = async () => {
    setIsReorderSectionDialogOpen(false);
  };

  if (!sections || sections.length === 0) {
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
          <div className="flex justify-end gap-3 pb-4">
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
              <Button
                size="sm"
                onClick={handleOpenReorderSectionDialog}
                disabled={sections.length < 2}
              >
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
          <Accordion type="single" collapsible className="w-full">
            {sections
              .sort((a, b) => a.sectionOrder - b.sectionOrder)
              .map((section) => (
                <AccordionItem
                  className="border-0 mb-2"
                  key={section.id}
                  value={section.id}
                >
                  <AccordionTrigger className="bg-slate-100 px-2 rounded-md no-underline hover:no-underline text-slate-600">
                    {section.menuTitle}
                  </AccordionTrigger>
                  <AccordionContent>
                    <GuideSectionUpdateForm
                      section={section}
                      onSectionUpdate={onSectionUpdate}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}
