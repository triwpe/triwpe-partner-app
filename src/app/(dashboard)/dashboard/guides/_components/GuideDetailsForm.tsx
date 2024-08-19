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

interface GuideDetailsFormProps {
  title: string;
  location: string;
  duration: number | null;
  price: number | null;
  language: string | undefined;
  description: string | null;
  onUpdate: (updatedData: Partial<GuideProps>) => void;
}

export function GuideDetailsForm({
  title,
  location,
  duration,
  price,
  language,
  description,
  onUpdate,
}: GuideDetailsFormProps) {
  const [selectedOption, setSelectedOption] = useState(language);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ title: e.target.value });
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ duration: parseInt(e.target.value) });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ price: parseFloat(e.target.value) });
  };

  const handleLanguageChange = (value: string) => {
    setSelectedOption(value);
    onUpdate({ language: value });
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onUpdate({ description: e.target.value });
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
            <Input
              id="name"
              type="text"
              className="w-full"
              value={title}
              onChange={handleTitleChange}
            />
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
            <Input
              id="name"
              type="text"
              className="w-1/3"
              placeholder="Duration"
              value={duration?.toString()}
              onChange={handleDurationChange}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="name">Price</Label>
            <Input
              id="name"
              type="text"
              className="w-1/3"
              placeholder="Price"
              value={price?.toString()}
              onChange={handlePriceChange}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="name">Language</Label>
            <Select
              value={selectedOption}
              onValueChange={(value) => {
                handleLanguageChange(value);
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
              value={description?.toString()}
              onChange={handleDescriptionChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
