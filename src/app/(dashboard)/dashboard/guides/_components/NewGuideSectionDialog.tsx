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
}
