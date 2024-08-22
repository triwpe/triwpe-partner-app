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
import {
  ArrowUpDown,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NewSectionItemDialog } from "./NewSectionItemDialog";
import { ReorderSectionItemDialog } from "./ReorderSectionItemDialog";
import { DropzoneOptions } from "react-dropzone";
import Image from "next/image";
import {
  deleteSectionItem,
  getSectionItems,
  updateSectionItem,
} from "@/actions/guide";
import { useToast } from "@/components/ui/use-toast";
import { Alert } from "@/components/Alert";
import { createNewSectionItemSchema } from "@/lib/zod";

interface GuideSectionItemProps {
  selectedSectionId: string | undefined;
  guideSectionTitle: string | null;
}

export function GuideSectionItems({
  selectedSectionId,
  guideSectionTitle,
}: GuideSectionItemProps) {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[] | null>(null);

  const [isNewItemDialogOpen, setIsNewItemDialogOpen] = useState(false);
  const [isReorderItemDialogOpen, setIsReorderItemDialogOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<string | undefined>("");

  const [selectedSection, setSelectedSection] = useState<string | undefined>(
    undefined
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isVisibleOnDemo, setIsVisibleOnDemo] = useState<boolean>(false);

  const [items, setItems] = useState<any[]>([]);

  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [formErrors, setFormErrors] = useState<any[]>([]);

  useEffect(() => {
    console.log(selectedSectionId);
    fetchSectionItemData();
  }, [selectedSectionId]);

  const fetchSectionItemData = async () => {
    if (selectedSectionId === undefined) {
      return;
    }

    console.log("Fetching section items for:", selectedSectionId);

    const response = await getSectionItems(selectedSectionId);
    if (!response.success) {
      console.error(response.message);
      return;
    }
    console.log(response.data);
    setItems(response.data);
  };

  const dropzone = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    multiple: true,
    maxFiles: 5,
    maxSize: 1 * 1024 * 1024,
  } satisfies DropzoneOptions;

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    setIsLoadingUpdate(true);
    setFormErrors([]);

    const parseResponse = await createNewSectionItemSchema.safeParseAsync({
      description: description,
    });

    if (parseResponse.success) {
      if (
        selectedSectionId === undefined ||
        selectedItem === "" ||
        selectedItem === undefined
      ) {
        return;
      }

      const updateResponse = await updateSectionItem(
        selectedSectionId,
        selectedItem,
        title,
        description,
        isVisibleOnDemo
      );
      if (updateResponse.success) {
        toast({
          variant: "success",
          description: "Item updated successfully",
        });
        fetchSectionItemData();
      } else {
        toast({
          variant: "destructive",
          description: "Failed to update guide section",
        });
      }
    } else {
      await addError(parseResponse.error);
    }
    setIsLoadingUpdate(false);
  };

  const addError = async (error: any) => {
    let errArr: any[] = [];
    const { errors: err } = error;
    for (var i = 0; i < err.length; i++) {
      errArr.push({ for: err[i].path[0], message: err[i].message });
    }
    setFormErrors(errArr);
  };

  const handleDeleteItem = async () => {
    setIsLoadingDelete(true);
    setIsDeleteAlertOpen(true);
  };

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const handleConfirmDeleteAlert = async (): Promise<void> => {
    setIsDeleteAlertOpen(false);

    if (!selectedSectionId || !selectedItem || selectedItem === "") {
      return;
    }

    const deleteResponse = await deleteSectionItem(
      selectedSectionId,
      selectedItem
    );

    if (deleteResponse.success) {
      toast({
        variant: "success",
        description: "Guide section deleted successfully",
      });
      fetchSectionItemData();
    } else {
      toast({
        variant: "destructive",
        description: "Failed to delete guide section",
      });
    }
    setIsLoadingDelete(false);
  };

  const handleCancelDeleteAlert = async () => {
    setIsDeleteAlertOpen(false);
    setIsLoadingDelete(false);
  };

  const handleSelectedItem = (value: string) => {
    setSelectedItem(value);

    if (value === "" || value === undefined || value === null) {
      setTitle("");
      setDescription("");
      setIsVisibleOnDemo(false);
      return;
    }

    const findItem = items.find((item) => item.id === value);
    if (findItem) {
      setTitle(findItem.title);
      setDescription(findItem.description);
      setIsVisibleOnDemo(findItem.is_visible_on_demo);
    }
  };

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

  const handleNewSectionItemAdded = () => {
    fetchSectionItemData();
    setIsNewItemDialogOpen(false);
    toast({
      variant: "success",
      description: "Item added successfully",
    });
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

  if (selectedSectionId === undefined) {
    return <></>;
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className="flex flex-col items-center justify-center mt-16">
            <p className="text-gray-500">
              The{" "}
              <span className="font-bold">
                &ldquo;{guideSectionTitle}&rdquo;{" "}
              </span>
              section is empty. Add your first item to get started! 🎯
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
              sectionId={selectedSectionId}
              sectionTitle={guideSectionTitle}
              onSuccess={handleNewSectionItemAdded}
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
          Manage your{" "}
          <span className="font-bold">&ldquo;{guideSectionTitle}&rdquo; </span>{" "}
          section items
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
                sectionId={selectedSectionId}
                sectionTitle={guideSectionTitle}
                onSuccess={handleNewSectionItemAdded}
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
          <Accordion
            type="single"
            collapsible
            className="w-full"
            onValueChange={(e) => handleSelectedItem(e)}
          >
            {items.map((item) => (
              <AccordionItem
                className="border-0 mb-2"
                key={item.id}
                value={item.id}
              >
                <AccordionTrigger className="bg-slate-100 px-2 rounded-md no-underline hover:no-underline text-slate-600">
                  {item.title === "" ? "Untitled Item" : item.title}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid mt-4 gap-6 px-3">
                    <div className="grid gap-3">
                      <Label htmlFor="name">Title</Label>
                      <Input
                        id="title"
                        title="title"
                        type="text"
                        className="w-full"
                        value={title}
                        placeholder="Enter the full title"
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="description">Description</Label>
                      <div>
                        <Textarea
                          id="description"
                          name="description"
                          value={description}
                          placeholder="Write a description for your guide"
                          onChange={(e) => setDescription(e.target.value)}
                          className={`h-32 ${
                            formErrors.some(
                              (error) => error.for === "description"
                            )
                              ? "border-red-600"
                              : ""
                          }`}
                        />
                        <div className="mt-1 ml-1 text-xs text-red-600">
                          {
                            formErrors.find(
                              (error) => error.for === "description"
                            )?.message
                          }
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
                      <Button
                        size="default"
                        onClick={handleSubmit}
                        disabled={isLoadingUpdate}
                      >
                        {isLoadingUpdate ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                            Updating...
                          </>
                        ) : (
                          "Update Item"
                        )}
                      </Button>
                      <Button
                        size="default"
                        onClick={handleDeleteItem}
                        disabled={isLoadingDelete}
                      >
                        {isLoadingDelete ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                            Deleting...
                          </>
                        ) : (
                          "Delete Item"
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
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}
