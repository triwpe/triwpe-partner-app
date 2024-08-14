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

export function GuideDetailsForm() {
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
              value="🌆 Guia Completo de Tokyo 🌟"
              disabled
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="name">Location</Label>
            <Input
              id="name"
              type="text"
              className="w-full"
              value="Tokyo, Japan"
              disabled
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="name">Duration (days)</Label>
            <Input id="name" type="text" className="w-1/3" placeholder="0" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="name">Price</Label>
            <Input id="name" type="text" className="w-1/3" placeholder="0.00" />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="name">Language</Label>
            <Select>
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
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
