import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { ArrowUpDown, Plus } from 'lucide-react';
import { useState } from 'react';
import { NewGuideSectionDialog } from './NewGuideSectionDialog';
import { ReorderGuideSectionDialog } from './ReorderGuideSectionDialog';

import { useToast } from '@/components/ui/use-toast';
import { GuideSectionModel } from '@/types/models/guide-section';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { GuideSectionUpdateForm } from './GuideSectionUpdateForm';

interface GuideSectionsProps {
  guideId: string;
  sections: GuideSectionModel[];
  onSectionUpdate: () => void;
}

export function GuideSections({
  guideId,
  sections,
  onSectionUpdate,
}: GuideSectionsProps) {
  const { toast } = useToast();

  const [activeSection, setActiveSection] = useState<string | null>(null);

  const [isNewSectionDialogOpen, setIsNewSectionDialogOpen] = useState(false);
  const [isReorderSectionDialogOpen, setIsReorderSectionDialogOpen] =
    useState(false);

  const handleNewGuideSectionAdded = async () => {
    setIsNewSectionDialogOpen(false);
    toast({
      variant: 'success',
      description: 'Section added successfully',
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

  const handleCloseReorderSectionDialog = async (refreshSection: boolean) => {
    if (refreshSection) {
      onSectionUpdate();
    }
    setIsReorderSectionDialogOpen(false);
  };

  if (!sections || sections.length === 0) {
    return (
      <Card className="text-[#344054] shadow-none border-[#e0e0e0] rounded-md">
        <CardContent>
          <div className="flex flex-col items-center justify-center mt-16">
            <p>
              No sections here yet! Let&quot;s get started by adding your first
              one. 🚀
            </p>
            <Button
              size="lg"
              className="mt-8 mb-8 h-14 bg-[#1fd79b] text-[#344054] text-base hover:bg-[#1fd79b]"
              onClick={handleOpenNewGuideSectionDialog}
            >
              Add First Section
            </Button>
            <NewGuideSectionDialog
              isOpen={isNewSectionDialogOpen}
              guideId={guideId ? guideId : ''}
              onSuccess={handleNewGuideSectionAdded}
              onCancel={handleCloseNewGuideSectionDialog}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="text-[#344054] shadow-none border-[#e0e0e0] rounded-md">
      <CardHeader>
        <CardTitle>Guide Sections</CardTitle>
        <CardDescription>Manage the sections of your guide</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="flex justify-end gap-3 pb-4">
            <div className="flex gap-1">
              <Button
                size="sm"
                className="bg-[#1fd79b] text-[#344054] text-base hover:bg-[#1fd79b]"
                onClick={handleOpenNewGuideSectionDialog}
              >
                <Plus className="h-4 w-4" />
                Add Section
              </Button>
              <NewGuideSectionDialog
                isOpen={isNewSectionDialogOpen}
                guideId={guideId ? guideId : ''}
                onSuccess={handleNewGuideSectionAdded}
                onCancel={handleCloseNewGuideSectionDialog}
              />
              <Button
                size="sm"
                className="bg-[#2a77e9] text-[#fff] text-base hover:bg-[#2a77e9]"
                onClick={handleOpenReorderSectionDialog}
                disabled={sections.length < 2}
              >
                <ArrowUpDown className="h-4 w-4" />
                Reorder
              </Button>
              <ReorderGuideSectionDialog
                isOpen={isReorderSectionDialogOpen}
                data={sections}
                onClose={handleCloseReorderSectionDialog}
              />
            </div>
          </div>
          <Accordion
            type="single"
            collapsible
            className="w-full"
            onValueChange={setActiveSection}
          >
            {sections
              .sort((a, b) => a.sectionOrder - b.sectionOrder)
              .map((section) => (
                <AccordionItem
                  className="border-0 mb-2"
                  key={section.id}
                  value={section.id}
                >
                  <AccordionTrigger
                    className={`${section.id == activeSection ? 'bg-[#2a77e9] text-[#fff]' : 'bg-slate-100 text-[#535773]'} px-2 rounded-md no-underline hover:no-underline`}
                  >
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
