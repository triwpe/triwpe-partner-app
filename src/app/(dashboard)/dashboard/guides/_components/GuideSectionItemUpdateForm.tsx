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
import { ArrowUpDown, Loader2, Plus, Trash2, Upload } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
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
import Dropzone, { FileRejection, useDropzone } from 'react-dropzone';
import { CloudinaryImageModel } from '@/types/models/images';
import { CldImage } from 'next-cloudinary';
import { cn } from '@/lib/utils';
import { generateCustomId } from '@/lib/genid';
import { deleteImage, uploadImage } from '@/actions/image';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface GuideSectionItemUpdateFormProps {
  guideId: string;
  item: SectionItemModel;
  itemImages: CloudinaryImageModel[];
  onItemUpdate: () => void;
  onImagesUpdate: () => void;
}

export function GuideSectionItemUpdateForm({
  guideId,
  item,
  itemImages,
  onItemUpdate,
  onImagesUpdate,
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

  const [isUploading, setIsUploading] = useState(false);
  const [filesToImport, setFilesToImport] = useState<File[]>([]);
  const [dataLength, setDataLength] = useState(0);
  const data: CloudinaryImageModel[] = [];

  const [formErrors, setFormErrors] = useState<any[]>([]);

  useEffect(() => {
    setDataLength(itemImages.length);
    if (filesToImport.length > 0) {
      uploadFile();
    }
  }, [filesToImport, itemImages]);

  const uploadFile = async () => {
    if (filesToImport.length === 0) {
      return;
    }

    if (filesToImport.length + dataLength > 3) {
      toast({
        variant: 'destructive',
        description: 'You can only upload up to 3 images for an item',
      });

      setFilesToImport([]);
      setIsUploading(false);
      return;
    }

    let error = 0;

    for await (const file of filesToImport) {
      const file_name = generateCustomId();

      const formData = new FormData();
      formData.append('image', file);
      formData.append(
        'file_name',
        `guides_sections_${item.guideSectionId}_${item.id}_${file_name}`,
      );
      formData.append(
        'asset_folder',
        `guides_${guideId}_sections_${item.guideSectionId}_${item.id}`,
      );
      formData.append('tags', `guides_${guideId}`);

      const { success, data, message } = await uploadImage(formData);

      if (!success) {
        error += 1;
      }
    }

    if (error === filesToImport.length) {
      toast({
        variant: 'destructive',
        description: 'Failed to upload image',
      });
    } else if (error > 0) {
      toast({
        variant: 'destructive',
        description: 'Some images failed to upload',
      });
    }

    setIsUploading(false);
    setFilesToImport([]);

    if (error < filesToImport.length) {
      onImagesUpdate();
    }
  };

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

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setIsUploading(true);

      if (rejectedFiles.length > 0) {
        if (rejectedFiles[0].errors[0].code === 'file-too-large') {
          toast({
            variant: 'destructive',
            description: 'File is too large',
          });
        } else if (rejectedFiles[0].errors[0].code === 'file-invalid-type') {
          toast({
            variant: 'destructive',
            description: 'Invalid file type. Please upload a PNG, JPG or JPEG',
          });
        } else if (rejectedFiles[0].errors[0].code === 'too-many-files') {
          toast({
            variant: 'destructive',
            description: 'You can only upload up to 3 images',
          });
        } else {
          toast({
            variant: 'destructive',
            description: 'Somenthing went wrong',
          });
        }

        setFilesToImport([]);
        setIsUploading(false);
        return;
      }

      setFilesToImport(acceptedFiles);
    },
    [],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png'],
    },
    multiple: true,
    maxFiles: 3,
    maxSize: 1 * 1024 * 1024,
    onDrop,
  });

  const handleDelete = async (publicId: string) => {
    setIsUploading(true);
    const deleteResponse = await deleteImage(publicId.replaceAll('/', '_'));

    if (deleteResponse.success) {
      onImagesUpdate();
    } else {
      toast({
        variant: 'destructive',
        description: 'Failed to delete image',
      });
    }
    setIsUploading(false);
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
      <div className="grid gap-6">
        {isUploading ? (
          <>
            <div className="grid grid-cols-5 gap-2">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-5 gap-2">
              {itemImages?.map((file, index) => (
                <Dialog>
                  <DialogTrigger>
                    <div
                      className="w-full h-full aspect-square p-0 rounded-md overflow-hidden relative focus-visible:ring-0 focus-visible:ring-transparent"
                      key={index}
                    >
                      <CldImage
                        alt="Sample Image"
                        key={index}
                        src={file.publicId}
                        width="800"
                        height="800"
                        crop={{
                          type: 'thumb',
                          source: true,
                        }}
                      />
                      <button
                        type="button"
                        className={cn('absolute', 'top-1 right-1')}
                        onClick={() => {
                          handleDelete(file.publicId);
                        }}
                      >
                        <span className="sr-only">remove item</span>
                        <div className="flex items-center justify-center w-6 h-6 bg-white bg-opacity-75 hover:bg-opacity-85 rounded-full">
                          <Trash2 className="w-4 h-4 duration-200 ease-in-out" />
                        </div>
                      </button>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="p-1 bg-white bg-opacity-80 border-none max-w-fit max-h-fit">
                    <CldImage
                      alt="Sample Image"
                      src={file.publicId}
                      height={file.height}
                      width={file.width}
                      className="rounded-md"
                    />
                  </DialogContent>
                </Dialog>
              ))}

              <div
                {...getRootProps()}
                className={`w-full h-full p-0 rounded-md overflow-hidden file_input ${itemImages.length >= 3 ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer '}`}
              >
                <input {...getInputProps()} />
                <div className="flex items-center justify-center border-2 border-dashed bg-background rounded-md aspect-square">
                  <div className="flex items-center justify-center text-center flex-col p-1">
                    {itemImages.length >= 3 ? (
                      <>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          You have reached the&nbsp;
                          <span className="font-semibold">
                            maximum number of images
                          </span>
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        <p className="m-2 text-xs text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>
                          &nbsp;or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG or JPEG (MAX 1MB)
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
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
