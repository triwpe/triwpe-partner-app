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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUpDown, Loader2, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NewGuideSectionDialog } from './NewGuideSectionDialog';
import { ReorderGuideSectionDialog } from './ReorderGuideSectionDialog';
import {
  deleteGuideSection,
  deleteSectionItem,
  fetchGuideSections,
  updateGuideSection,
  updateSectionItem,
} from '@/actions/guide';
import {
  createNewGuideSectionSchema,
  updateGuideSectionSchema,
  updateSectionItemSchema,
} from '@/lib/zod';
import { set } from 'zod';
import { Alert } from '@/components/Alert';
import { useToast } from '@/components/ui/use-toast';
import {
  GuideSectionModel,
  GuideSectionUpdateModel,
} from '@/types/models/guide-section';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  SectionItemModel,
  SectionItemUpdateModel,
} from '@/types/models/section-item';

interface GuideSectionItemUpdateFormProps {
  item: SectionItemModel;
  onItemUpdate: () => void;
}

export function GuideSectionItemUpdateForm({
  item,
  onItemUpdate,
}: GuideSectionItemUpdateFormProps) {
  const { toast } = useToast();

  const [title, setTitle] = useState(item.title || '');
  const [description, setDescription] = useState(item.description);
  const [isVisibleOnDemo, setIsVisibleOnDemo] = useState<boolean>(
    item.isVisibleOnDemo,
  );

  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const [formErrors, setFormErrors] = useState<any[]>([]);

  const handleUpdateItem = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    setIsLoadingUpdate(true);
    setFormErrors([]);

    const isFormValid = updateSectionItemSchema.safeParse({
      description: description,
    });

    if (!isFormValid.success) {
      await addError(isFormValid.error);
      return;
    }

    const updated_data: SectionItemUpdateModel = {
      title: title,
      description: description,
      isVisibleOnDemo: isVisibleOnDemo,
    };

    const updateResponse = await updateSectionItem(
      item.guideSectionId,
      item.id,
      updated_data,
    );

    if (updateResponse.success) {
      toast({
        variant: 'success',
        description: 'Item updated successfully',
      });
      onItemUpdate();
    } else {
      toast({
        variant: 'destructive',
        description: 'Failed to update item',
      });
    }

    setIsLoadingUpdate(false);
  };

  const handleDeleteItem = async () => {
    setIsLoadingDelete(true);
    setIsDeleteAlertOpen(true);
  };

  const handleConfirmDeleteAlert = async (): Promise<void> => {
    setIsDeleteAlertOpen(false);

    const deleteResponse = await deleteSectionItem(
      item.guideSectionId,
      item.id,
    );

    if (deleteResponse.success) {
      toast({
        variant: 'success',
        description: 'Item deleted successfully',
      });
      onItemUpdate();
    } else {
      toast({
        variant: 'destructive',
        description: 'Failed to delete item',
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
      <div className="grid gap-2">
        <Label htmlFor="name">Title</Label>
        <Input
          id="title"
          title="title"
          type="text"
          className="w-full h-14 border-[#d9d9d9] text-[#535773] focus-visible:ring-0 focus-visible:ring-transparent"
          value={title}
          placeholder="Enter the full title"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <div>
          <Textarea
            id="description"
            name="description"
            value={description}
            placeholder="Write a description for your guide"
            onChange={(e) => setDescription(e.target.value)}
            className={`h-32 border-[#d9d9d9] text-[#535773] focus-visible:ring-0 focus-visible:ring-transparent ${
              formErrors.some((error) => error.for === 'description')
                ? 'border-red-600'
                : ''
            }`}
          />
          <div className="mt-1 ml-1 text-xs text-red-600">
            {formErrors.find((error) => error.for === 'description')?.message}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="is-visible-on-demo"
          name="is-visible-on-demo"
          checked={isVisibleOnDemo}
          onCheckedChange={(e) => setIsVisibleOnDemo(e)}
        />
        <Label htmlFor="airplane-mode">Visible on demo?</Label>
      </div>
      {/* <div className="flex items-center space-x-2">
        <FileUploader
          value={files}
          onValueChange={handleFileChange}
          dropzoneOptions={dropzone}
        >
          <FileUploaderContent className="grid grid-cols-5 gap-2">
            {files?.map((file, i) => (
              <FileUploaderItem
                key={i}
                index={i}
                className="w-full h-full aspect-square p-0 rounded-md overflow-hidden"
                aria-roledescription={`file ${i + 1} containing ${file.name}`}
              >
                <Image
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  height={80}
                  width={80}
                  className="w-full h-full aspect-square p-0"
                />
              </FileUploaderItem>
            ))}
            {(!files || files?.length < 5) && (
              <FileInput>
                <div className="w-full h-full aspect-square p-0 rounded-md overflow-hidden border-2 border-dashed flex items-center justify-center">
                  <div className="flex items-center justify-center flex-col w-full ">
                    <Upload className="w-6 h-6 mb-3 text-gray-500 dark:text-gray-400" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span>
                    </p>
                  </div>
                </div>
              </FileInput>
            )}
          </FileUploaderContent>
        </FileUploader>
      </div> */}
      <div className="flex gap-2">
        <Button
          size="default"
          onClick={handleUpdateItem}
          className="h-14 bg-[#1fd79b] text-[#344054] text-base hover:bg-[#1fd79b]"
          disabled={isLoadingUpdate}
        >
          {isLoadingUpdate ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
            </>
          ) : (
            'Update Item'
          )}
        </Button>
        <Button
          size="default"
          variant={'outline'}
          onClick={handleDeleteItem}
          className="h-14 border-[#d9d9d9] text-[#535773] text-base hover:bg-transparent hover:text-[#535773]"
          disabled={isLoadingDelete}
        >
          {isLoadingDelete ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
            </>
          ) : (
            'Delete Item'
          )}
        </Button>
        <Alert
          open={isDeleteAlertOpen}
          title="Are you absolutely sure?"
          description="This action cannot be undone. This will permanently delete your item."
          onConfirm={handleConfirmDeleteAlert}
          onCancel={handleCancelDeleteAlert}
        />
      </div>
    </div>
  );
}
