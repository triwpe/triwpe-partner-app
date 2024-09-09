import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChangeEvent, useState } from 'react';
import { Loader2 } from 'lucide-react';

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
  const [newGuideTitle, setNewGuideTitle] = useState<string>('');

  const handleTitleInput = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNewGuideTitle(e.target.value);
  };

  const handleSubmit = async () => {
    onSuccess(newGuideTitle);
  };
  return (
    <Card className="border-0 shadow-none text-[#344054]">
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
                className={`w-full h-14 border-[#d9d9d9] text-[#535773] focus-visible:ring-0 focus-visible:ring-transparent`}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2 justify-end">
        <Button
          onClick={onCancel}
          variant="outline"
          className="h-14 border-[#d9d9d9] text-[#535773] text-base hover:bg-transparent hover:text-[#535773]"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="h-14 bg-[#1fd79b] text-[#344054] text-base hover:bg-[#1fd79b]"
          disabled={isLoading || newGuideTitle === ''}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create
        </Button>
      </CardFooter>
    </Card>
  );
};
