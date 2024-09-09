'use client';

import { Button } from '@/components/ui/button';
import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NewGuideDialog } from '../_components/NewGuideDialog';
import { validate as uuidValidate } from 'uuid';
import Loading from '@/app/(dashboard)/loading';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Image from 'next/image';
import Logo from '../../../../../../public/logo.svg';
import { ChevronLeft, PlusCircle, Upload } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { GuideDetailsForm } from '../_components/GuideDetailsForm';
import { GuideStatusForm } from '../_components/GuideStatusForm';
import { GuideCategoriesForm } from '../_components/GuideCategoriesForm';
import { GuideSections } from '../_components/GuideSections';
import { GuideSectionItems } from '../_components/GuideSectionItems';
import { GuideImagesUpload } from '../_components/GuideImagesUpload';
import { GuideImageCover } from '../_components/GuideImageCover';
import { fetchGuideSections, fetchGuide, updateGuide } from '@/actions/guide';
import { GuideProps } from '../_types/components';
import { useToast } from '@/components/ui/use-toast';
import { Alert } from '@/components/ui/alert';
import { GuideSectionModel } from '@/types/models/guide-section';
import { GuideModel } from '@/types/models/guides';
import { CloudinaryImageModel } from '@/types/models/images';
import { set } from 'zod';
import { fetchImages } from '@/actions/image';

interface PageParams {
  id: string;
}

export default function Page({ params }: { params: PageParams }) {
  const router = useRouter();
  const { toast } = useToast();

  const [guideId, setGuideId] = useState(params.id);

  const [guideData, setGuideData] = useState<GuideModel | null>(null);
  const [sections, setSections] = useState<GuideSectionModel[]>([]);
  const [guideCover, setGuideCover] = useState<CloudinaryImageModel | null>(
    null,
  );
  const [guideImages, setGuideImages] = useState<CloudinaryImageModel[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [selectedSection, setSelectedSection] = useState<string | undefined>();
  const [selectedSectionTitle, setSelectedSectionTitle] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!uuidValidate(guideId)) {
      router.replace('/dashboard/guides/new');
    }

    fetchGuideData();
    fetchGuideSectionData();
    fetchGuideImages();

    setIsLoading(false);
  }, [guideId]);

  const fetchGuideData = async () => {
    const { success, data, message } = await fetchGuide(guideId);
    if (!success || !data) {
      router.replace('/dashboard/guides/new');
    } else {
      setGuideData(data);
    }
  };

  const fetchGuideSectionData = async () => {
    const { success, data, message } = await fetchGuideSections(guideId);
    if (!success) {
      return;
    }

    setSections(data || []);
  };

  const fetchGuideImages = async () => {
    const { success, data, message } = await fetchImages(`guides_${guideId}`);
    if (!success) {
      return;
    }

    const cover: CloudinaryImageModel | undefined = data?.find((image) =>
      image.publicId.includes('cover'),
    );
    setGuideCover(cover === undefined ? null : cover);

    console.log('2. cover');

    const guideImages = data?.filter(
      (image) => !image.publicId.includes('cover'),
    );
    setGuideImages(guideImages === undefined ? [] : guideImages);

    console.log('3. guideImages');
  };

  if (isLoading || !guideData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto grid flex-1 auto-rows-max gap-4 overflow-hidden">
      <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <GuideDetailsForm guide={guideData} />
          <GuideSections
            guideId={guideId}
            sections={sections}
            onSectionUpdate={fetchGuideSectionData}
          />
          <GuideSectionItems
            sections={sections}
            onItemUpdate={fetchGuideSectionData}
          />
        </div>
        <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
          <GuideStatusForm status={guideData.status} />
          <GuideCategoriesForm
            guideId={guideData?.id}
            mainCategory={
              guideData?.categories?.find((category) => category.isMain)?.id
            }
            firstOptionalCategory={
              guideData?.categories?.filter((category) => !category.isMain)[0]
                ?.id
            }
            secondOptionalCategory={
              guideData?.categories?.filter((category) => !category.isMain)[1]
                ?.id
            }
          />
          <GuideImageCover
            guideId={guideId}
            data={guideCover}
            onChange={fetchGuideImages}
          />
          <GuideImagesUpload
            guideId={guideId}
            data={guideImages}
            onChange={fetchGuideImages}
          />
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 md:hidden">
        <Button variant="outline" size="sm">
          Discard
        </Button>
        <Button size="sm">Save Product</Button>
      </div>
    </div>
  );
}
