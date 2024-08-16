import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/extension/file-upload";

import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpDown, Eye, EyeOff, Pencil, Plus, Upload } from "lucide-react";
import { useState } from "react";
import { NewSectionItemDialog } from "./NewSectionItemDialog";
import { ReorderSectionItemDialog } from "./ReorderSectionItemDialog";
import { DropzoneOptions } from "react-dropzone";
import Image from "next/image";

const items = [
  {
    section_item_id: "a8480a03-3dba-4a8a-8e9f-58dee522da7e",
    guide_section_id: "e685c236-a67f-4264-833a-20be9c75b2f7",
    title: "Sushi \uD83C\uDF63",
    description:
      "Tokyo é famosa por seus sushis frescos e deliciosos. Visite o mercado de peixe Tsukiji para uma experiência autêntica.",
    item_order: 1,
    is_visible_on_demo: true,
    created_at: "2024-07-12 12:31:55.847793 +00:00",
    updated_at: null,
  },
  {
    section_item_id: "44107271-402b-48bc-ada3-0e1f9e1d70ef",
    guide_section_id: "e685c236-a67f-4264-833a-20be9c75b2f7",
    title: "Ramen \uD83C\uDF5C",
    description:
      "Não deixe de provar um autêntico ramen japonês. Alguns dos melhores lugares para comer ramen são Ichiran e Ippudo.",
    item_order: 2,
    is_visible_on_demo: false,
    created_at: "2024-07-12 12:31:55.847793 +00:00",
    updated_at: null,
  },
  {
    section_item_id: "01b9ae7e-fff6-41cc-8178-15059aabff63",
    guide_section_id: "e685c236-a67f-4264-833a-20be9c75b2f7",
    title: "Comida de Rua \uD83C\uDF62",
    description:
      "Explore as barracas de comida de rua em áreas como Shinjuku e Asakusa para provar iguarias como takoyaki e yakitori.",
    item_order: 3,
    is_visible_on_demo: false,
    created_at: "2024-07-12 12:31:55.847793 +00:00",
    updated_at: null,
  },
];

// const items: any[] = [];

export function GuideSectionItems() {
  const sectionTitle = "Alimentação";
  const [files, setFiles] = useState<File[] | null>(null);

  const [isNewItemDialogOpen, setIsNewItemDialogOpen] = useState(false);
  const [isReorderItemDialogOpen, setIsReorderItemDialogOpen] = useState(false);

  const [selectedSection, setSelectedSection] = useState<string | undefined>(
    undefined
  );
  const [menuTitle, setMenuTitle] = useState("");
  const [fullTitle, setFullTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visible, setVisible] = useState(false);

  const dropzone = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    multiple: true,
    maxFiles: 5,
    maxSize: 1 * 1024 * 1024,
  } satisfies DropzoneOptions;

  const handleSectionChange = (value: string) => {
    setSelectedSection(value);
  };

  const handleOpenNewSectionItemDialog = () => {
    setIsNewItemDialogOpen(true);
  };

  const handleCloseNewSectionItemDialog = () => {
    setIsNewItemDialogOpen(false);
  };

  const handleOpenReorderItemDialog = () => {
    setIsReorderItemDialogOpen(true);
  };

  const handleCloseReorderItemDialog = () => {
    setIsReorderItemDialogOpen(false);
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

    console.log("Add this:", valuesNotInFiles);
    console.log("Remove this:", filesNotInValues);

    //add delay
    setTimeout(() => {
      console.log("Done");
    }, 5000);

    setFiles(values);
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className="flex flex-col items-center justify-center mt-16">
            <p className="text-gray-500">
              The &ldquo;{sectionTitle}&rdquo; section is empty. Add your first
              item to get started! 🎯
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
              onCancel={handleCloseNewSectionItemDialog}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Section Items</CardTitle>
        <CardDescription>
          Manage your &ldquo;{sectionTitle}&rdquo; section items
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="flex justify-end gap-3 pb-4">
            <div className="flex gap-1">
              <Button size="sm" onClick={handleOpenNewSectionItemDialog}>
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
              <NewSectionItemDialog
                isOpen={isNewItemDialogOpen}
                onCancel={handleCloseNewSectionItemDialog}
              />
              <Button size="sm" onClick={handleOpenReorderItemDialog}>
                <ArrowUpDown className="h-4 w-4" />
                Reorder
              </Button>
              <ReorderSectionItemDialog
                isOpen={isReorderItemDialogOpen}
                data={items}
                onCancel={handleCloseReorderItemDialog}
              />
            </div>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {items.map((item) => (
              <AccordionItem
                className="border-0 mb-2"
                key={item.section_item_id}
                value={item.section_item_id}
              >
                <AccordionTrigger className="bg-slate-100 px-2 rounded-md no-underline hover:no-underline text-slate-600">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid mt-4 gap-6 px-3">
                    <div className="grid gap-3">
                      <Label htmlFor="name">Title</Label>
                      <Input
                        id="name"
                        type="text"
                        className="w-full"
                        value={item.title}
                        placeholder="Enter the full title"
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={item.description}
                        placeholder="Write a description for your guide"
                        className="h-32"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="airplane-mode"
                        checked={item.is_visible_on_demo}
                      />
                      <Label htmlFor="airplane-mode">Visible on demo?</Label>
                    </div>
                    <div className="flex items-center space-x-2">
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
                              aria-roledescription={`file ${i + 1} containing ${
                                file.name
                              }`}
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
                                    <span className="font-semibold">
                                      Click to upload
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </FileInput>
                          )}
                        </FileUploaderContent>
                      </FileUploader>
                    </div>
                    <div className="flex gap-2">
                      <Button size="default">Update Item</Button>
                      <Button size="default">Delete Item</Button>
                    </div>
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
