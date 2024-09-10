import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CldImage } from 'next-cloudinary';

import { Loader2, Paperclip, Trash2, Upload } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import Dropzone, { FileRejection, useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { CloudinaryImageModel } from '@/types/models/images';
import { deleteImage, uploadImage } from '@/actions/image';
import { set } from 'zod';
import { generateCustomId } from '@/lib/genid';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface GuideImageCoverProps {
  guideId: string;
  data: CloudinaryImageModel | null;
  onChange: () => void;
}

export function GuideImageCover({
  guideId,
  data,
  onChange,
}: GuideImageCoverProps) {
  const { toast } = useToast();

  const [isUploading, setIsUploading] = useState(false);
  const [fileToImport, setFileToImport] = useState<File | null>(null);

  useEffect(() => {
    if (fileToImport) {
      uploadFile();
    }
  }, [fileToImport]);

  const uploadFile = async () => {
    if (!fileToImport) {
      return;
    }
    const file_name = generateCustomId();

    const formData = new FormData();
    formData.append('image', fileToImport);
    formData.append('file_name', `guides_${guideId}_cover_${file_name}`);
    formData.append('asset_folder', `guides_${guideId}_cover`);
    formData.append('tags', `guides_${guideId}`);

    const uploadResponse = await uploadImage(formData);

    if (!uploadResponse.success) {
      toast({
        variant: 'destructive',
        description: 'Failed to upload image',
      });
    } else {
      onChange();
    }

    setIsUploading(false);
    setFileToImport(null);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
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
        } else {
          toast({
            variant: 'destructive',
            description: 'Somenthing went wrong',
          });
        }
        return;
      }

      setFileToImport(acceptedFiles[0]);
    },
    [],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png'],
    },
    multiple: false,
    maxFiles: 1,
    maxSize: 1 * 1024 * 1024,
    onDrop,
  });

  const handleDelete = async (publicId: string) => {
    setIsUploading(true);
    const deleteResponse = await deleteImage(publicId.replaceAll('/', '_'));
    console.log('deleteResponse', deleteResponse);
    console.log('deleteResponse', deleteResponse.success);
    if (deleteResponse.success) {
      onChange();
    } else {
      toast({
        variant: 'destructive',
        description: 'Failed to delete image',
      });
    }
    setIsUploading(false);
  };

  return (
    <Card className="text-[#344054] shadow-none border-[#e0e0e0] rounded-md">
      <CardHeader>
        <CardTitle>Guide Cover</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`grid gap-6 ${isUploading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
        >
          {isUploading ? (
            <>
              <div className="w-full h-full aspect-square inset-0 flex justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            </>
          ) : (
            <>
              {!data ? (
                <>
                  <div {...getRootProps()} className="file_input">
                    <input {...getInputProps()} />
                    <div className="flex items-center justify-center h-32 w-full border-2 border-dashed bg-background rounded-md">
                      <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                        <Upload className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                        <p className="m-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>
                          &nbsp;or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPG or JPEG (MAX 1MB)
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-center">
                    {data && (
                      <Dialog>
                        <DialogTrigger>
                          <div className="p-0 rounded-md overflow-hidden relative focus-visible:ring-0 focus-visible:ring-transparent">
                            <CldImage
                              alt="Sample Image"
                              src={data.publicId}
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
                                handleDelete(data.publicId);
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
                            src={data.publicId}
                            height={data.height}
                            width={data.width}
                            className="rounded-md"
                          />
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
