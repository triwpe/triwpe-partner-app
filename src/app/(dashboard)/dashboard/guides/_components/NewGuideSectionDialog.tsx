import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { NewGuideDialogTitleStep } from './NewGuideDialogTitleStep';
import { NewGuideDialogLocationStep } from './NewGuideDialogLocationStep';
import { useRouter } from 'next/navigation';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { createNewGuideSectionSchema } from '@/lib/zod';
import { createGuideSection } from '@/actions/guide';
import { Loader, Loader2, Terminal, TriangleAlert, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { set } from 'zod';

interface NewGuideSectionDialogProps {
  isOpen: boolean;
  guideId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function NewGuideSectionDialog({
  isOpen,
  guideId,
  onSuccess,
  onCancel,
}: NewGuideSectionDialogProps) {
  const router = useRouter();

  const [menuTitle, setMenuTitle] = useState<string>('');
  const [fullTitle, setFullTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isVisibleOnDemo, setIsVisibleOnDemo] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<any[]>([]);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setFormErrors([]);
    setCreateError(null);

    const parseResponse = await createNewGuideSectionSchema.safeParseAsync({
      menuTitle: menuTitle,
      fullTitle: fullTitle,
    });

    if (parseResponse.success) {
      console.log('guideId', guideId);
      const createResponse = await createGuideSection(
        guideId,
        menuTitle,
        fullTitle,
        description,
        isVisibleOnDemo,
      );
      if (createResponse.success) {
        setMenuTitle('');
        setFullTitle('');
        setDescription('');
        setIsVisibleOnDemo(false);
        onSuccess();
      } else {
        setCreateError('Something went wrong. Please try again.');
      }
    } else {
      await addError(parseResponse.error);
    }
    setIsLoading(false);
  };

  const handleCancelDialog = async () => {
    setFormErrors([]);
    setCreateError(null);
    setMenuTitle('');
    setFullTitle('');
    setDescription('');
    setIsVisibleOnDemo(false);
    onCancel();
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
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-4xl">
        <AlertDialogHeader>
          <VisuallyHidden.Root>
            <AlertDialogTitle></AlertDialogTitle>
          </VisuallyHidden.Root>
          <AlertDialogDescription>
            <Card className="border-0 shadow-none text-[#344054]">
              <form onSubmit={handleSubmit} autoComplete="off">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Add a new guide section️
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {createError && (
                      <Alert className="bg-red-50 border-red-300 text-red-400">
                        <X color="#EF5350" className="h-4 w-4" />
                        <AlertTitle className="font-bold">Hey!</AlertTitle>
                        <AlertDescription>{createError}</AlertDescription>
                      </Alert>
                    )}
                    <div className="grid gap-2">
                      <Label htmlFor="name">Menu Title</Label>
                      <div>
                        <Input
                          id="menu-title"
                          name="menu-title"
                          type="text"
                          className={`w-full h-14 border-[#d9d9d9] text-[#535773] focus-visible:ring-0 focus-visible:ring-transparent ${
                            formErrors.some(
                              (error) => error.for === 'menuTitle',
                            )
                              ? 'border-red-600'
                              : ''
                          }`}
                          placeholder="Enter the menu title"
                          value={menuTitle}
                          onChange={(e) => setMenuTitle(e.target.value)}
                        />
                        <div className="mt-1 ml-1 text-xs text-red-600">
                          {
                            formErrors.find(
                              (error) => error.for === 'menuTitle',
                            )?.message
                          }
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Title</Label>
                      <div>
                        <Input
                          id="full-title"
                          name="full-title"
                          type="text"
                          className={`w-full h-14 border-[#d9d9d9] text-[#535773] focus-visible:ring-0 focus-visible:ring-transparent ${
                            formErrors.some(
                              (error) => error.for === 'fullTitle',
                            )
                              ? 'border-red-600'
                              : ''
                          }`}
                          placeholder="Enter the full title"
                          value={fullTitle}
                          onChange={(e) => setFullTitle(e.target.value)}
                        />
                        <div className="mt-1 ml-1 text-xs text-red-600">
                          {
                            formErrors.find(
                              (error) => error.for === 'fullTitle',
                            )?.message
                          }
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Write a description for your guide"
                        className="min-h-32 border-[#d9d9d9] text-[#535773] focus-visible:ring-0 focus-visible:ring-transparent"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is-visible-on-demo"
                        name="is-visible-on-demo"
                        checked={isVisibleOnDemo}
                        onCheckedChange={(e) => setIsVisibleOnDemo(e)}
                      />
                      <Label htmlFor="is-visible-on-demo">
                        Visible on demo?
                      </Label>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="gap-2 justify-end">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={handleCancelDialog}
                    className="h-14 border-[#d9d9d9] text-[#535773] text-base hover:bg-transparent hover:text-[#535773]"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="lg"
                    type="submit"
                    disabled={isLoading}
                    className="h-14 bg-[#1fd79b] text-[#344054] text-base hover:bg-[#1fd79b]"
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Add Section
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
