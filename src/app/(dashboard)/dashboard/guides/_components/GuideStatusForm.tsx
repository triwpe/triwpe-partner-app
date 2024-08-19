import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GuideProps } from "../_types/components";

interface GuideStatusFormProps {
  status: string;
  onUpdate: (updatedData: Partial<GuideProps>) => void;
}

export function GuideStatusForm({ status, onUpdate }: GuideStatusFormProps) {
  const handleStatusChange = (value: string) => {
    onUpdate({ status: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Select
              defaultValue={status}
              onValueChange={(value) => {
                handleStatusChange(value);
              }}
            >
              <SelectTrigger id="status" aria-label="Select status">
                <SelectValue placeholder="Select guide status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
