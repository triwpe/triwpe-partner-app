import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useState } from "react";

const categories = [
  { value: "budget", label: "Budget-Friendly" },
  { value: "luxury", label: "Luxury Experience" },
  { value: "food", label: "Food and Culinary" },
  { value: "historic", label: "Historic and Heritage" },
  { value: "adventure", label: "Adventure" },
  { value: "cultural", label: "Cultural" },
  { value: "romantic", label: "Romantic Gateway" },
  { value: "solo", label: "Solo Traveler's" },
  { value: "art", label: "Art and Architecture" },
  { value: "wellness", label: "Wellness and Relaxation" },
  { value: "beach", label: "Beach and Island" },
  { value: "backpacker", label: "Backpacker's" },
  { value: "roadtrip", label: "Road Trip" },
  { value: "wildlife", label: "Wildlife and Nature" },
  { value: "family", label: "Family Friendly" },
  { value: "city", label: "City Tours" },
  { value: "shopping", label: "Shopping" },
  { value: "festival", label: "Festival and Events" },
  { value: "mountain", label: "Mountain and Hiking" },
  { value: "cruise", label: "Cruise" },
  { value: "spiritual", label: "Spiritual and Retreats" },
  { value: "nightlife", label: "Nightlife" },
  { value: "photography", label: "Photography" },
  { value: "ecotourism", label: "Ecotourism" },
  { value: "winter", label: "Winter and Snow" },
];

export function GuideCategoriesForm() {
  const [keyMain, setKeyMain] = useState(+new Date());
  const [keyFirstOptional, setKeyFirstOptional] = useState(+new Date());
  const [keySecondOptional, setKeySecondOptional] = useState(+new Date());

  const [selectedMainCategory, setSelectedMainCategory] = useState<
    string | undefined
  >(undefined);
  const [selectedFirstOptionalCategory, setSelectedFirstOptionalCategory] =
    useState<string | undefined>(undefined);
  const [selectedSecondOptionalCategory, setSelectedSecondOptionalCategory] =
    useState<string | undefined>(undefined);

  const filterCategories = (exclude: string[]) => {
    return categories.filter((category) => !exclude.includes(category.value));
  };

  const handleMainCategoryChange = (value: any) => {
    setSelectedMainCategory(value);
  };

  const handleFirstOptionalCategoryChange = (value: string) => {
    setSelectedFirstOptionalCategory(value);
  };

  const handleSecondOptionalCategoryChange = (value: string) => {
    setSelectedSecondOptionalCategory(value);
  };

  const handleClearMainCategory = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSelectedMainCategory(undefined);
    setKeyMain(+new Date());
  };

  const handleClearFirstOptionalCategory = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    setSelectedFirstOptionalCategory(undefined);
    setKeyFirstOptional(+new Date());
  };

  const handleClearSecondOptionalCategory = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    setSelectedSecondOptionalCategory(undefined);
    setKeySecondOptional(+new Date());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="main-category">Main category</Label>
            <div className="flex gap-1">
              <Select
                onValueChange={handleMainCategoryChange}
                key={keyMain}
                value={selectedMainCategory}
                defaultValue={selectedMainCategory}
              >
                <SelectTrigger
                  id="main-category"
                  aria-label="Select main category"
                >
                  <SelectValue placeholder="Select the main category"></SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {filterCategories([
                    selectedFirstOptionalCategory ?? "",
                    selectedSecondOptionalCategory ?? "",
                  ]).map((category) => (
                    <SelectItem
                      key={category.value}
                      value={category.value.toString()}
                    >
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedMainCategory && (
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

          <div className="grid gap-3">
            <Label htmlFor="first-optional-category">
              First optional category
            </Label>
            <div className="flex gap-1">
              <Select
                key={keyFirstOptional}
                onValueChange={handleFirstOptionalCategoryChange}
                value={selectedFirstOptionalCategory}
                defaultValue={selectedFirstOptionalCategory}
              >
                <SelectTrigger
                  id="first-optional-category"
                  aria-label="Select first optional category"
                >
                  <SelectValue placeholder="Select an additional category" />
                </SelectTrigger>
                <SelectContent>
                  {filterCategories([
                    selectedMainCategory ?? "",
                    selectedSecondOptionalCategory ?? "",
                  ]).map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedFirstOptionalCategory && (
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

          <div className="grid gap-3">
            <Label htmlFor="second-optional-category">
              Second optional category
            </Label>
            <div className="flex gap-1">
              <Select
                key={keySecondOptional}
                onValueChange={handleSecondOptionalCategoryChange}
                value={selectedSecondOptionalCategory}
                defaultValue={selectedSecondOptionalCategory}
              >
                <SelectTrigger
                  id="second-optional-category"
                  aria-label="Select second optional category"
                >
                  <SelectValue placeholder="Select an additional category" />
                </SelectTrigger>
                <SelectContent>
                  {filterCategories([
                    selectedMainCategory ?? "",
                    selectedFirstOptionalCategory ?? "",
                  ]).map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedSecondOptionalCategory && (
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
