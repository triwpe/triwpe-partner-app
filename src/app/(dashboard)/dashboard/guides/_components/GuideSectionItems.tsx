import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from '@/components/extension/file-upload';

import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowUpDown,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  Upload,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { NewSectionItemDialog } from './NewSectionItemDialog';
import { ReorderSectionItemDialog } from './ReorderSectionItemDialog';
import { DropzoneOptions } from 'react-dropzone';
import Image from 'next/image';
import {
  deleteSectionItem,
  getSectionItems,
  updateSectionItem,
} from '@/actions/guide';
import { useToast } from '@/components/ui/use-toast';
import { Alert } from '@/components/Alert';
import { createNewSectionItemSchema } from '@/lib/zod';
import { GuideSectionModel } from '@/types/models/guide-section';
import { GuideSectionItemUpdateForm } from './GuideSectionItemUpdateForm';

interface GuideSectionItemProps {
  sections: GuideSectionModel[];
  onItemUpdate: () => void;
}

export function GuideSectionItems({
  sections,
  onItemUpdate,
}: GuideSectionItemProps) {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[] | null>(null);

  const [isNewItemDialogOpen, setIsNewItemDialogOpen] = useState(false);
  const [isReorderItemDialogOpen, setIsReorderItemDialogOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<string | undefined>('');

  const [selectedSection, setSelectedSection] = useState<string | undefined>(
    undefined,
  );
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isVisibleOnDemo, setIsVisibleOnDemo] = useState<boolean>(false);

  const [items, setItems] = useState<any[]>([]);

  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [formErrors, setFormErrors] = useState<any[]>([]);

  const dropzone = {
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png'],
    },
    multiple: true,
    maxFiles: 5,
    maxSize: 1 * 1024 * 1024,
  } satisfies DropzoneOptions;

  const handleOpenNewSectionItemDialog = () => {
    setIsNewItemDialogOpen(true);
  };

  const handleCloseNewSectionItemDialog = () => {
    setIsNewItemDialogOpen(false);
  };

  const handleOpenReorderItemDialog = () => {
    setIsReorderItemDialogOpen(true);
  };

  const handleCloseReorderItemDialog = (refresh: boolean) => {
    if (refresh) {
      onItemUpdate();
    }
    setIsReorderItemDialogOpen(false);
  };

  const handleNewSectionItemAdded = () => {
    setIsNewItemDialogOpen(false);
    toast({
      variant: 'success',
      description: 'Item added successfully',
    });
    onItemUpdate();
  };

  const handleFileChange = (values: File[] | null) => {
    const createFileSet = (fileArray: File[]) =>
      new Set(fileArray.map((file) => file.name));

    // Create sets for files and values
    const fileSet = createFileSet(files !== null ? files : []);
    const valueSet = createFileSet(values !== null ? values : []);

    // Select values in "values" that are not in "files"
    const valuesNotInFiles = values?.filter((file) => !fileSet.has(file.name));

    // Select values in "files" that are not in "values"
    const filesNotInValues = files?.filter((file) => !valueSet.has(file.name));

    setFiles(values);
  };

  if (!sections || sections.length === 0) {
    return <></>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Section Items</CardTitle>
        <CardDescription>Manage the items for each section</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <Accordion type="single" collapsible className="w-full">
            {sections
              .sort((a, b) => a.sectionOrder - b.sectionOrder)
              .map((section) => (
                <AccordionItem
                  className="border-0 mb-2"
                  key={section.id}
                  value={section.id}
                >
                  <AccordionTrigger className="bg-slate-200 px-2 rounded-md no-underline hover:no-underline text-slate-600">
                    {section.menuTitle}
                  </AccordionTrigger>
                  <AccordionContent className="pb-0">
                    <div className="grid mt-2 gap-6 pl-2">
                      {section.items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center mt-16">
                          <p className="text-gray-500">
                            The{' '}
                            <span className="font-bold">
                              &ldquo;{section.menuTitle}&rdquo;{' '}
                            </span>
                            section is empty. Add your first item to get
                            started! 🎯
                          </p>
                          <Button
                            size="sm"
                            className="mt-8 mb-8"
                            onClick={handleOpenNewSectionItemDialog}
                          >
                            Add First Item
                          </Button>
                          <NewSectionItemDialog
                            isOpen={isNewItemDialogOpen}
                            sectionId={section.id}
                            sectionTitle={section.menuTitle}
                            onSuccess={handleNewSectionItemAdded}
                            onCancel={handleCloseNewSectionItemDialog}
                          />
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-end mt-2 ">
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={handleOpenNewSectionItemDialog}
                              >
                                <Plus className="h-4 w-4" />
                                Add Section
                              </Button>
                              <NewSectionItemDialog
                                sectionId={section.id}
                                sectionTitle={section.menuTitle}
                                isOpen={isNewItemDialogOpen}
                                onSuccess={handleNewSectionItemAdded}
                                onCancel={handleCloseNewSectionItemDialog}
                              />
                              <Button
                                size="sm"
                                onClick={handleOpenReorderItemDialog}
                                disabled={section.items.length < 2}
                              >
                                <ArrowUpDown className="h-4 w-4" />
                                Reorder
                              </Button>
                              <ReorderSectionItemDialog
                                isOpen={isReorderItemDialogOpen}
                                data={section.items}
                                onClose={handleCloseReorderItemDialog}
                              />
                            </div>
                          </div>
                          <Accordion
                            type="single"
                            collapsible
                            className="w-full"
                          >
                            {section.items
                              .sort((a, b) => a.itemOrder - b.itemOrder)
                              .map((item) => (
                                <AccordionItem
                                  className="border-0 mb-2"
                                  key={item.id}
                                  value={item.id}
                                >
                                  <AccordionTrigger className="bg-slate-100 px-2 rounded-md no-underline hover:no-underline text-slate-600">
                                    {item.title === ''
                                      ? 'Untitled Item'
                                      : item.title}
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <GuideSectionItemUpdateForm
                                      item={item}
                                      onItemUpdate={onItemUpdate}
                                    />
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                          </Accordion>
                        </>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}
