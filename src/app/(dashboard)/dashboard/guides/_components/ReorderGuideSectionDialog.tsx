import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { NewGuideDialogTitleStep } from './NewGuideDialogTitleStep';
import { NewGuideDialogLocationStep } from './NewGuideDialogLocationStep';
import { useRouter } from 'next/navigation';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Grip, GripIcon } from 'lucide-react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import {
  GuideSectionModel,
  GuideSectionReorderModel,
} from '@/types/models/guide-section';
import { reorderGuideSection } from '@/actions/guide';
import { useToast } from '@/components/ui/use-toast';

interface ReorderGuideSectionDialogProps {
  isOpen: boolean;
  data: GuideSectionModel[];
  onClose: (refresh: boolean) => void;
}

export function ReorderGuideSectionDialog({
  isOpen,
  data,
  onClose,
}: ReorderGuideSectionDialogProps) {
  const { toast } = useToast();

  const guideId: string = data.length > 0 ? data[0].guideId : '';
  const [reorderedSections, setReorderedSections] = useState<
    GuideSectionModel[]
  >([]);

  useEffect(() => {
    if (isOpen) {
      setReorderedSections(data);
    }
  }, [isOpen]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sections = JSON.parse(JSON.stringify(reorderedSections));
    const [reorderedSection] = sections.splice(result.source.index, 1);
    sections.splice(result.destination.index, 0, reorderedSection);

    sections.forEach((item: GuideSectionModel, index: number) => {
      item.sectionOrder = index + 1;
    });

    setReorderedSections(sections);
  };

  const handleClose = async () => {
    const hasOrderChanged: boolean = await hasSectionOrderChanged(
      data,
      reorderedSections,
    );
    if (hasOrderChanged) {
      const reorderedData: GuideSectionReorderModel[] = reorderedSections.map(
        (section) => ({
          id: section.id,
          sectionOrder: section.sectionOrder,
        }),
      );

      const reorderResponse = await reorderGuideSection(guideId, reorderedData);

      if (reorderResponse.success) {
        toast({
          variant: 'success',
          description: 'Sections reordered successfully',
        });
      } else {
        toast({
          variant: 'destructive',
          description: 'Failed to reorder sections',
        });
      }
    }
    onClose(hasOrderChanged);
  };

  const hasSectionOrderChanged = async (
    data: GuideSectionModel[],
    reorderedData: GuideSectionModel[],
  ) => {
    for (let i = 0; i < data.length; i++) {
      const originalSection = data[i];
      const reorderedSection = reorderedData.find(
        (section) => section.id === originalSection.id,
      );

      if (
        reorderedSection &&
        originalSection.sectionOrder !== reorderedSection.sectionOrder
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <VisuallyHidden.Root>
            <AlertDialogTitle></AlertDialogTitle>
          </VisuallyHidden.Root>
          <AlertDialogDescription>
            <Card className="border-0 shadow-none">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Drag & drop to reorder data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="data">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        {reorderedSections.map((section, index) => (
                          <Draggable
                            key={section.id}
                            draggableId={section.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`flex sections-center bg-slate-100 p-3 rounded-md cursor-move transition-all`}
                                style={{
                                  ...provided.draggableProps.style,
                                  left: 'auto !important',
                                  top: 'auto !important',
                                }}
                              >
                                <div className="flex-1 font-medium">
                                  {section.menuTitle}
                                </div>
                                <div className="text-muted-foreground cursor-grab">
                                  <Grip className="w-5 h-5" />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </CardContent>
              <CardFooter className="gap-2 justify-end">
                <Button className="gap-2" onClick={handleClose}>
                  Close
                </Button>
              </CardFooter>
            </Card>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
