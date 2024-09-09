import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoaderIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GuideProps } from '../_types/components';
import {
  deleteGuideCategory,
  getCategories,
  updateGuideCategory,
} from '@/actions/category';
import { set } from 'zod';

interface GuideCategoriesFormProps {
  guideId: string;
  mainCategory: string | undefined;
  firstOptionalCategory: string | undefined;
  secondOptionalCategory: string | undefined;
}

export function GuideCategoriesForm({
  guideId,
  mainCategory,
  firstOptionalCategory,
  secondOptionalCategory,
}: GuideCategoriesFormProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [keyMain, setKeyMain] = useState(+new Date());
  const [keyFirstOptional, setKeyFirstOptional] = useState(+new Date());
  const [keySecondOptional, setKeySecondOptional] = useState(+new Date());

  const [selectedMainCategory, setSelectedMainCategory] = useState<
    string | undefined
  >(mainCategory);
  const [selectedFirstOptionalCategory, setSelectedFirstOptionalCategory] =
    useState<string | undefined>(firstOptionalCategory);
  const [selectedSecondOptionalCategory, setSelectedSecondOptionalCategory] =
    useState<string | undefined>(secondOptionalCategory);

  const [isLoadingMainCategory, setIsLoadingMainCategory] = useState(false);
  const [isLoadingFirstOptionalCategory, setIsLoadingFirstOptionalCategory] =
    useState(false);
  const [isLoadingSecondOptionalCategory, setIsLoadingSecondOptionalCategory] =
    useState(false);

  useEffect(() => {
    fetchGuideData();
  }, []);

  const fetchGuideData = async () => {
    const response = await getCategories();
    if (response.success) {
      setCategories(response.data);
    }
  };

  const filterCategories = (exclude: string[]) => {
    return categories.filter((category) => !exclude.includes(category.id));
  };

  const handleMainCategoryChange = async (value: any) => {
    setIsLoadingMainCategory(true);
    const response = await updateGuideCategory(
      guideId,
      value,
      true,
      selectedMainCategory,
    );

    if (response.success) {
      setSelectedMainCategory(value);
    }
    setIsLoadingMainCategory(false);
  };

  const handleFirstOptionalCategoryChange = async (value: string) => {
    setIsLoadingFirstOptionalCategory(true);
    const response = await updateGuideCategory(
      guideId,
      value,
      false,
      selectedFirstOptionalCategory,
    );
    if (response.success) {
      setSelectedFirstOptionalCategory(value);
    }
    setIsLoadingFirstOptionalCategory(false);
  };

  const handleSecondOptionalCategoryChange = async (value: string) => {
    setIsLoadingSecondOptionalCategory(true);
    const response = await updateGuideCategory(
      guideId,
      value,
      false,
      selectedSecondOptionalCategory,
    );
    if (response.success) {
      setSelectedSecondOptionalCategory(value);
    }
    setIsLoadingSecondOptionalCategory(false);
  };

  const handleClearMainCategory = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();
    setIsLoadingMainCategory(true);
    const response = await deleteGuideCategory(
      guideId,
      selectedMainCategory ?? '',
    );
    if (response.success) {
      setSelectedMainCategory(undefined);
      setKeyMain(+new Date());
    }
    setIsLoadingMainCategory(false);
  };

  const handleClearFirstOptionalCategory = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();
    setIsLoadingFirstOptionalCategory(true);
    const response = await deleteGuideCategory(
      guideId,
      selectedFirstOptionalCategory ?? '',
    );
    if (response.success) {
      setSelectedFirstOptionalCategory(undefined);
      setKeyFirstOptional(+new Date());
    }
    setIsLoadingFirstOptionalCategory(false);
  };

  const handleClearSecondOptionalCategory = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();
    setIsLoadingSecondOptionalCategory(true);
    const response = await deleteGuideCategory(
      guideId,
      selectedSecondOptionalCategory ?? '',
    );
    if (response.success) {
      setSelectedSecondOptionalCategory(undefined);
      setKeySecondOptional(+new Date());
    }
    setIsLoadingSecondOptionalCategory(false);
  };

  return (
    <Card className="text-[#344054] shadow-none border-[#e0e0e0] rounded-md">
      <CardHeader>
        <CardTitle>Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="main-category">Main category</Label>
            <div className="flex gap-1">
              <Select
                onValueChange={handleMainCategoryChange}
                key={keyMain}
                value={selectedMainCategory}
                defaultValue={selectedMainCategory}
                disabled={isLoadingMainCategory}
              >
                <SelectTrigger
                  id="main-category"
                  aria-label="Select main category"
                  className="h-14 border-[#d9d9d9] text-[#535773] focus:ring-0 focus:ring-transparent"
                >
                  <SelectValue placeholder="Select the main category"></SelectValue>
                </SelectTrigger>
                <SelectContent className="text-[#535773]">
                  {filterCategories([
                    selectedFirstOptionalCategory ?? '',
                    selectedSecondOptionalCategory ?? '',
                  ]).map((category) => (
                    <SelectItem
                      key={category.short_name}
                      value={category.id.toString()}
                    >
                      {category.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isLoadingMainCategory && (
                <div className="flex items-center justify-center">
                  <LoaderIcon className="h-5 w-5 animate-spin" />
                </div>
              )}
              {!isLoadingMainCategory && selectedMainCategory && (
                <Button
                  variant="ghost"
                  onClick={handleClearMainCategory}
                  className="hover:bg-transparent p-0 m-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="first-optional-category">
              First optional category
            </Label>
            <div className="flex gap-1">
              <Select
                key={keyFirstOptional}
                onValueChange={handleFirstOptionalCategoryChange}
                value={selectedFirstOptionalCategory}
                defaultValue={selectedFirstOptionalCategory}
                disabled={isLoadingFirstOptionalCategory}
              >
                <SelectTrigger
                  id="first-optional-category"
                  aria-label="Select first optional category"
                  className="h-14 border-[#d9d9d9] text-[#535773] focus:ring-0 focus:ring-transparent"
                >
                  <SelectValue placeholder="Select an additional category" />
                </SelectTrigger>
                <SelectContent className="text-[#535773]">
                  {filterCategories([
                    selectedMainCategory ?? '',
                    selectedSecondOptionalCategory ?? '',
                  ]).map((category) => (
                    <SelectItem
                      key={category.short_name}
                      value={category.id.toString()}
                    >
                      {category.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isLoadingFirstOptionalCategory && (
                <div className="flex items-center justify-center">
                  <LoaderIcon className="h-5 w-5 animate-spin" />
                </div>
              )}
              {!isLoadingFirstOptionalCategory &&
                selectedFirstOptionalCategory && (
                  <Button
                    variant="ghost"
                    onClick={handleClearFirstOptionalCategory}
                    className="hover:bg-transparent p-0 m-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="second-optional-category">
              Second optional category
            </Label>
            <div className="flex gap-1">
              <Select
                key={keySecondOptional}
                onValueChange={handleSecondOptionalCategoryChange}
                value={selectedSecondOptionalCategory}
                defaultValue={selectedSecondOptionalCategory}
                disabled={isLoadingSecondOptionalCategory}
              >
                <SelectTrigger
                  id="second-optional-category"
                  aria-label="Select second optional category"
                  className="h-14 border-[#d9d9d9] text-[#535773] focus:ring-0 focus:ring-transparent"
                >
                  <SelectValue placeholder="Select an additional category" />
                </SelectTrigger>
                <SelectContent className="text-[#535773]">
                  {filterCategories([
                    selectedMainCategory ?? '',
                    selectedFirstOptionalCategory ?? '',
                  ]).map((category) => (
                    <SelectItem
                      key={category.short_name}
                      value={category.id.toString()}
                    >
                      {category.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isLoadingSecondOptionalCategory && (
                <div className="flex items-center justify-center">
                  <LoaderIcon className="h-5 w-5 animate-spin" />
                </div>
              )}
              {!isLoadingSecondOptionalCategory &&
                selectedSecondOptionalCategory && (
                  <Button
                    variant="ghost"
                    onClick={handleClearSecondOptionalCategory}
                    className="hover:bg-transparent p-0 m-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
