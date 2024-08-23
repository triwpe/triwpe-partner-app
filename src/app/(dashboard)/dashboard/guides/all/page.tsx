"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

import { fetchGuides } from "@/actions/guide";
import { GuideModel } from "@/types/models/guides";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function Page() {
  const [guides, setGuides] = useState<GuideModel[]>([]);

  useEffect(() => {
    fetchGuidesData();
  }, []);

  const fetchGuidesData = async () => {
    const { success, data, message } = await fetchGuides();
    if (!success) {
      return;
    }

    setGuides(data || []);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Language</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guides.map((guide) => (
            <TableRow key={guide.id}>
              <TableCell>
                <Link href={`/dashboard/guides/${guide.id}`}>
                  {guide.title}
                </Link>
              </TableCell>
              <TableCell>{guide.location.placeName}</TableCell>
              <TableCell>{guide.duration}</TableCell>
              <TableCell className="text-right">{guide.price}</TableCell>
              <TableCell className="text-right">{guide.language}</TableCell>
              <TableCell>
                {guide.categories?.map((category) => (
                  <Badge key={category.id}>{category.shortName}</Badge>
                ))}
              </TableCell>
              <TableCell>{guide.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// id: string;
// title: string;
// location: MaptilerLocationModel;
// description?: string;
// duration?: number;
// price?: number;
// language?: string;
// categories?: GuideCategoryModel[];
// status: string;
// authorId: string;
// createdAt: Date;
// updatedAt?: Date;
