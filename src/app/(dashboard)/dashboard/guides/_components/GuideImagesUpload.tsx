import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CldImage } from 'next-cloudinary';

import { Loader2, Paperclip, Trash2, Upload } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import Dropzone, { FileRejection, useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { CloudinaryImageModel } from '@/types/models/images';
import { generateCustomId } from '@/lib/genid';
import { deleteImage, uploadImage } from '@/actions/image';

interface GuideImagesUploadProps {
  guideId: string;
  data: CloudinaryImageModel[];
  onChange: () => void;
}

export function GuideImagesUpload({
  guideId,
  data,
  onChange,
}: GuideImagesUploadProps) {
  console.log('data', data);
  const { toast } = useToast();

  const [isUploading, setIsUploading] = useState(false);
  const [filesToImport, setFilesToImport] = useState<File[]>([]);
  const [dataLength, setDataLength] = useState(0);

  useEffect(() => {
    setDataLength(data.length);
    if (filesToImport.length > 0) {
      uploadFile();
    }
  }, [filesToImport]);

  const uploadFile = async () => {
    if (filesToImport.length === 0) {
      return;
    }

    if (filesToImport.length + dataLength > 3) {
      toast({
        variant: 'destructive',
        description: 'You can only upload up to 3 images',
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
      formData.append('file_name', `guides_${guideId}_${file_name}`);
      formData.append('asset_folder', `guides_${guideId}`);

      const { success, data, message } = await uploadImage(formData);
      console.log('uploadResponse', success);

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
      onChange();
    }
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
    <Card>
      <CardHeader>
        <CardTitle>Guide Images</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {isUploading ? (
            <>
              <div className="w-full h-full aspect-square inset-0 flex justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            </>
          ) : (
            <>
              <div
                {...getRootProps()}
                className={`file_input ${data.length >= 3 ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer '}`}
              >
                <input {...getInputProps()} />
                <div className="flex items-center justify-center h-32 w-full border-2 border-dashed bg-background rounded-md">
                  <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                    <Upload className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                    {data.length >= 3 ? (
                      <>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          You have reached the&nbsp;
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">
                            maximum number of images
                          </span>
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="m-2 text-sm text-gray-500 dark:text-gray-400">
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

              <div className="grid grid-cols-3 gap-2">
                {data?.map((file, index) => (
                  <div
                    className="p-0 rounded-md overflow-hidden relative"
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
                ))}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
