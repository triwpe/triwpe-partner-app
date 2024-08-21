import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";
import { Loader2 } from "lucide-react";

interface NewGuideDialogTitleStepProps {
  isLoading: boolean;
  onSuccess: (title: string) => void;
  onCancel: () => void;
}

export const NewGuideDialogTitleStep = ({
  isLoading,
  onSuccess,
  onCancel,
}: NewGuideDialogTitleStepProps) => {
  const [newGuideTitle, setNewGuideTitle] = useState<string>("");

  const handleTitleInput = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNewGuideTitle(e.target.value);
  };

  const handleSubmit = async () => {
    onSuccess(newGuideTitle);
  };
  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">Name your guide ✏️</CardTitle>
      </CardHeader>
      <CardContent>
        <div id="step-2">
          <div className="grid w-full items-center gap-6">
            <div className="flex flex-col space-y-1.5">
              <Input
                id="title"
                name="title"
                placeholder="Enter the guide title"
                onChange={handleTitleInput}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2 justify-end">
        <Button onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="gap-2"
          disabled={isLoading || newGuideTitle === ""}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create
        </Button>
      </CardFooter>
    </Card>
  );
};
