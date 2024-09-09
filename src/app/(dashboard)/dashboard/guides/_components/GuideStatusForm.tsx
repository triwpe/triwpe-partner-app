import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GuideProps } from '../_types/components';

interface GuideStatusFormProps {
  status: string;
}

export function GuideStatusForm({ status }: GuideStatusFormProps) {
  const handleStatusChange = (value: string) => {
    console.log(value);
  };

  return (
    <Card className="text-[#344054] shadow-none border-[#e0e0e0] rounded-md">
      <CardHeader>
        <CardTitle>Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Select
              defaultValue={status}
              onValueChange={(value) => {
                handleStatusChange(value);
              }}
            >
              <SelectTrigger
                id="status"
                aria-label="Select status"
                className="h-14 border-[#d9d9d9] text-[#535773] focus:ring-0 focus:ring-transparent"
              >
                <SelectValue placeholder="Select guide status" />
              </SelectTrigger>
              <SelectContent className="text-[#535773]">
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
