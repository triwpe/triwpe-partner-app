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
import { GripIcon } from "lucide-react";

interface ReorderGuideSectionDialogProps {
  isOpen: boolean;
  sections: any[];
  onCancel: () => void;
}

export function ReorderGuideSectionDialog({
  isOpen,
  sections,
  onCancel,
}: ReorderGuideSectionDialogProps) {
  const [items, setItems] = useState(sections);

  const [draggingItem, setDraggingItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const handleDragStart = (item: any) => {
    setDraggingItem(item);
  };
  const handleDragOver = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = async (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    if (draggingItem && dragOverIndex !== null) {
      const updatedItems = [...items];
      updatedItems.splice(items.indexOf(draggingItem), 1);
      updatedItems.splice(dragOverIndex, 0, draggingItem);
      setItems(updatedItems);
      setDraggingItem(null);
      setDragOverIndex(null);
      console.log("updatedItems", updatedItems);
    }
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
                  Drag & drop to reorder sections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <ul className="space-y-2">
                    {items.map((item, index) => (
                      <li
                        key={item.guide_section_id}
                        className={`flex items-center bg-slate-100 p-3 rounded-md cursor-move transition-all ${
                          draggingItem === item
                            ? "opacity-50 translate-y-2"
                            : dragOverIndex === index
                            ? "bg-orange-100"
                            : ""
                        }`}
                        draggable
                        onDragStart={() => handleDragStart(item)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={handleDrop}
                      >
                        <div className="flex-1 font-medium">
                          {item.menu_title}
                        </div>
                        <div className="text-muted-foreground cursor-grab">
                          <GripIcon className="w-5 h-5" />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="gap-2 justify-end">
                <Button className="gap-2" onClick={onCancel}>
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
