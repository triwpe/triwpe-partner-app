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
import { useToast } from '@/components/ui/use-toast';
import {
  SectionItemModel,
  SectionItemReorderModel,
} from '@/types/models/section-item';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from '@hello-pangea/dnd';
import { reorderSectionItem } from '@/actions/guide';

interface ReorderSectionItemDialogProps {
  isOpen: boolean;
  data: any[];
  onClose: (refresh: boolean) => void;
}

export function ReorderSectionItemDialog({
  isOpen,
  data,
  onClose,
}: ReorderSectionItemDialogProps) {
  const { toast } = useToast();

  const sectionId: string = data.length > 0 ? data[0].guideSectionId : '';
  const [reorderedItems, setReorderedItems] = useState<SectionItemModel[]>([]);

  useEffect(() => {
    if (isOpen) {
      setReorderedItems(data);
    }
  }, [isOpen]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = JSON.parse(JSON.stringify(reorderedItems));
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    items.forEach((item: SectionItemModel, index: number) => {
      item.itemOrder = index + 1;
    });

    setReorderedItems(items);
  };

  const handleClose = async () => {
    const hasOrderChanged: boolean = await hasItemOrderChanged(
      data,
      reorderedItems,
    );
    if (hasOrderChanged) {
      const reorderedData: SectionItemReorderModel[] = reorderedItems.map(
        (item) => ({
          id: item.id,
          itemOrder: item.itemOrder,
        }),
      );

      const reorderResponse = await reorderSectionItem(
        sectionId,
        reorderedData,
      );

      if (reorderResponse.success) {
        toast({
          variant: 'success',
          description: 'Items reordered successfully',
        });
      } else {
        toast({
          variant: 'destructive',
          description: 'Failed to reorder items',
        });
      }
    }
    onClose(hasOrderChanged);
  };

  const hasItemOrderChanged = async (
    data: SectionItemModel[],
    reorderedData: SectionItemModel[],
  ) => {
    for (let i = 0; i < data.length; i++) {
      const originalItem = data[i];
      const reorderedItem = reorderedData.find(
        (section) => section.id === originalItem.id,
      );

      if (reorderedItem && originalItem.itemOrder !== reorderedItem.itemOrder) {
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
                  Drag & drop to reorder items
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
                        {reorderedItems.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
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
                                  {item.title}
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
