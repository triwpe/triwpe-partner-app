import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { GuideProps } from "../_types/components";
import { set } from "zod";
import { GuideModel, GuideUpdateModel } from "@/types/models/guides";
import { Button } from "@/components/ui/button";
import { updateGuideSchema, updateGuideSectionSchema } from "@/lib/zod";
import { updateGuide } from "@/actions/guide";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface GuideDetailsFormProps {
  guide: GuideModel;
}

export function GuideDetailsForm({ guide }: GuideDetailsFormProps) {
  const { toast } = useToast();

  const [title, setTitle] = useState<string>(guide.title);
  const location: string = guide.location.placeName;
  const [duration, setDuration] = useState<string>(
    guide.duration?.toString() || ""
  );
  const [price, setPrice] = useState<string>(guide.price?.toString() || "");
  const [language, setLanguage] = useState<string | undefined>(
    guide.language || undefined
  );
  const [description, setDescription] = useState<string>(
    guide.description || ""
  );

  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

  const [formErrors, setFormErrors] = useState<any[]>([]);

  const handleUpdateGuide = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    setIsLoadingUpdate(true);
    setFormErrors([]);

    const isFormValid = updateGuideSchema.safeParse({
      title: title,
      duration: duration,
      price: price,
    });

    if (!isFormValid.success) {
      await addError(isFormValid.error);
      setIsLoadingUpdate(false);
      return;
    }

    const updated_data: GuideUpdateModel = {
      title: title,
      duration: parseInt(duration),
      price: parseInt(price),
      language: language,
      description: description,
    };    

    const updateResponse = await updateGuide(guide.id, updated_data);

    if (updateResponse.success) {
      toast({
        variant: "success",
        description: "Guide updated successfully",
      });
    } else {
      toast({
        variant: "destructive",
        description: "Failed to update guide",
      });
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guide Details</CardTitle>
        <CardDescription>Provide the key details of your guide</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="name">Title</Label>
            <div>
              <Input
                id="name"
                type="text"
                className="w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="mt-1 ml-1 text-xs text-red-600">
                {formErrors.find((error) => error.for === "title")?.message}
              </div>
            </div>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="name">Location</Label>
            <Input
              id="name"
              type="text"
              className="w-full"
              value={location}
              disabled
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="name">Duration (days)</Label>
            <div>
              <Input
                id="name"
                type="text"
                className="w-1/3"
                placeholder="Duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
              <div className="mt-1 ml-1 text-xs text-red-600">
                {formErrors.find((error) => error.for === "duration")?.message}
              </div>
            </div>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="name">Price</Label>
            <div>
              <Input
                id="name"
                type="text"
                className="w-1/3"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <div className="mt-1 ml-1 text-xs text-red-600">
                {formErrors.find((error) => error.for === "price")?.message}
              </div>
            </div>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="name">Language</Label>
            <Select
              value={language}
              onValueChange={(value) => {
                setLanguage(value);
              }}
            >
              <SelectTrigger
                id="status"
                aria-label="Select status"
                className="w-1/2"
              >
                <SelectValue placeholder="Select guide language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="it">Italian</SelectItem>
                <SelectItem value="pt">Portuguese</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
                <SelectItem value="ko">Korean</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Write a description for your guide"
              className="min-h-32"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex mt-4 justify-end">
            <Button
              size="default"
              onClick={handleUpdateGuide}
              disabled={isLoadingUpdate}
            >
              {isLoadingUpdate ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : (
                "Update Section"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
