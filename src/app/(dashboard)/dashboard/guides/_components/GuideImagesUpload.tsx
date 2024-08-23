import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/extension/file-upload";
import { Paperclip, Upload } from "lucide-react";
import { useState } from "react";
import { DropzoneOptions } from "react-dropzone";
import Image from "next/image";

export function GuideImagesUpload() {
  const [files, setFiles] = useState<File[] | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  const dropzone = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    multiple: true,
    maxFiles: 5,
    maxSize: 1 * 1024 * 1024,
  } satisfies DropzoneOptions;

  const handleFileChange = (values: File[] | null) => {
    setIsUploading(true);
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
    setIsUploading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guide Images</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <FileUploader
            value={files}
            onValueChange={handleFileChange}
            dropzoneOptions={dropzone}
          >
            <FileInput>
              <div className="flex items-center justify-center h-32 w-full border-2 border-dashed bg-background rounded-md">
                <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                  <Upload className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                  <p className="m-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span>
                    &nbsp;or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG or JPEG
                  </p>
                </div>
              </div>
            </FileInput>
            <FileUploaderContent className="grid grid-cols-3 gap-2">
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
            </FileUploaderContent>
          </FileUploader>
        </div>
      </CardContent>
    </Card>
  );
}
