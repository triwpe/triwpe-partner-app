import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { LocationAutoComplete } from "@/components/dashboard/LocationAutoComplete";
import { useState } from "react";

interface NewGuideDialogLocationStepProps {
  onSuccess: (newGuideLocation: any) => void;
  onCancel: () => void;
}

export const NewGuideDialogLocationStep = ({
  onSuccess,
  onCancel,
}: NewGuideDialogLocationStepProps) => {
  const [newGuideLocation, setNewGuideLocation] = useState<any>("");

  const handleLocationChange = async (selected_location: any) => {
    selected_location === undefined
      ? setNewGuideLocation("")
      : setNewGuideLocation(selected_location);
  };

  const handleSubmit = async () => {
    onSuccess(newGuideLocation);
  };

  const handleCancel = async () => {
    onCancel();
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">
          Choose your guide location 🗺️
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div id="step-1">
          <div className="grid w-full items-center gap-6">
            <div className="flex flex-col space-y-2">
              <LocationAutoComplete
                emptyMessage="No results found"
                placeholder="Search for a location"
                onValueChange={(value) => handleLocationChange(value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2 justify-end">
        <Button onClick={handleCancel} variant="outline">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="gap-2"
          disabled={newGuideLocation === ""}
        >
          Next <MoveRight />
        </Button>
      </CardFooter>
    </Card>
  );
};
