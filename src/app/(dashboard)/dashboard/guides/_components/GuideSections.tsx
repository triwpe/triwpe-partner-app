import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpDown, Plus } from "lucide-react";
import { useState } from "react";

const sections = [
  {
    guide_section_id: "e3ef4f2f-0494-45d9-9f12-4f37a5e242f8",
    guide_id: "81cbdc22-251f-422f-a183-e5c39d398b9c",
    menu_title: "Introdução",
    full_title: "Bem-vindo a Tokyo! \uD83C\uDF06",
    description:
      "Uma breve introdução à cidade de Tokyo e o que esperar deste guia. \uD83D\uDDFC",
    section_order: 1,
    is_visible_on_demo: true,
    created_at: "2024-07-12 12:03:51.462722 +00:00",
    updated_at: null,
  },
  {
    guide_section_id: "34179733-0ce7-4755-aa5e-6debf452240e",
    guide_id: "81cbdc22-251f-422f-a183-e5c39d398b9c",
    menu_title: "Transporte",
    full_title: "Como se locomover em Tokyo \uD83D\uDE89",
    description:
      "Dicas e informações sobre o sistema de transporte público em Tokyo, incluindo metrô e ônibus. \uD83D\uDE87",
    section_order: 2,
    is_visible_on_demo: false,
    created_at: "2024-07-12 12:03:56.560820 +00:00",
    updated_at: null,
  },
  {
    guide_section_id: "e685c236-a67f-4264-833a-20be9c75b2f7",
    guide_id: "81cbdc22-251f-422f-a183-e5c39d398b9c",
    menu_title: "Alimentação",
    full_title: "Onde comer em Tokyo \uD83C\uDF63",
    description:
      "Recomendações dos melhores restaurantes e comidas de rua em Tokyo. \uD83C\uDF5C",
    section_order: 3,
    is_visible_on_demo: false,
    created_at: "2024-07-12 12:03:56.609534 +00:00",
    updated_at: null,
  },
  {
    guide_section_id: "41825a25-11d7-47e5-a4ff-5825c6c65a24",
    guide_id: "81cbdc22-251f-422f-a183-e5c39d398b9c",
    menu_title: "Dia 1",
    full_title: "Primeiro Dia em Tokyo \uD83D\uDDFC",
    description:
      "Explorando os principais pontos turísticos de Shinjuku e Shibuya. \uD83C\uDF06",
    section_order: 4,
    is_visible_on_demo: false,
    created_at: "2024-07-12 12:03:56.646745 +00:00",
    updated_at: null,
  },
  {
    guide_section_id: "a47e1dc9-cae1-4dd0-b3ec-cf8084b6d3e4",
    guide_id: "81cbdc22-251f-422f-a183-e5c39d398b9c",
    menu_title: "Dia 2",
    full_title: "Segundo Dia em Tokyo \uD83C\uDFEF",
    description: "Visitando Asakusa, Akihabara e Ueno. \uD83C\uDF8E",
    section_order: 5,
    is_visible_on_demo: false,
    created_at: "2024-07-12 12:03:56.687150 +00:00",
    updated_at: null,
  },
  {
    guide_section_id: "3721546a-7bc5-483f-aacb-fd7585f4f04c",
    guide_id: "81cbdc22-251f-422f-a183-e5c39d398b9c",
    menu_title: "Dia 3",
    full_title: "Terceiro Dia em Tokyo \uD83C\uDF38",
    description:
      "Passeios em Odaiba e Roppongi, terminando com uma vista noturna da cidade. \uD83C\uDF03",
    section_order: 6,
    is_visible_on_demo: false,
    created_at: "2024-07-12 12:03:56.729983 +00:00",
    updated_at: null,
  },
];

export function GuideSections() {
  const [selectedSection, setSelectedSection] = useState<string | undefined>(
    undefined
  );
  const [menuTitle, setMenuTitle] = useState("");
  const [fullTitle, setFullTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSectionChange = (value: string) => {
    setSelectedSection(value);

    const findSection = sections.find(
      (section) => section.guide_section_id === value
    );
    if (findSection) {
      setMenuTitle(findSection.menu_title);
      setFullTitle(findSection.full_title);
      setDescription(findSection.description);
      setVisible(findSection.is_visible_on_demo);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guide Sections</CardTitle>
        <CardDescription>Manage the sections of your guide</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="flex justify-between gap-3 pb-4">
            <Select
              onValueChange={handleSectionChange}
              value={selectedSection}
              defaultValue={selectedSection}
            >
              <SelectTrigger
                id="status"
                aria-label="Select status"
                className="w-1/2"
              >
                <SelectValue placeholder="Select to edit" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem
                    key={section.guide_section_id}
                    value={section.guide_section_id}
                  >
                    {section.menu_title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-1">
              <Button size="sm">
                <Plus className="h-4 w-4" />
                Add Section
              </Button>
              <Button size="sm">
                <ArrowUpDown className="h-4 w-4" />
                Reorder
              </Button>
            </div>
          </div>
          {selectedSection && (
            <>
              <div className="grid gap-3">
                <Label htmlFor="name">Menu Title</Label>
                <Input
                  id="name"
                  type="text"
                  className="w-full"
                  value={menuTitle}
                  onChange={(e) => setMenuTitle(e.target.value)}
                  placeholder="Enter the menu title"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="name">Full Title</Label>
                <Input
                  id="name"
                  type="text"
                  className="w-full"
                  value={fullTitle}
                  onChange={(e) => setFullTitle(e.target.value)}
                  placeholder="Enter the full title"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write a description for your guide"
                  className="min-h-32"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="airplane-mode"
                  checked={visible}
                  onCheckedChange={(e) => setVisible(e)}
                />
                <Label htmlFor="airplane-mode">Visible on demo?</Label>
              </div>
              <div className="flex gap-2">
                <Button size="default">Update Section</Button>
                <Button size="default">Delete Section</Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
